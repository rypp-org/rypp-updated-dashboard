"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "../_lib/api/auth";
import { getStoredToken } from "../_lib/api/client";
import type {
  ChangePasswordRequest,
  GenericMessageResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from "../_lib/api/types";

export type AuthModalMode = "login" | "register" | "forgot" | "otp" | "verify";

export interface PendingVerificationData {
  email?: string;
  phone?: string;
  password?: string;
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: PendingVerificationData | null;
  setPendingVerification: (data: PendingVerificationData | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<{ requiresVerification: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<UserProfile>;
  forgotPassword: (email: string) => Promise<GenericMessageResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<GenericMessageResponse>;
  changePassword: (data: ChangePasswordRequest) => Promise<GenericMessageResponse>;
  sendOtp: (target: string | { phone?: string; email?: string }, type?: "email" | "phone") => Promise<GenericMessageResponse>;
  verifyOtp: (target: string | { phone?: string; email?: string; otp: string }, otpParam?: string) => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: (mode?: AuthModalMode, initialData?: PendingVerificationData) => void;
  closeAuthModal: () => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [pendingVerification, setPendingVerification] = useState<PendingVerificationData | null>(null);

  const refreshUser = useCallback(async () => {
    const existingToken = getStoredToken();
    if (!existingToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    setToken(existingToken);
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch (err) {
      console.warn("Failed to fetch current user profile:", err);
      authApi.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res.access_token) {
        setToken(res.access_token);
      }
      if (res.user) {
        setUser(res.user);
      } else {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch {
          setUser({
            id: "user-1",
            name: credentials.email.split("@")[0],
            email: credentials.email,
          });
        }
      }
      setPendingVerification(null);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      setPendingVerification({
        email: data.email,
        phone: data.phone,
        password: data.password,
        name: data.name,
      });

      const res = await authApi.register(data);

      // If backend issued token directly without requiring OTP
      if (res.access_token && !res.requires_verification) {
        setToken(res.access_token);
        if (res.user) {
          setUser(res.user);
        } else {
          try {
            const profile = await authApi.getMe();
            setUser(profile);
          } catch {
            setUser({
              id: "user-new",
              name: data.name,
              email: data.email,
              phone: data.phone,
            });
          }
        }
        setAuthModalOpen(false);
        return { requiresVerification: false, message: "Account created and logged in!" };
      }

      // Backend requires OTP verification (sent to Gmail / phone)
      setAuthModalMode("verify");
      return {
        requiresVerification: true,
        message: res.message || res.detail || `Verification OTP sent to ${data.email}${data.phone ? ` & ${data.phone}` : ""}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (
    target: string | { phone?: string; email?: string; otp: string },
    otpParam?: string
  ) => {
    setIsLoading(true);
    try {
      let email = pendingVerification?.email;
      let phone = pendingVerification?.phone;
      let otp = "";

      if (typeof target === "string") {
        otp = otpParam || "";
        if (target.includes("@")) {
          email = target;
        } else {
          phone = target;
        }
      } else {
        otp = target.otp;
        email = target.email || email;
        phone = target.phone || phone;
      }

      const res = await authApi.verifyOtp({ email, phone, otp });

      let activeToken = res.access_token;

      // If the backend didn't return a token upon verification, but we have saved password from registration, automatically login
      if (!activeToken && email && pendingVerification?.password) {
        try {
          const loginRes = await authApi.login({
            email,
            password: pendingVerification.password,
          });
          activeToken = loginRes.access_token;
          if (loginRes.user) {
            setUser(loginRes.user);
          }
        } catch {
          // Ignore fallback login error
        }
      }

      if (activeToken) {
        setToken(activeToken);
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch {
          setUser({
            id: email ? `user-${email.split("@")[0]}` : `user-${phone?.slice(-4)}`,
            name: pendingVerification?.name || email?.split("@")[0] || "Verified User",
            email: email || `${phone?.replace(/\D/g, "")}@rypp.in`,
            phone,
          });
        }
      } else {
        // Fallback user state
        setUser({
          id: "user-verified",
          name: pendingVerification?.name || email?.split("@")[0] || "Verified User",
          email: email || `${phone?.replace(/\D/g, "")}@rypp.in`,
          phone,
        });
      }

      setPendingVerification(null);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
    return updated;
  };

  const forgotPassword = async (email: string) => {
    return authApi.forgotPassword(email);
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    return authApi.resetPassword(data);
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    return authApi.changePassword(data);
  };

  const sendOtp = async (
    target: string | { phone?: string; email?: string },
    type?: "email" | "phone"
  ) => {
    return authApi.sendOtp(target, type);
  };

  const logout = () => {
    authApi.logoutServer();
    setUser(null);
    setToken(null);
    setPendingVerification(null);
  };

  const openAuthModal = (mode: AuthModalMode = "login", initialData?: PendingVerificationData) => {
    setAuthModalMode(mode);
    if (initialData) {
      setPendingVerification(initialData);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        pendingVerification,
        setPendingVerification,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        forgotPassword,
        resetPassword,
        changePassword,
        sendOtp,
        verifyOtp,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
