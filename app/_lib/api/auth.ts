// Auth API Service for RYPP Backend (All Endpoints)
// 1. POST /api/v1/auth/login
// 2. POST /api/v1/auth/register
// 3. GET  /api/v1/auth/me
// 4. POST /api/v1/auth/refresh
// 5. POST /api/v1/auth/logout
// 6. POST /api/v1/auth/forgot-password
// 7. POST /api/v1/auth/reset-password
// 8. PUT  /api/v1/auth/me (Update profile)
// 9. POST /api/v1/auth/change-password
// 10. POST /api/v1/auth/send-otp
// 11. POST /api/v1/auth/verify-otp

import {
  apiClient,
  clearStoredToken,
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
  ApiError,
} from "./client";
import type {
  AuthResponse,
  ChangePasswordRequest,
  GenericMessageResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "./types";

export const authApi = {
  /**
   * API 1: Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const payload = {
      username: credentials.email,
      email: credentials.email,
      password: credentials.password,
    };

    const candidatePaths = [
      "api/v1/auth/login",
      "auth/login",
      "api/v1/auth/token",
      "auth/token",
      "token",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const res = await apiClient<AuthResponse>(path, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (res && (res.access_token || (res as any).token)) {
          const token = res.access_token || (res as any).token;
          setStoredToken(token);
          if (res.refresh_token) {
            setStoredRefreshToken(res.refresh_token);
          }
          return {
            ...res,
            access_token: token,
          };
        }
        return res;
      } catch (err: any) {
        lastError = err;

        // If FastAPI expects application/x-www-form-urlencoded (OAuth2 standard)
        if (err.status === 422 || err.status === 415) {
          try {
            const formBody = new URLSearchParams();
            formBody.append("username", credentials.email);
            formBody.append("password", credentials.password);

            const formRes = await apiClient<AuthResponse>(path, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formBody.toString(),
            });

            if (formRes && (formRes.access_token || (formRes as any).token)) {
              const token = formRes.access_token || (formRes as any).token;
              setStoredToken(token);
              if (formRes.refresh_token) {
                setStoredRefreshToken(formRes.refresh_token);
              }
              return {
                ...formRes,
                access_token: token,
              };
            }
            return formRes;
          } catch (formErr) {
            lastError = formErr;
          }
        }

        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to login on all auth endpoints", 500);
  },

  /**
   * API 2: Register a new user account
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const candidatePaths = [
      "api/v1/auth/register",
      "auth/register",
      "api/v1/auth/signup",
      "auth/signup",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const res = await apiClient<AuthResponse>(path, {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (res && (res.access_token || (res as any).token)) {
          const token = res.access_token || (res as any).token;
          setStoredToken(token);
          if (res.refresh_token) {
            setStoredRefreshToken(res.refresh_token);
          }
          return {
            ...res,
            access_token: token,
          };
        }
        return res;
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to register on all auth endpoints", 500);
  },

  /**
   * API 3: Fetch current authenticated user's profile
   */
  async getMe(): Promise<UserProfile> {
    const candidatePaths = [
      "api/v1/auth/me",
      "auth/me",
      "api/v1/users/me",
      "users/me",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const profile = await apiClient<UserProfile>(path, {
          method: "GET",
        });
        if (profile) return profile;
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to retrieve profile on me endpoints", 500);
  },

  /**
   * API 4: Refresh Access Token
   * Endpoint: POST /api/v1/auth/refresh
   */
  async refreshToken(customRefreshToken?: string): Promise<AuthResponse> {
    const token = customRefreshToken || getStoredRefreshToken() || getStoredToken();
    const candidatePaths = [
      "api/v1/auth/refresh",
      "auth/refresh",
      "api/v1/auth/refresh-token",
      "auth/refresh-token",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const res = await apiClient<AuthResponse>(path, {
          method: "POST",
          body: JSON.stringify({ refresh_token: token }),
        });

        if (res && (res.access_token || (res as any).token)) {
          const newToken = res.access_token || (res as any).token;
          setStoredToken(newToken);
          if (res.refresh_token) {
            setStoredRefreshToken(res.refresh_token);
          }
          return { ...res, access_token: newToken };
        }
        return res;
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to refresh token", 500);
  },

  /**
   * API 5: Server-side Logout
   * Endpoint: POST /api/v1/auth/logout
   */
  async logoutServer(): Promise<GenericMessageResponse> {
    const candidatePaths = ["api/v1/auth/logout", "auth/logout"];
    let result: GenericMessageResponse = { message: "Logged out locally" };

    for (const path of candidatePaths) {
      try {
        result = await apiClient<GenericMessageResponse>(path, {
          method: "POST",
        });
        break;
      } catch {
        // Continue and clear locally anyway
      }
    }

    clearStoredToken();
    return result;
  },

  /**
   * API 6: Forgot Password Request
   * Endpoint: POST /api/v1/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<GenericMessageResponse> {
    const candidatePaths = [
      "api/v1/auth/forgot-password",
      "auth/forgot-password",
      "api/v1/auth/password-recovery",
      "auth/password-recovery",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<GenericMessageResponse>(path, {
          method: "POST",
          body: JSON.stringify({ email }),
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to send forgot password request", 500);
  },

  /**
   * API 7: Reset Password with Token / OTP
   * Endpoint: POST /api/v1/auth/reset-password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<GenericMessageResponse> {
    const candidatePaths = [
      "api/v1/auth/reset-password",
      "auth/reset-password",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<GenericMessageResponse>(path, {
          method: "POST",
          body: JSON.stringify(data),
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to reset password", 500);
  },

  /**
   * API 8: Update User Profile
   * Endpoint: PUT /api/v1/auth/me or PATCH /api/v1/auth/me
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const candidatePaths = [
      "api/v1/auth/me",
      "auth/me",
      "api/v1/users/me",
      "users/me",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<UserProfile>(path, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } catch (err: any) {
        if (err.status === 405) {
          // If PUT not allowed, try PATCH
          try {
            return await apiClient<UserProfile>(path, {
              method: "PATCH",
              body: JSON.stringify(data),
            });
          } catch (patchErr) {
            lastError = patchErr;
          }
        } else {
          lastError = err;
        }

        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to update profile", 500);
  },

  /**
   * API 9: Change Password (Authenticated)
   * Endpoint: POST /api/v1/auth/change-password
   */
  async changePassword(data: ChangePasswordRequest): Promise<GenericMessageResponse> {
    const candidatePaths = [
      "api/v1/auth/change-password",
      "auth/change-password",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<GenericMessageResponse>(path, {
          method: "POST",
          body: JSON.stringify(data),
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to change password", 500);
  },

  /**
   * API 10: Send Mobile OTP
   * Endpoint: POST /api/v1/auth/send-otp
   */
  async sendOtp(phone: string): Promise<GenericMessageResponse> {
    const candidatePaths = [
      "api/v1/auth/send-otp",
      "auth/send-otp",
      "api/v1/auth/otp/send",
      "auth/otp/send",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<GenericMessageResponse>(path, {
          method: "POST",
          body: JSON.stringify({ phone }),
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to send OTP", 500);
  },

  /**
   * API 11: Verify Mobile OTP & Authenticate
   * Endpoint: POST /api/v1/auth/verify-otp
   */
  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    const candidatePaths = [
      "api/v1/auth/verify-otp",
      "auth/verify-otp",
      "api/v1/auth/otp/verify",
      "auth/otp/verify",
    ];

    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const res = await apiClient<AuthResponse>(path, {
          method: "POST",
          body: JSON.stringify({ phone, otp }),
        });

        if (res && (res.access_token || (res as any).token)) {
          const token = res.access_token || (res as any).token;
          setStoredToken(token);
          if (res.refresh_token) {
            setStoredRefreshToken(res.refresh_token);
          }
          return {
            ...res,
            access_token: token,
          };
        }
        return res;
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to verify OTP", 500);
  },

  /**
   * Clear local session tokens
   */
  logout(): void {
    clearStoredToken();
  },

  /**
   * Check if token currently exists in storage
   */
  hasToken(): boolean {
    return Boolean(getStoredToken());
  },
};
