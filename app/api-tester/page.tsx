"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  KeyRound,
  Server,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  Shield,
  Truck,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  Lock,
  Smartphone,
  User,
  Activity,
} from "lucide-react";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { authApi } from "../_lib/api/auth";
import { vehiclesApi } from "../_lib/api/vehicles";
import { getStoredToken } from "../_lib/api/client";

interface TestResult {
  endpoint: string;
  method: string;
  status: number | "error" | "pending";
  latencyMs: number;
  data: unknown;
  error?: string;
}

export default function ApiTesterPage() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [activeTab, setActiveTab] = useState<"all" | "auth" | "vehicles">("all");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [batchRunning, setBatchRunning] = useState(false);

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState("demo@rypp.in");
  const [loginPassword, setLoginPassword] = useState("rypp1234");

  const [regName, setRegName] = useState("Ankit Kumar");
  const [regEmail, setRegEmail] = useState(`rider_${Date.now()}@rypp.in`);
  const [regPassword, setRegPassword] = useState("securePass123");
  const [regPhone, setRegPhone] = useState("+91 98765 43210");

  const [forgotEmail, setForgotEmail] = useState("demo@rypp.in");
  const [resetToken, setResetToken] = useState("demo_reset_token");
  const [resetNewPass, setResetNewPass] = useState("newSecretPass@2026");

  const [updateName, setUpdateName] = useState("Ankit K. (Verified)");
  const [updatePhone, setUpdatePhone] = useState("+91 98765 43210");

  const [currentPass, setCurrentPass] = useState("rypp1234");
  const [newPass, setNewPass] = useState("ryppUpdated@2026");

  const [otpPhone, setOtpPhone] = useState("+91 98765 43210");
  const [otpCode, setOtpCode] = useState("123456");

  // Vehicles Inputs
  const [testVehicleCategory, setTestVehicleCategory] = useState("all");
  const [testVehicleId, setTestVehicleId] = useState("re-himalayan");

  const [availStartDate, setAvailStartDate] = useState("2026-10-15");
  const [availEndDate, setAvailEndDate] = useState("2026-10-18");

  const runTest = async (key: string, runner: () => Promise<any>, endpoint: string, method: string) => {
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    const startTime = performance.now();
    try {
      const data = await runner();
      const latencyMs = Math.round(performance.now() - startTime);
      setResults((prev) => ({
        ...prev,
        [key]: {
          endpoint,
          method,
          status: 200,
          latencyMs,
          data,
        },
      }));
      setToken(getStoredToken());
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      setResults((prev) => ({
        ...prev,
        [key]: {
          endpoint,
          method,
          status: err.status || "error",
          latencyMs,
          data: err.data || null,
          error: err.message || "Request failed",
        },
      }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Auth Runners
  const testLogin = () =>
    runTest("auth_login", () => authApi.login({ email: loginEmail, password: loginPassword }), "/api/v1/auth/login", "POST");

  const testRegister = () =>
    runTest("auth_register", () => authApi.register({ name: regName, email: regEmail, password: regPassword, phone: regPhone }), "/api/v1/auth/register", "POST");

  const testGetMe = () =>
    runTest("auth_me", () => authApi.getMe(), "/api/v1/auth/me", "GET");

  const testRefresh = () =>
    runTest("auth_refresh", () => authApi.refreshToken(), "/api/v1/auth/refresh", "POST");

  const testLogoutServer = () =>
    runTest("auth_logout", () => authApi.logoutServer(), "/api/v1/auth/logout", "POST");

  const testForgotPassword = () =>
    runTest("auth_forgot", () => authApi.forgotPassword(forgotEmail), "/api/v1/auth/forgot-password", "POST");

  const testResetPassword = () =>
    runTest("auth_reset", () => authApi.resetPassword({ email: forgotEmail, token: resetToken, new_password: resetNewPass }), "/api/v1/auth/reset-password", "POST");

  const testUpdateProfile = () =>
    runTest("auth_update_profile", () => authApi.updateProfile({ name: updateName, phone: updatePhone }), "/api/v1/auth/me", "PUT");

  const testChangePassword = () =>
    runTest("auth_change_pass", () => authApi.changePassword({ current_password: currentPass, new_password: newPass }), "/api/v1/auth/change-password", "POST");

  const testSendOtp = () =>
    runTest("auth_send_otp", () => authApi.sendOtp(otpPhone), "/api/v1/auth/send-otp", "POST");

  const testVerifyOtp = () =>
    runTest("auth_verify_otp", () => authApi.verifyOtp(otpPhone, otpCode), "/api/v1/auth/verify-otp", "POST");

  // Vehicles Runners
  const testGetVehicles = () =>
    runTest("vehicles_list", () => vehiclesApi.getVehicles({ category: testVehicleCategory !== "all" ? testVehicleCategory : undefined, limit: 10 }), "/api/v1/vehicles", "GET");

  const testGetVehicleById = () =>
    runTest("vehicles_detail", () => vehiclesApi.getVehicleById(testVehicleId), `/api/v1/vehicles/${testVehicleId}`, "GET");

  const testGetCategories = () =>
    runTest("vehicles_categories", () => vehiclesApi.getCategories(), "/api/v1/vehicles/categories", "GET");

  const testGetFeatured = () =>
    runTest("vehicles_featured", () => vehiclesApi.getFeaturedVehicles(), "/api/v1/vehicles/featured", "GET");

  const testCheckAvailability = () =>
    runTest(
      "vehicles_availability",
      () => vehiclesApi.checkAvailability(testVehicleId, availStartDate, availEndDate),
      `/api/v1/vehicles/${testVehicleId}/availability`,
      "GET"
    );

  const [auditRunning, setAuditRunning] = useState(false);
  const [auditReport, setAuditReport] = useState<any>(null);

  const runBackendAudit = async () => {
    setAuditRunning(true);
    try {
      const res = await fetch("/api/test-suite");
      const data = await res.json();
      setAuditReport(data);
    } catch (err: any) {
      setAuditReport({ error: err.message || "Failed to run audit" });
    } finally {
      setAuditRunning(false);
    }
  };

  const runAllTests = async () => {
    setBatchRunning(true);
    const tests = [
      testLogin,
      testRegister,
      testGetMe,
      testRefresh,
      testForgotPassword,
      testSendOtp,
      testGetVehicles,
      testGetVehicleById,
      testGetCategories,
      testGetFeatured,
      testCheckAvailability,
    ];
    for (const t of tests) {
      try {
        await t();
      } catch {
        // continue
      }
    }
    setBatchRunning(false);
  };

  const completedCount = Object.keys(results).length;
  const successCount = Object.values(results).filter((r) => r.status === 200 || r.status === 201).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/70">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand transition mb-2"
            >
              <ArrowLeft className="size-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-3">
              <Server className="size-7 text-brand" />
              RYPP Full API Integration Console
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Live testing and diagnostics for all <strong>Auth</strong> and <strong>Vehicles</strong> endpoints from{" "}
              <code className="bg-line px-1.5 py-0.5 rounded text-ink font-semibold">
                https://api.rypp.in/docs
              </code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runBackendAudit}
              disabled={auditRunning}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-sm hover:border-brand/40 hover:bg-slate-50 transition disabled:opacity-50"
            >
              {auditRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin text-brand" />
                  Auditing Backend...
                </>
              ) : (
                <>
                  <Activity className="size-4 text-brand" />
                  Run Live Backend Audit
                </>
              )}
            </button>

            <button
              type="button"
              onClick={runAllTests}
              disabled={batchRunning}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-dark transition disabled:opacity-50"
            >
              {batchRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Testing Suite...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 fill-current" />
                  Run Core Client Tests
                </>
              )}
            </button>

            <div className="rounded-xl border border-line bg-white px-3.5 py-2 text-xs shadow-xs">
              <p className="text-[11px] text-muted">Active JWT Token</p>
              <p className="font-mono font-bold text-ink truncate max-w-[140px]">
                {token ? `${token.slice(0, 14)}...` : "None"}
              </p>
            </div>

            {token && (
              <button
                type="button"
                onClick={() => {
                  authApi.logout();
                  setToken(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="size-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Live Backend Audit Results Panel */}
        {auditReport && (
          <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Activity className="size-5 text-brand" />
                  Live Backend Health & Connectivity Audit
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Audited Host: <code className="font-mono font-bold text-ink">{auditReport.targetHost || "https://api.rypp.in"}</code> | {auditReport.timestamp}
                </p>
              </div>
              {auditReport.summary && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                    {auditReport.summary.reachableEndpoints} / {auditReport.summary.totalEndpointsTested} Endpoints Reachable
                  </span>
                  {auditReport.summary.openApiRegisteredRoutesCount > 0 && (
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                      {auditReport.summary.openApiRegisteredRoutesCount} Routes Found in Spec
                    </span>
                  )}
                </div>
              )}
            </div>

            {auditReport.results && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-line text-muted font-semibold">
                      <th className="pb-2">Method</th>
                      <th className="pb-2">Endpoint</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Latency</th>
                      <th className="pb-2">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60 font-mono text-[11px]">
                    {Object.entries(auditReport.results).map(([key, item]: [string, any]) => (
                      <tr key={key} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold">{item.method}</td>
                        <td className="py-2.5">{item.path}</td>
                        <td className="py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-bold ${
                              item.status >= 200 && item.status < 300
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status >= 400 && item.status < 500
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status ? `${item.status} ${item.statusText || ""}` : "Unreachable"}
                          </span>
                        </td>
                        <td className="py-2.5 text-muted">{item.latencyMs}ms</td>
                        <td className="py-2.5 font-sans text-muted truncate max-w-xs">
                          {item.error || (item.data?.preview ? item.data.preview.slice(0, 50) : JSON.stringify(item.data)?.slice(0, 60))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-muted uppercase">Endpoints</span>
            <p className="text-xl font-extrabold text-ink mt-0.5">19 Total</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-muted uppercase">Tested</span>
            <p className="text-xl font-extrabold text-ink mt-0.5">{completedCount} Executed</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-muted uppercase">Success</span>
            <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{successCount} OK</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-muted uppercase">Proxy Route</span>
            <p className="text-xs font-mono font-bold text-ink mt-1.5 truncate">/api/proxy/[...path]</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-8 flex rounded-xl bg-line/60 p-1 text-xs font-semibold max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "all" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Layers className="size-3.5" /> All Endpoints (19)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("auth")}
            className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "auth" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Shield className="size-3.5" /> Auth (11)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vehicles")}
            className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "vehicles" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Truck className="size-3.5" /> Vehicles (8)
          </button>
        </div>

        {/* Endpoints List */}
        <div className="mt-6 space-y-6">
          {/* SECTION 1: AUTH APIS */}
          {(activeTab === "all" || activeTab === "auth") && (
            <>
              <div className="border-b border-line pb-2 pt-2">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <Shield className="size-4 text-brand" />
                  Authentication Endpoints (11 APIs)
                </h2>
              </div>

              {/* 1. Login */}
              <ApiCard
                num="A1"
                title="User Login"
                method="POST"
                endpoint="/api/v1/auth/login"
                desc="Authenticates credentials and stores JWT Bearer token."
                loading={Boolean(loadingMap["auth_login"])}
                result={results["auth_login"]}
                onRun={testLogin}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Email</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Password</label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />

              {/* 2. Register */}
              <ApiCard
                num="A2"
                title="User Registration"
                method="POST"
                endpoint="/api/v1/auth/register"
                desc="Registers a new customer account."
                loading={Boolean(loadingMap["auth_register"])}
                result={results["auth_register"]}
                onRun={testRegister}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Email</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Password</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Phone</label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />

              {/* 3. Me */}
              <ApiCard
                num="A3"
                title="Current User Profile"
                method="GET"
                endpoint="/api/v1/auth/me"
                desc="Retrieves authenticated user profile using stored Bearer token."
                loading={Boolean(loadingMap["auth_me"])}
                result={results["auth_me"]}
                onRun={testGetMe}
              />

              {/* 4. Refresh Token */}
              <ApiCard
                num="A4"
                title="Refresh Access Token"
                method="POST"
                endpoint="/api/v1/auth/refresh"
                desc="Issues a new access token using the stored refresh token."
                loading={Boolean(loadingMap["auth_refresh"])}
                result={results["auth_refresh"]}
                onRun={testRefresh}
              />

              {/* 5. Server Logout */}
              <ApiCard
                num="A5"
                title="Server-Side Logout"
                method="POST"
                endpoint="/api/v1/auth/logout"
                desc="Revokes the active session token on the server and clears local storage."
                loading={Boolean(loadingMap["auth_logout"])}
                result={results["auth_logout"]}
                onRun={testLogoutServer}
              />

              {/* 6. Forgot Password */}
              <ApiCard
                num="A6"
                title="Forgot Password"
                method="POST"
                endpoint="/api/v1/auth/forgot-password"
                desc="Dispatches a password reset email or verification link."
                loading={Boolean(loadingMap["auth_forgot"])}
                result={results["auth_forgot"]}
                onRun={testForgotPassword}
                inputs={
                  <div className="mt-3 max-w-sm">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Account Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                    />
                  </div>
                }
              />

              {/* 7. Reset Password */}
              <ApiCard
                num="A7"
                title="Reset Password"
                method="POST"
                endpoint="/api/v1/auth/reset-password"
                desc="Sets a new password using token or OTP."
                loading={Boolean(loadingMap["auth_reset"])}
                result={results["auth_reset"]}
                onRun={testResetPassword}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Reset Token / OTP</label>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">New Password</label>
                      <input
                        type="password"
                        value={resetNewPass}
                        onChange={(e) => setResetNewPass(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />

              {/* 8. Update Profile */}
              <ApiCard
                num="A8"
                title="Update Profile"
                method="PUT"
                endpoint="/api/v1/auth/me"
                desc="Updates authenticated user's name, phone, or avatar."
                loading={Boolean(loadingMap["auth_update_profile"])}
                result={results["auth_update_profile"]}
                onRun={testUpdateProfile}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Updated Name</label>
                      <input
                        type="text"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Updated Phone</label>
                      <input
                        type="text"
                        value={updatePhone}
                        onChange={(e) => setUpdatePhone(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />

              {/* 9. Change Password */}
              <ApiCard
                num="A9"
                title="Change Password"
                method="POST"
                endpoint="/api/v1/auth/change-password"
                desc="Modifies password for currently logged-in user."
                loading={Boolean(loadingMap["auth_change_pass"])}
                result={results["auth_change_pass"]}
                onRun={testChangePassword}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />

              {/* 10. Send OTP */}
              <ApiCard
                num="A10"
                title="Send OTP (Gmail / Mobile)"
                method="POST"
                endpoint="/api/v1/auth/send-otp"
                desc="Dispatches a 6-digit verification code to Gmail/email or mobile number."
                loading={Boolean(loadingMap["auth_send_otp"])}
                result={results["auth_send_otp"]}
                onRun={testSendOtp}
                inputs={
                  <div className="mt-3 max-w-sm">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Email (Gmail) or Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. user@gmail.com or +91 98765 43210"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                    />
                  </div>
                }
              />

              {/* 11. Verify OTP */}
              <ApiCard
                num="A11"
                title="Verify OTP & Authenticate (Gmail / Mobile)"
                method="POST"
                endpoint="/api/v1/auth/verify-otp"
                desc="Verifies email or mobile OTP and creates authenticated session."
                loading={Boolean(loadingMap["auth_verify_otp"])}
                result={results["auth_verify_otp"]}
                onRun={testVerifyOtp}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Email (Gmail) or Mobile</label>
                      <input
                        type="text"
                        placeholder="e.g. user@gmail.com or +91 98765 43210"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">6-Digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full text-xs font-mono font-bold tracking-wider rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                }
              />
            </>
          )}

          {/* SECTION 2: VEHICLES APIS */}
          {(activeTab === "all" || activeTab === "vehicles") && (
            <>
              <div className="border-b border-line pb-2 pt-6">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <Truck className="size-4 text-brand" />
                  Fleet & Vehicles Endpoints (8 APIs)
                </h2>
              </div>

              {/* 12. List Vehicles */}
              <ApiCard
                num="V1"
                title="List All Vehicles"
                method="GET"
                endpoint="/api/v1/vehicles"
                desc="Queries fleet vehicles with category, price, and pagination filters."
                loading={Boolean(loadingMap["vehicles_list"])}
                result={results["vehicles_list"]}
                onRun={testGetVehicles}
                inputs={
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-[11px] font-semibold text-muted">Filter Category:</label>
                    <select
                      value={testVehicleCategory}
                      onChange={(e) => setTestVehicleCategory(e.target.value)}
                      className="text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    >
                      <option value="all">All Vehicles</option>
                      <option value="bike">Bikes only</option>
                      <option value="scooter">Scooters only</option>
                      <option value="car">Cars only</option>
                    </select>
                  </div>
                }
              />

              {/* 13. Vehicle By ID */}
              <ApiCard
                num="V2"
                title="Get Vehicle Details"
                method="GET"
                endpoint="/api/v1/vehicles/{id}"
                desc="Fetches full specifications, braking, gallery, and pricing for a vehicle."
                loading={Boolean(loadingMap["vehicles_detail"])}
                result={results["vehicles_detail"]}
                onRun={testGetVehicleById}
                inputs={
                  <div className="mt-3 max-w-sm">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Vehicle ID</label>
                    <input
                      type="text"
                      value={testVehicleId}
                      onChange={(e) => setTestVehicleId(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none"
                    />
                  </div>
                }
              />

              {/* Vehicle Categories */}
              <ApiCard
                num="V3"
                title="Vehicle Categories"
                method="GET"
                endpoint="/api/v1/vehicles/categories"
                desc="Returns list of vehicle categories with fleet counts."
                loading={Boolean(loadingMap["vehicles_categories"])}
                result={results["vehicles_categories"]}
                onRun={testGetCategories}
              />

              {/* Featured Vehicles */}
              <ApiCard
                num="V4"
                title="Featured Vehicles"
                method="GET"
                endpoint="/api/v1/vehicles/featured"
                desc="Fetches curated list of popular and featured fleet vehicles."
                loading={Boolean(loadingMap["vehicles_featured"])}
                result={results["vehicles_featured"]}
                onRun={testGetFeatured}
              />

              {/* Check Availability */}
              <ApiCard
                num="V5"
                title="Check Vehicle Availability"
                method="GET"
                endpoint="/api/v1/vehicles/{id}/availability"
                desc="Verifies schedule availability for booking dates."
                loading={Boolean(loadingMap["vehicles_availability"])}
                result={results["vehicles_availability"]}
                onRun={testCheckAvailability}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={availStartDate}
                        onChange={(e) => setAvailStartDate(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">End Date</label>
                      <input
                        type="date"
                        value={availEndDate}
                        onChange={(e) => setAvailEndDate(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                }
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ApiCard({
  num,
  title,
  method,
  endpoint,
  desc,
  inputs,
  loading,
  result,
  onRun,
}: {
  num: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  desc: string;
  inputs?: React.ReactNode;
  loading: boolean;
  result?: TestResult;
  onRun: () => void;
}) {
  const methodColor =
    method === "GET"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : method === "POST"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : method === "PUT"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-7 place-items-center rounded-full bg-ink text-white text-[11px] font-bold">
            {num}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${methodColor}`}>
                {method}
              </span>
              <span className="font-mono text-xs font-bold text-ink">{endpoint}</span>
            </div>
            <h3 className="text-sm font-bold text-ink mt-0.5">{title}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-dark transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Calling...
            </>
          ) : (
            <>
              <Play className="size-3.5 fill-current" />
              Test API
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">{desc}</p>

      {inputs}

      {/* Response Panel */}
      {result && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  result.status === 200 || result.status === 201
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {result.status === 200 || result.status === 201 ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                Status: {result.status}
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
              <Clock className="size-3" />
              {result.latencyMs}ms
            </span>
          </div>

          {result.error && (
            <div className="mt-2 text-xs font-medium text-red-300">
              Error: {result.error}
            </div>
          )}

          <div className="mt-2 max-h-56 overflow-auto font-mono text-[11px] text-slate-300 scrollbar-thin">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
