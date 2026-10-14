"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { useAuth, type AuthModalMode } from "../_context/AuthContext";
import { Logo } from "./Logo";

export function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    sendOtp,
    verifyOtp,
    forgotPassword,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSendOtp = async () => {
    if (!phone) {
      setErrorMsg("Please enter your mobile number.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      setSuccessMsg(`OTP sent to ${phone}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalMode === "login") {
        if (!email || !password) {
          setErrorMsg("Please enter both email and password.");
          setLoading(false);
          return;
        }
        await login({ email, password });
        setSuccessMsg("Signed in successfully!");
      } else if (authModalMode === "register") {
        if (!name || !email || !password) {
          setErrorMsg("Please fill in your name, email and password.");
          setLoading(false);
          return;
        }
        await register({ name, email, password, phone });
        setSuccessMsg("Account created and signed in!");
      } else if (authModalMode === "otp") {
        if (!otpSent) {
          await handleSendOtp();
          setLoading(false);
          return;
        }
        if (!otp) {
          setErrorMsg("Please enter the 6-digit OTP code.");
          setLoading(false);
          return;
        }
        await verifyOtp(phone, otp);
        setSuccessMsg("Verified and signed in!");
      } else if (authModalMode === "forgot") {
        if (!email) {
          setErrorMsg("Please enter your account email address.");
          setLoading(false);
          return;
        }
        const res = await forgotPassword(email);
        setSuccessMsg(res.message || "Password recovery instructions sent to your email!");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(
        err.message || "Authentication request failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo@rypp.in");
    setPassword("rypp1234");
    if (authModalMode === "register") {
      setName("Rahul Sharma");
      setPhone("+91 98765 43210");
    } else if (authModalMode === "otp") {
      setPhone("+91 98765 43210");
      setOtp("123456");
      setOtpSent(true);
    }
    setErrorMsg(null);
  };

  const switchMode = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-muted transition hover:bg-line hover:text-ink"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h2
            id="auth-modal-title"
            className="mt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            {authModalMode === "login"
              ? "Welcome back to RYPP"
              : authModalMode === "register"
              ? "Create your RYPP account"
              : authModalMode === "otp"
              ? "Sign in with Mobile OTP"
              : "Reset Account Password"}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {authModalMode === "login"
              ? "Sign in to manage bookings and verified rentals"
              : authModalMode === "register"
              ? "Join Bengaluru's premier self-drive vehicle fleet"
              : authModalMode === "otp"
              ? "Instant login via verification code to your phone"
              : "We will send recovery instructions to your email"}
          </p>
        </div>

        {/* Tab Switcher (Login / Register / OTP) */}
        {authModalMode !== "forgot" && (
          <div className="mt-6 grid grid-cols-3 rounded-xl bg-line/50 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-2 transition ${
                authModalMode === "login"
                  ? "bg-white text-ink shadow-sm font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-lg py-2 transition ${
                authModalMode === "register"
                  ? "bg-white text-ink shadow-sm font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className={`rounded-lg py-2 transition ${
                authModalMode === "otp"
                  ? "bg-white text-ink shadow-sm font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              Mobile OTP
            </button>
          </div>
        )}

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0 text-brand mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <p className="font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {authModalMode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-ink">
                Full Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          )}

          {(authModalMode === "login" || authModalMode === "register" || authModalMode === "forgot") && (
            <div>
              <label className="block text-xs font-semibold text-ink">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          )}

          {(authModalMode === "register" || authModalMode === "otp") && (
            <div>
              <label className="block text-xs font-semibold text-ink">
                Mobile Number
              </label>
              <div className="relative mt-1">
                <Smartphone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  required={authModalMode === "otp"}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          )}

          {authModalMode === "otp" && otpSent && (
            <div>
              <label className="block text-xs font-semibold text-ink">
                6-Digit OTP Code
              </label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-mono font-bold tracking-widest text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          )}

          {(authModalMode === "login" || authModalMode === "register") && (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-ink">
                  Password
                </label>
                {authModalMode === "login" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[11px] font-medium text-brand hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Connecting to API...
              </>
            ) : authModalMode === "login" ? (
              "Sign In to Dashboard"
            ) : authModalMode === "register" ? (
              "Create Account"
            ) : authModalMode === "otp" ? (
              otpSent ? "Verify Code & Sign In" : "Send Verification Code"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {authModalMode === "forgot" && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-xs font-semibold text-brand hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Footer Help & Demo Prefill */}
        <div className="mt-5 border-t border-line pt-4 text-center">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              API: /api/v1/auth
            </span>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="font-medium text-brand hover:underline"
            >
              Fill demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
