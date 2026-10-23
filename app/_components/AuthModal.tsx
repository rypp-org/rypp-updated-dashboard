"use client";

import { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAuth, type AuthModalMode } from "../_context/AuthContext";
import { Logo } from "./Logo";

export function AuthModal() {
  const {
    authModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    pendingVerification,
    setPendingVerification,
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
  const [verifyChannel, setVerifyChannel] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Sync state when pendingVerification or modal opens
  useEffect(() => {
    if (authModalOpen) {
      if (pendingVerification?.email) {
        setEmail(pendingVerification.email);
        setVerifyChannel("email");
      }
      if (pendingVerification?.phone) {
        setPhone(pendingVerification.phone);
        if (!pendingVerification.email) {
          setVerifyChannel("phone");
        }
      }
      if (pendingVerification?.name) {
        setName(pendingVerification.name);
      }
      if (authModalMode === "verify") {
        setOtpSent(true);
        setCountdown(30);
      }
    }
  }, [authModalOpen, pendingVerification, authModalMode]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus OTP input when entering verify mode
  useEffect(() => {
    if ((authModalMode === "verify" || (authModalMode === "otp" && otpSent)) && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [authModalMode, otpSent]);

  if (!authModalOpen) return null;

  const handleSendMobileOtp = async () => {
    if (!phone) {
      setErrorMsg("Please enter your mobile phone number.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await sendOtp(phone, "phone");
      setOtpSent(true);
      setCountdown(30);
      setSuccessMsg(res.message || `OTP sent to ${phone}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send mobile OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;
    setErrorMsg(null);
    setResending(true);

    try {
      const target = verifyChannel === "email" ? (email || pendingVerification?.email) : (phone || pendingVerification?.phone);
      if (!target) {
        setErrorMsg("Target identifier missing. Please re-enter your email or phone.");
        return;
      }

      const res = await sendOtp(target, verifyChannel);
      setCountdown(30);
      setSuccessMsg(res.message || `Fresh verification OTP dispatched to ${target}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
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
          setErrorMsg("Please enter both your email address and password.");
          setLoading(false);
          return;
        }
        await login({ email, password });
        setSuccessMsg("Signed in successfully!");
      } else if (authModalMode === "register") {
        if (!name || !email || !password) {
          setErrorMsg("Please fill in your name, email address, and password.");
          setLoading(false);
          return;
        }

        const regResult = await register({ name, email, password, phone });

        if (regResult.requiresVerification) {
          setOtpSent(true);
          setCountdown(30);
          setVerifyChannel("email");
          setSuccessMsg(
            regResult.message || `Account created! Verification code sent to ${email}. Please enter it below.`
          );
        } else {
          setSuccessMsg("Account created and verified! Welcome to RYPP.");
        }
      } else if (authModalMode === "verify") {
        if (!otp || otp.trim().length < 4) {
          setErrorMsg("Please enter the 6-digit OTP code received.");
          setLoading(false);
          return;
        }

        const targetEmail = verifyChannel === "email" ? (email || pendingVerification?.email) : undefined;
        const targetPhone = verifyChannel === "phone" ? (phone || pendingVerification?.phone) : undefined;

        await verifyOtp({
          email: targetEmail,
          phone: targetPhone,
          otp: otp.trim(),
        });

        setSuccessMsg("Account successfully verified! Welcome to RYPP.");
      } else if (authModalMode === "otp") {
        if (!otpSent) {
          await handleSendMobileOtp();
          setLoading(false);
          return;
        }
        if (!otp || otp.trim().length < 4) {
          setErrorMsg("Please enter the 6-digit OTP code sent to your phone.");
          setLoading(false);
          return;
        }
        await verifyOtp(phone, otp.trim());
        setSuccessMsg("Mobile number verified & signed in!");
      } else if (authModalMode === "forgot") {
        if (!email) {
          setErrorMsg("Please enter your registered email address.");
          setLoading(false);
          return;
        }
        const res = await forgotPassword(email);
        setSuccessMsg(res.message || "Password recovery instructions sent to your email!");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(
        err.message || "Authentication request failed. Please check your credentials or OTP code."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    if (authModalMode === "register") {
      setName("Rahul Sharma");
      setEmail(`rahul_${Math.floor(Math.random() * 8999 + 1000)}@gmail.com`);
      setPassword("RyppPass2026!");
      setPhone("+91 98765 43210");
    } else if (authModalMode === "verify") {
      setOtp("123456");
    } else if (authModalMode === "otp") {
      setPhone("+91 98765 43210");
      setOtp("123456");
      setOtpSent(true);
    } else {
      setEmail("demo@rypp.in");
      setPassword("rypp1234");
    }
    setErrorMsg(null);
  };

  const switchMode = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtp("");
    if (mode !== "verify") {
      setOtpSent(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 z-10 my-8">
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
              : authModalMode === "verify"
              ? "Verify Your Account OTP"
              : authModalMode === "otp"
              ? "Sign in with Mobile OTP"
              : "Reset Account Password"}
          </h2>
          <p className="mt-1 text-xs text-muted max-w-xs">
            {authModalMode === "login"
              ? "Sign in to manage bookings and verified rentals"
              : authModalMode === "register"
              ? "Join Bengaluru's premier self-drive vehicle fleet"
              : authModalMode === "verify"
              ? "Enter the verification OTP sent to your registered Gmail / Phone"
              : authModalMode === "otp"
              ? "Instant login via verification code to your phone"
              : "We will send recovery instructions to your email"}
          </p>
        </div>

        {/* Tab Switcher (Login / Register / OTP) - Only visible when not in verify/forgot mode */}
        {authModalMode !== "forgot" && authModalMode !== "verify" && (
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
              <p className="font-semibold">Authentication Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{successMsg}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* ================= REGISTER VIEW ================= */}
          {authModalMode === "register" && (
            <>
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

              <div>
                <label className="block text-xs font-semibold text-ink">
                  Gmail / Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  We will send a 6-digit verification OTP to this email address.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">
                  Mobile Number (Optional)
                </label>
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">
                  Password
                </label>
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
            </>
          )}

          {/* ================= LOGIN VIEW ================= */}
          {authModalMode === "login" && (
            <>
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

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-ink">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[11px] font-medium text-brand hover:underline"
                  >
                    Forgot password?
                  </button>
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
            </>
          )}

          {/* ================= MOBILE OTP VIEW ================= */}
          {authModalMode === "otp" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-ink">
                  Mobile Number
                </label>
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    type="tel"
                    required
                    disabled={otpSent}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-ink transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-line/30 disabled:text-muted"
                  />
                </div>
                {otpSent && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-medium">OTP sent to {phone}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-brand hover:underline font-semibold"
                    >
                      Change number
                    </button>
                  </div>
                )}
              </div>

              {otpSent && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-ink">
                      Enter 6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      disabled={countdown > 0 || resending}
                      onClick={handleResendOtp}
                      className="text-[11px] font-medium text-brand hover:underline disabled:text-muted disabled:no-underline"
                    >
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : resending
                        ? "Sending..."
                        : "Resend Code"}
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input
                      ref={otpInputRef}
                      type="text"
                      maxLength={6}
                      required
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-base font-mono font-bold tracking-[0.4em] text-center text-ink transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted">
                    Check your mobile SMS messages for the 6-digit code.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ================= DEDICATED VERIFY OTP VIEW (GMAIL / MOBILE) ================= */}
          {authModalMode === "verify" && (
            <div className="space-y-4">
              {/* Channel Selector Toggle if both email and phone are present */}
              {(email || pendingVerification?.email) && (phone || pendingVerification?.phone) && (
                <div className="flex rounded-xl bg-line/60 p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyChannel("email");
                      setOtp("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${
                      verifyChannel === "email"
                        ? "bg-white text-ink font-bold shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <Mail className="size-3.5" />
                    Gmail OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyChannel("phone");
                      setOtp("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${
                      verifyChannel === "phone"
                        ? "bg-white text-ink font-bold shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <Smartphone className="size-3.5" />
                    Mobile OTP
                  </button>
                </div>
              )}

              {/* Identifier Display & Edit Link */}
              <div className="rounded-2xl border border-line bg-line/30 p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted font-medium">
                    {verifyChannel === "email" ? "Verifying Gmail / Email:" : "Verifying Mobile:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-[11px] font-semibold text-brand hover:underline"
                  >
                    Change details
                  </button>
                </div>
                <p className="mt-1 font-semibold text-ink break-all flex items-center gap-1.5">
                  {verifyChannel === "email" ? (
                    <>
                      <Mail className="size-3.5 text-brand shrink-0" />
                      {email || pendingVerification?.email || "Registered Email"}
                    </>
                  ) : (
                    <>
                      <Smartphone className="size-3.5 text-brand shrink-0" />
                      {phone || pendingVerification?.phone || "Registered Mobile"}
                    </>
                  )}
                </p>
              </div>

              {/* OTP Input Field */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-ink">
                    Lay Down 6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    disabled={countdown > 0 || resending}
                    onClick={handleResendOtp}
                    className="text-[11px] font-medium text-brand hover:underline disabled:text-muted disabled:no-underline flex items-center gap-1"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="size-3 animate-spin" />
                        Resending...
                      </>
                    ) : countdown > 0 ? (
                      `Resend code in ${countdown}s`
                    ) : (
                      <>
                        <RefreshCw className="size-3" />
                        Resend OTP Code
                      </>
                    )}
                  </button>
                </div>

                <div className="relative mt-2">
                  <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    ref={otpInputRef}
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-2xl border-2 border-brand/30 bg-white py-3.5 pl-11 pr-4 text-center text-xl font-mono font-bold tracking-[0.4em] text-ink shadow-sm transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted text-center">
                  Check your inbox or spam folder for the code from RYPP.
                </p>
              </div>
            </div>
          )}

          {/* ================= FORGOT PASSWORD VIEW ================= */}
          {authModalMode === "forgot" && (
            <div>
              <label className="block text-xs font-semibold text-ink">
                Account Email Address
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

          {/* ================= SUBMIT BUTTON ================= */}
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
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            ) : authModalMode === "register" ? (
              <>
                <span>Create Account & Send OTP</span>
                <ArrowRight className="size-4" />
              </>
            ) : authModalMode === "verify" ? (
              <>
                <Check className="size-4" />
                <span>Verify OTP & Complete Registration</span>
              </>
            ) : authModalMode === "otp" ? (
              otpSent ? (
                <>
                  <Check className="size-4" />
                  <span>Verify Code & Sign In</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="size-4" />
                </>
              )
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back navigation options for verify / forgot */}
        {authModalMode === "verify" && (
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

        {/* Shortcut to direct OTP verification for users who already received an OTP */}
        {authModalMode === "login" && (
          <div className="mt-4 rounded-xl border border-line/60 bg-line/20 p-2.5 text-center text-[11px] text-muted">
            Already received an OTP on Gmail or Mobile?{" "}
            <button
              type="button"
              onClick={() => switchMode("verify")}
              className="font-bold text-brand hover:underline inline-flex items-center gap-0.5"
            >
              Lay down & verify OTP
              <ChevronRight className="size-3" />
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
              {authModalMode === "verify"
                ? "Fill demo OTP (123456)"
                : authModalMode === "register"
                ? "Fill demo registration"
                : "Fill demo credentials"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

