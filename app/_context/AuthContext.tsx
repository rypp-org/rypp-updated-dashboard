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

export type AuthModalMode = "login" | "register" | "forgot" | "otp";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<UserProfile>;
  forgotPassword: (email: string) => Promise<GenericMessageResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<GenericMessageResponse>;
  changePassword: (data: ChangePasswordRequest) => Promise<GenericMessageResponse>;
  sendOtp: (phone: string) => Promise<GenericMessageResponse>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  authModalOpen: boolean;
  openAuthModal: (mode?: AuthModalMode) => void;
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
      setToken(res.access_token);
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
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
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
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp);
      setToken(res.access_token);
      if (res.user) {
        setUser(res.user);
      } else {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch {
          setUser({
            id: `user-${phone.slice(-4)}`,
            name: `User ${phone.slice(-4)}`,
            email: `${phone.replace(/\D/g, "")}@rypp.in`,
            phone,
          });
        }
      }
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

  const sendOtp = async (phone: string) => {
    return authApi.sendOtp(phone);
  };

  const logout = () => {
    authApi.logoutServer();
    setUser(null);
    setToken(null);
  };

  const openAuthModal = (mode: AuthModalMode = "login") => {
    setAuthModalMode(mode);
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
