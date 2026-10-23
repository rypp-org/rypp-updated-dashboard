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
  CalendarCheck,
  Star,
  BookmarkCheck,
} from "lucide-react";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { authApi } from "../_lib/api/auth";
import { vehiclesApi } from "../_lib/api/vehicles";
import { bookingsApi } from "../_lib/api/bookings";
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
  const [activeTab, setActiveTab] = useState<"all" | "auth" | "vehicles" | "bookings" | "ratings">("all");
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
  const [testVehicleId, setTestVehicleId] = useState("1");

  const [availStartDate, setAvailStartDate] = useState("2026-10-15");
  const [availEndDate, setAvailEndDate] = useState("2026-10-18");

  // Bookings Inputs
  const [testBookingId, setTestBookingId] = useState("1");
  const [testBookingVehicleId, setTestBookingVehicleId] = useState("1");
  const [testBookingStart, setTestBookingStart] = useState("2026-10-25");
  const [testBookingEnd, setTestBookingEnd] = useState("2026-10-27");
  const [testBookingAmount, setTestBookingAmount] = useState(1600);
  const [testBookingReason, setTestBookingReason] = useState("Customer requested cancellation");
  const [testBookingStatus, setTestBookingStatus] = useState("confirmed");
  const [testPaymentStatus, setTestPaymentStatus] = useState("paid");

  // Ratings Inputs
  const [testRatingScore, setTestRatingScore] = useState(5);
  const [testRatingComment, setTestRatingComment] = useState("Smooth ride, well maintained vehicle!");
  const [testRatingVehicleId, setTestRatingVehicleId] = useState("1");
  const [testRatingVendorId, setTestRatingVendorId] = useState("1");

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

  // --- Bookings Runners (Customer) ---
  const testCreateBooking = () =>
    runTest("booking_create", () => bookingsApi.createBooking({
      vehicle_id: testBookingVehicleId,
      start_date: testBookingStart,
      end_date: testBookingEnd,
      total_amount: Number(testBookingAmount),
      total_price: Number(testBookingAmount),
      customer_name: "Test Rider",
      customer_email: "demo@rypp.in",
      customer_phone: "+91 98765 43210",
      pickup_location: "Bengaluru",
      drop_location: "Bengaluru",
      payment_method: "upi",
      payment_status: "paid",
    }), "/api/v1/bookings/", "POST");

  const testGetMyBookings = () =>
    runTest("booking_my", () => bookingsApi.getMyBookings(), "/api/v1/bookings/my", "GET");

  const testGetMyOngoing = () =>
    runTest("booking_my_ongoing", () => bookingsApi.getMyOngoingBookings(), "/api/v1/bookings/my/ongoing", "GET");

  const testGetMyUpcoming = () =>
    runTest("booking_my_upcoming", () => bookingsApi.getMyUpcomingBookings(), "/api/v1/bookings/my/upcoming", "GET");

  const testGetMyCompleted = () =>
    runTest("booking_my_completed", () => bookingsApi.getMyCompletedBookings(), "/api/v1/bookings/my/completed", "GET");

  const testGetMyCancelled = () =>
    runTest("booking_my_cancelled", () => bookingsApi.getMyCancelledBookings(), "/api/v1/bookings/my/cancelled", "GET");

  const testGetBooking = () =>
    runTest("booking_detail", () => bookingsApi.getBooking(testBookingId), `/api/v1/bookings/${testBookingId}`, "GET");

  const testDeleteBooking = () =>
    runTest("booking_delete", () => bookingsApi.deleteBooking(testBookingId), `/api/v1/bookings/${testBookingId}`, "DELETE");

  // --- Bookings Runners (Owner / Lifecycle) ---
  const testGetOwnerAll = () =>
    runTest("booking_owner_all", () => bookingsApi.getOwnerBookings(), "/api/v1/bookings/owner/all", "GET");

  const testGetOwnerToday = () =>
    runTest("booking_owner_today", () => bookingsApi.getOwnerTodayBookings(), "/api/v1/bookings/owner/today", "GET");

  const testGetOwnerOngoing = () =>
    runTest("booking_owner_ongoing", () => bookingsApi.getOwnerOngoingBookings(), "/api/v1/bookings/owner/ongoing", "GET");

  const testGetOwnerUpcoming = () =>
    runTest("booking_owner_upcoming", () => bookingsApi.getOwnerUpcomingBookings(), "/api/v1/bookings/owner/upcoming", "GET");

  const testGetOwnerPending = () =>
    runTest("booking_owner_pending", () => bookingsApi.getOwnerPendingBookings(), "/api/v1/bookings/owner/pending", "GET");

  const testGetOwnerCompleted = () =>
    runTest("booking_owner_completed", () => bookingsApi.getOwnerCompletedBookings(), "/api/v1/bookings/owner/completed", "GET");

  const testGetOwnerCancelled = () =>
    runTest("booking_owner_cancelled", () => bookingsApi.getOwnerCancelledBookings(), "/api/v1/bookings/owner/cancelled", "GET");

  const testApproveBooking = () =>
    runTest("booking_approve", () => bookingsApi.approveBooking(testBookingId, "Approved by fleet partner"), `/api/v1/bookings/${testBookingId}/approve`, "PATCH");

  const testRejectBooking = () =>
    runTest("booking_reject", () => bookingsApi.rejectBooking(testBookingId, testBookingReason), `/api/v1/bookings/${testBookingId}/reject`, "PATCH");

  const testCompleteBooking = () =>
    runTest("booking_complete", () => bookingsApi.completeBooking(testBookingId), `/api/v1/bookings/${testBookingId}/complete`, "PATCH");

  const testCancelBooking = () =>
    runTest("booking_cancel", () => bookingsApi.cancelBooking(testBookingId, testBookingReason), `/api/v1/bookings/${testBookingId}/cancel`, "PATCH");

  const testUpdateBookingStatus = () =>
    runTest("booking_status", () => bookingsApi.updateBookingStatus(testBookingId, testBookingStatus, testBookingReason), `/api/v1/bookings/${testBookingId}/status`, "PATCH");

  const testUpdatePaymentStatus = () =>
    runTest("booking_payment", () => bookingsApi.updatePaymentStatus(testBookingId, testPaymentStatus, "TXN_" + Date.now()), `/api/v1/bookings/${testBookingId}/payment`, "PATCH");

  // --- Ratings Runners ---
  const testCreateRating = () =>
    runTest("rating_create", () => bookingsApi.createBookingRating(testBookingId, {
      rating: Number(testRatingScore),
      comment: testRatingComment,
      cleanliness_rating: 5,
      maintenance_rating: 5,
    }), `/api/v1/booking-ratings/${testBookingId}`, "POST");

  const testGetBookingRating = () =>
    runTest("rating_booking", () => bookingsApi.getBookingRating(testBookingId), `/api/v1/booking-ratings/booking/${testBookingId}`, "GET");

  const testGetVehicleRatings = () =>
    runTest("rating_vehicle", () => bookingsApi.getVehicleRatings(testRatingVehicleId), `/api/v1/booking-ratings/vehicle/${testRatingVehicleId}`, "GET");

  const testGetVendorRatings = () =>
    runTest("rating_vendor", () => bookingsApi.getVendorRatings(testRatingVendorId), `/api/v1/booking-ratings/vendor/${testRatingVendorId}`, "GET");

  const testGetMyRatings = () =>
    runTest("rating_my", () => bookingsApi.getMyRatings(), "/api/v1/booking-ratings/my", "GET");

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
            <p className="text-xl font-extrabold text-ink mt-0.5">42 Total</p>
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
        <div className="mt-8 flex flex-wrap rounded-xl bg-line/60 p-1 text-xs font-semibold max-w-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 min-w-[90px] rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "all" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Layers className="size-3.5" /> All (42)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("auth")}
            className={`flex-1 min-w-[80px] rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "auth" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Shield className="size-3.5" /> Auth (11)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vehicles")}
            className={`flex-1 min-w-[80px] rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "vehicles" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Truck className="size-3.5" /> Fleet (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 min-w-[100px] rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "bookings" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <CalendarCheck className="size-3.5" /> Bookings (21)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ratings")}
            className={`flex-1 min-w-[90px] rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === "ratings" ? "bg-white text-ink shadow-sm font-bold" : "text-muted hover:text-ink"
            }`}
          >
            <Star className="size-3.5" /> Ratings (5)
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

          {/* SECTION 3: BOOKINGS APIS */}
          {(activeTab === "all" || activeTab === "bookings") && (
            <>
              <div className="border-b border-line pb-2 pt-6">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <CalendarCheck className="size-4 text-brand" />
                  Booking Endpoints (21 APIs)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Full customer reservation flow, partner fleet overview, and lifecycle actions (approve, reject, cancel, complete, status, payment).
                </p>
              </div>

              {/* B1: Create Booking */}
              <ApiCard
                num="B1"
                title="Create Booking"
                method="POST"
                endpoint="/api/v1/bookings/"
                desc="Creates a new vehicle reservation with trip dates, pickup details, and pricing."
                loading={Boolean(loadingMap["booking_create"])}
                result={results["booking_create"]}
                onRun={testCreateBooking}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Vehicle ID</label>
                      <input
                        type="text"
                        value={testBookingVehicleId}
                        onChange={(e) => setTestBookingVehicleId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Pickup Date</label>
                      <input
                        type="date"
                        value={testBookingStart}
                        onChange={(e) => setTestBookingStart(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Drop Date</label>
                      <input
                        type="date"
                        value={testBookingEnd}
                        onChange={(e) => setTestBookingEnd(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Total Amount (₹)</label>
                      <input
                        type="number"
                        value={testBookingAmount}
                        onChange={(e) => setTestBookingAmount(Number(e.target.value))}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                }
              />

              {/* B2: Get My Bookings */}
              <ApiCard
                num="B2"
                title="Get My Bookings"
                method="GET"
                endpoint="/api/v1/bookings/my"
                desc="Fetches all bookings belonging to the currently logged in user."
                loading={Boolean(loadingMap["booking_my"])}
                result={results["booking_my"]}
                onRun={testGetMyBookings}
              />

              {/* B3: Get My Ongoing Bookings */}
              <ApiCard
                num="B3"
                title="Get My Ongoing Bookings"
                method="GET"
                endpoint="/api/v1/bookings/my/ongoing"
                desc="Returns active, in-progress vehicle trips for the user."
                loading={Boolean(loadingMap["booking_my_ongoing"])}
                result={results["booking_my_ongoing"]}
                onRun={testGetMyOngoing}
              />

              {/* B4: Get My Upcoming Bookings */}
              <ApiCard
                num="B4"
                title="Get My Upcoming Bookings"
                method="GET"
                endpoint="/api/v1/bookings/my/upcoming"
                desc="Returns scheduled future reservations awaiting pickup."
                loading={Boolean(loadingMap["booking_my_upcoming"])}
                result={results["booking_my_upcoming"]}
                onRun={testGetMyUpcoming}
              />

              {/* B5: Get My Completed Bookings */}
              <ApiCard
                num="B5"
                title="Get My Completed Bookings"
                method="GET"
                endpoint="/api/v1/bookings/my/completed"
                desc="Returns past, successfully finished rentals."
                loading={Boolean(loadingMap["booking_my_completed"])}
                result={results["booking_my_completed"]}
                onRun={testGetMyCompleted}
              />

              {/* B6: Get My Cancelled Bookings */}
              <ApiCard
                num="B6"
                title="Get My Cancelled Bookings"
                method="GET"
                endpoint="/api/v1/bookings/my/cancelled"
                desc="Returns previously cancelled reservations."
                loading={Boolean(loadingMap["booking_my_cancelled"])}
                result={results["booking_my_cancelled"]}
                onRun={testGetMyCancelled}
              />

              {/* B7: Get Booking Details */}
              <ApiCard
                num="B7"
                title="Get Booking Details"
                method="GET"
                endpoint="/api/v1/bookings/{booking_id}"
                desc="Fetches full details for a specific reservation."
                loading={Boolean(loadingMap["booking_detail"])}
                result={results["booking_detail"]}
                onRun={testGetBooking}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                    <input
                      type="text"
                      value={testBookingId}
                      onChange={(e) => setTestBookingId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* B8: Delete Booking */}
              <ApiCard
                num="B8"
                title="Delete Booking"
                method="DELETE"
                endpoint="/api/v1/bookings/{booking_id}"
                desc="Permanently removes a booking from the database."
                loading={Boolean(loadingMap["booking_delete"])}
                result={results["booking_delete"]}
                onRun={testDeleteBooking}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID to Delete</label>
                    <input
                      type="text"
                      value={testBookingId}
                      onChange={(e) => setTestBookingId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* B9: Get Owner All Bookings */}
              <ApiCard
                num="B9"
                title="Get Owner Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/all"
                desc="Returns all vehicle reservations across the owner's fleet."
                loading={Boolean(loadingMap["booking_owner_all"])}
                result={results["booking_owner_all"]}
                onRun={testGetOwnerAll}
              />

              {/* B10: Get Owner Today Bookings */}
              <ApiCard
                num="B10"
                title="Get Owner Today Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/today"
                desc="Returns trips starting or returning today for the fleet."
                loading={Boolean(loadingMap["booking_owner_today"])}
                result={results["booking_owner_today"]}
                onRun={testGetOwnerToday}
              />

              {/* B11: Get Owner Ongoing Bookings */}
              <ApiCard
                num="B11"
                title="Get Owner Ongoing Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/ongoing"
                desc="Returns all fleet vehicles currently out on the road."
                loading={Boolean(loadingMap["booking_owner_ongoing"])}
                result={results["booking_owner_ongoing"]}
                onRun={testGetOwnerOngoing}
              />

              {/* B12: Get Owner Upcoming Bookings */}
              <ApiCard
                num="B12"
                title="Get Owner Upcoming Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/upcoming"
                desc="Returns scheduled fleet reservations awaiting dispatch."
                loading={Boolean(loadingMap["booking_owner_upcoming"])}
                result={results["booking_owner_upcoming"]}
                onRun={testGetOwnerUpcoming}
              />

              {/* B13: Get Owner Pending Bookings */}
              <ApiCard
                num="B13"
                title="Get Owner Pending Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/pending"
                desc="Returns reservations awaiting partner acceptance or approval."
                loading={Boolean(loadingMap["booking_owner_pending"])}
                result={results["booking_owner_pending"]}
                onRun={testGetOwnerPending}
              />

              {/* B14: Get Owner Completed Bookings */}
              <ApiCard
                num="B14"
                title="Get Owner Completed Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/completed"
                desc="Returns completed rentals for owner settlement."
                loading={Boolean(loadingMap["booking_owner_completed"])}
                result={results["booking_owner_completed"]}
                onRun={testGetOwnerCompleted}
              />

              {/* B15: Get Owner Cancelled Bookings */}
              <ApiCard
                num="B15"
                title="Get Owner Cancelled Bookings"
                method="GET"
                endpoint="/api/v1/bookings/owner/cancelled"
                desc="Returns cancelled fleet reservations."
                loading={Boolean(loadingMap["booking_owner_cancelled"])}
                result={results["booking_owner_cancelled"]}
                onRun={testGetOwnerCancelled}
              />

              {/* B16: Approve Booking */}
              <ApiCard
                num="B16"
                title="Approve Booking"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/approve"
                desc="Confirms and locks in a pending reservation."
                loading={Boolean(loadingMap["booking_approve"])}
                result={results["booking_approve"]}
                onRun={testApproveBooking}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                    <input
                      type="text"
                      value={testBookingId}
                      onChange={(e) => setTestBookingId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* B17: Reject Booking */}
              <ApiCard
                num="B17"
                title="Reject Booking"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/reject"
                desc="Rejects a pending booking with a reason."
                loading={Boolean(loadingMap["booking_reject"])}
                result={results["booking_reject"]}
                onRun={testRejectBooking}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                      <input
                        type="text"
                        value={testBookingId}
                        onChange={(e) => setTestBookingId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Rejection Reason</label>
                      <input
                        type="text"
                        value={testBookingReason}
                        onChange={(e) => setTestBookingReason(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                }
              />

              {/* B18: Complete Booking */}
              <ApiCard
                num="B18"
                title="Complete Booking"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/complete"
                desc="Marks an active booking as completed upon vehicle return."
                loading={Boolean(loadingMap["booking_complete"])}
                result={results["booking_complete"]}
                onRun={testCompleteBooking}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                    <input
                      type="text"
                      value={testBookingId}
                      onChange={(e) => setTestBookingId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* B19: Cancel Booking */}
              <ApiCard
                num="B19"
                title="Cancel Booking"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/cancel"
                desc="Cancels an upcoming booking."
                loading={Boolean(loadingMap["booking_cancel"])}
                result={results["booking_cancel"]}
                onRun={testCancelBooking}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                      <input
                        type="text"
                        value={testBookingId}
                        onChange={(e) => setTestBookingId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Cancellation Reason</label>
                      <input
                        type="text"
                        value={testBookingReason}
                        onChange={(e) => setTestBookingReason(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                }
              />

              {/* B20: Update Booking Status */}
              <ApiCard
                num="B20"
                title="Update Booking Status"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/status"
                desc="Directly transitions the booking status state machine."
                loading={Boolean(loadingMap["booking_status"])}
                result={results["booking_status"]}
                onRun={testUpdateBookingStatus}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                      <input
                        type="text"
                        value={testBookingId}
                        onChange={(e) => setTestBookingId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Target Status</label>
                      <select
                        value={testBookingStatus}
                        onChange={(e) => setTestBookingStatus(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="ongoing">ongoing</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                }
              />

              {/* B21: Update Payment Status */}
              <ApiCard
                num="B21"
                title="Update Payment Status"
                method="PATCH"
                endpoint="/api/v1/bookings/{booking_id}/payment"
                desc="Updates payment settlement status and transaction ID."
                loading={Boolean(loadingMap["booking_payment"])}
                result={results["booking_payment"]}
                onRun={testUpdatePaymentStatus}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                      <input
                        type="text"
                        value={testBookingId}
                        onChange={(e) => setTestBookingId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Payment Status</label>
                      <select
                        value={testPaymentStatus}
                        onChange={(e) => setTestPaymentStatus(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      >
                        <option value="pending">pending</option>
                        <option value="paid">paid</option>
                        <option value="failed">failed</option>
                        <option value="refunded">refunded</option>
                      </select>
                    </div>
                  </div>
                }
              />
            </>
          )}

          {/* SECTION 4: BOOKING RATINGS APIS */}
          {(activeTab === "all" || activeTab === "ratings") && (
            <>
              <div className="border-b border-line pb-2 pt-6">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-500" />
                  Booking Rating Endpoints (5 APIs)
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Customer feedback, vehicle ratings, vendor scores, and submitted reviews.
                </p>
              </div>

              {/* R1: Create Rating */}
              <ApiCard
                num="R1"
                title="Create Booking Rating"
                method="POST"
                endpoint="/api/v1/booking-ratings/{booking_id}"
                desc="Submits a review and star ratings for a completed booking."
                loading={Boolean(loadingMap["rating_create"])}
                result={results["rating_create"]}
                onRun={testCreateRating}
                inputs={
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                      <input
                        type="text"
                        value={testBookingId}
                        onChange={(e) => setTestBookingId(e.target.value)}
                        className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Stars (1-5)</label>
                      <select
                        value={testRatingScore}
                        onChange={(e) => setTestRatingScore(Number(e.target.value))}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                        <option value={2}>⭐⭐ (2 Stars)</option>
                        <option value={1}>⭐ (1 Star)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted block mb-1">Feedback Comment</label>
                      <input
                        type="text"
                        value={testRatingComment}
                        onChange={(e) => setTestRatingComment(e.target.value)}
                        className="w-full text-xs font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                }
              />

              {/* R2: Get Booking Rating */}
              <ApiCard
                num="R2"
                title="Get Booking Rating"
                method="GET"
                endpoint="/api/v1/booking-ratings/booking/{booking_id}"
                desc="Fetches the rating and review attached to a specific booking."
                loading={Boolean(loadingMap["rating_booking"])}
                result={results["rating_booking"]}
                onRun={testGetBookingRating}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Booking ID</label>
                    <input
                      type="text"
                      value={testBookingId}
                      onChange={(e) => setTestBookingId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* R3: Get Vehicle Ratings */}
              <ApiCard
                num="R3"
                title="Get Vehicle Ratings"
                method="GET"
                endpoint="/api/v1/booking-ratings/vehicle/{vehicle_id}"
                desc="Returns all aggregate ratings and reviews for a fleet vehicle."
                loading={Boolean(loadingMap["rating_vehicle"])}
                result={results["rating_vehicle"]}
                onRun={testGetVehicleRatings}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Vehicle ID</label>
                    <input
                      type="text"
                      value={testRatingVehicleId}
                      onChange={(e) => setTestRatingVehicleId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* R4: Get Vendor Ratings */}
              <ApiCard
                num="R4"
                title="Get Vendor Ratings"
                method="GET"
                endpoint="/api/v1/booking-ratings/vendor/{vendor_id}"
                desc="Returns customer satisfaction ratings for a fleet partner vendor."
                loading={Boolean(loadingMap["rating_vendor"])}
                result={results["rating_vendor"]}
                onRun={testGetVendorRatings}
                inputs={
                  <div className="mt-3 max-w-xs">
                    <label className="text-[11px] font-semibold text-muted block mb-1">Vendor ID</label>
                    <input
                      type="text"
                      value={testRatingVendorId}
                      onChange={(e) => setTestRatingVendorId(e.target.value)}
                      className="w-full text-xs font-mono font-medium rounded-lg border border-line px-3 py-1.5 focus:border-brand focus:outline-none bg-white"
                    />
                  </div>
                }
              />

              {/* R5: Get My Ratings */}
              <ApiCard
                num="R5"
                title="Get My Ratings"
                method="GET"
                endpoint="/api/v1/booking-ratings/my"
                desc="Fetches all ratings and feedback submitted by the current user."
                loading={Boolean(loadingMap["rating_my"])}
                result={results["rating_my"]}
                onRun={testGetMyRatings}
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
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
      : method === "PATCH"
      ? "bg-teal-50 text-teal-700 border-teal-200"
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
