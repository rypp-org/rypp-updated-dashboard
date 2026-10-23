// Bookings & Booking Ratings API Service for RYPP (https://api.rypp.in)
// Maps all 26 endpoints from FastAPI /api/v1/bookings/ and /api/v1/booking-ratings/

import { apiClient } from "./client";
import type {
  Booking,
  BookingQueryParams,
  BookingRating,
  BookingStatus,
  CreateBookingInput,
  CreateBookingRatingInput,
  PaymentStatus,
  UpdateBookingStatusInput,
  UpdatePaymentStatusInput,
} from "./types";

function extractArray<T>(res: any): T[] {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.items)) return res.items;
  if (res && Array.isArray(res.data)) return res.data;
  if (res && Array.isArray(res.bookings)) return res.bookings;
  if (res && Array.isArray(res.ratings)) return res.ratings;
  if (res && Array.isArray(res.results)) return res.results;
  return [];
}

export const bookingsApi = {
  // =========================================================================
  // 1. CUSTOMER BOOKINGS
  // =========================================================================

  /**
   * POST /api/v1/bookings/ - Create Booking
   */
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    console.log("%c[Bookings API] Creating booking...", "color: #3b82f6; font-weight: bold;", input);

    // Try canonical route with trailing slash, fallback to without
    const candidatePaths = ["api/v1/bookings/", "api/v1/bookings"];
    let lastErr: any;

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<Booking>(path, {
          method: "POST",
          body: JSON.stringify(input),
        });
        console.log("%c[Bookings API] Create Booking Response:", "color: #10b981; font-weight: bold;", response);
        return response;
      } catch (err: any) {
        lastErr = err;
        if (err.status !== 404 && err.status !== 307 && err.status !== 308) {
          throw err;
        }
      }
    }
    throw lastErr;
  },

  /**
   * GET /api/v1/bookings/my - Get My Bookings
   */
  async getMyBookings(params?: BookingQueryParams): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching My Bookings...", "color: #3b82f6; font-weight: bold;", params);
    const queryParams: Record<string, any> = {};
    if (params?.skip !== undefined) queryParams.skip = params.skip;
    if (params?.limit !== undefined) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;

    const res = await apiClient<any>("api/v1/bookings/my", {
      method: "GET",
      params: queryParams,
    });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] My Bookings Result:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/my/ongoing - Get My Ongoing Bookings
   */
  async getMyOngoingBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching My Ongoing Bookings...", "color: #3b82f6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/my/ongoing", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] My Ongoing Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/my/upcoming - Get My Upcoming Bookings
   */
  async getMyUpcomingBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching My Upcoming Bookings...", "color: #3b82f6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/my/upcoming", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] My Upcoming Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/my/completed - Get My Completed Bookings
   */
  async getMyCompletedBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching My Completed Bookings...", "color: #3b82f6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/my/completed", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] My Completed Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/my/cancelled - Get My Cancelled Bookings
   */
  async getMyCancelledBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching My Cancelled Bookings...", "color: #3b82f6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/my/cancelled", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] My Cancelled Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/{booking_id} - Get Booking Details
   */
  async getBooking(bookingId: string | number): Promise<Booking> {
    console.log(`%c[Bookings API] Fetching Booking #${bookingId}...`, "color: #3b82f6; font-weight: bold;");
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}`, { method: "GET" });
    console.log(`%c[Bookings API] Booking #${bookingId} Details:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * DELETE /api/v1/bookings/{booking_id} - Delete Booking
   */
  async deleteBooking(bookingId: string | number): Promise<{ success: boolean; message?: string }> {
    console.log(`%c[Bookings API] Deleting Booking #${bookingId}...`, "color: #ef4444; font-weight: bold;");
    const res = await apiClient<any>(`api/v1/bookings/${bookingId}`, { method: "DELETE" });
    console.log(`%c[Bookings API] Delete Booking Result:`, "color: #10b981; font-weight: bold;", res);
    return { success: true, message: res?.message || "Booking deleted successfully" };
  },

  // =========================================================================
  // 2. OWNER / FLEET BOOKINGS
  // =========================================================================

  /**
   * GET /api/v1/bookings/owner/all - Get Owner Bookings
   */
  async getOwnerBookings(params?: BookingQueryParams): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner All Bookings...", "color: #8b5cf6; font-weight: bold;", params);
    const queryParams: Record<string, any> = {};
    if (params?.skip !== undefined) queryParams.skip = params.skip;
    if (params?.limit !== undefined) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;

    const res = await apiClient<any>("api/v1/bookings/owner/all", {
      method: "GET",
      params: queryParams,
    });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner All Bookings Result:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/today - Get Owner Today Bookings
   */
  async getOwnerTodayBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Today Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/today", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Today Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/ongoing - Get Owner Ongoing Bookings
   */
  async getOwnerOngoingBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Ongoing Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/ongoing", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Ongoing Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/upcoming - Get Owner Upcoming Bookings
   */
  async getOwnerUpcomingBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Upcoming Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/upcoming", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Upcoming Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/pending - Get Owner Pending Bookings
   */
  async getOwnerPendingBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Pending Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/pending", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Pending Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/completed - Get Owner Completed Bookings
   */
  async getOwnerCompletedBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Completed Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/completed", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Completed Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/bookings/owner/cancelled - Get Owner Cancelled Bookings
   */
  async getOwnerCancelledBookings(): Promise<Booking[]> {
    console.log("%c[Bookings API] Fetching Owner Cancelled Bookings...", "color: #8b5cf6; font-weight: bold;");
    const res = await apiClient<any>("api/v1/bookings/owner/cancelled", { method: "GET" });
    const list = extractArray<Booking>(res);
    console.log("%c[Bookings API] Owner Cancelled Bookings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },

  // =========================================================================
  // 3. BOOKING LIFECYCLE & STATUS ACTIONS
  // =========================================================================

  /**
   * PATCH /api/v1/bookings/{booking_id}/approve - Approve Booking
   */
  async approveBooking(bookingId: string | number, reason?: string): Promise<Booking> {
    console.log(`%c[Bookings API] Approving Booking #${bookingId}...`, "color: #059669; font-weight: bold;");
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason || "Approved by owner" }),
    });
    console.log(`%c[Bookings API] Approved Booking Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * PATCH /api/v1/bookings/{booking_id}/reject - Reject Booking
   */
  async rejectBooking(bookingId: string | number, reason?: string): Promise<Booking> {
    console.log(`%c[Bookings API] Rejecting Booking #${bookingId}...`, "color: #dc2626; font-weight: bold;");
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason || "Rejected by owner" }),
    });
    console.log(`%c[Bookings API] Rejected Booking Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * PATCH /api/v1/bookings/{booking_id}/complete - Complete Booking
   */
  async completeBooking(bookingId: string | number): Promise<Booking> {
    console.log(`%c[Bookings API] Completing Booking #${bookingId}...`, "color: #059669; font-weight: bold;");
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/complete`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    console.log(`%c[Bookings API] Completed Booking Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * PATCH /api/v1/bookings/{booking_id}/cancel - Cancel Booking
   */
  async cancelBooking(bookingId: string | number, reason?: string): Promise<Booking> {
    console.log(`%c[Bookings API] Cancelling Booking #${bookingId}...`, "color: #dc2626; font-weight: bold;");
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason || "Cancelled by user" }),
    });
    console.log(`%c[Bookings API] Cancelled Booking Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * PATCH /api/v1/bookings/{booking_id}/status - Update Booking Status
   */
  async updateBookingStatus(
    bookingId: string | number,
    status: BookingStatus,
    reason?: string
  ): Promise<Booking> {
    console.log(`%c[Bookings API] Updating status for Booking #${bookingId} to "${status}"...`, "color: #3b82f6; font-weight: bold;");
    const payload: UpdateBookingStatusInput = { status, reason };
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    console.log(`%c[Bookings API] Update Status Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * PATCH /api/v1/bookings/{booking_id}/payment - Update Payment Status
   */
  async updatePaymentStatus(
    bookingId: string | number,
    paymentStatus: PaymentStatus,
    transactionId?: string
  ): Promise<Booking> {
    console.log(`%c[Bookings API] Updating payment for Booking #${bookingId} to "${paymentStatus}"...`, "color: #3b82f6; font-weight: bold;");
    const payload: UpdatePaymentStatusInput = {
      payment_status: paymentStatus,
      transaction_id: transactionId,
    };
    const res = await apiClient<Booking>(`api/v1/bookings/${bookingId}/payment`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    console.log(`%c[Bookings API] Update Payment Result:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  // =========================================================================
  // 4. BOOKING RATINGS
  // =========================================================================

  /**
   * POST /api/v1/booking-ratings/{booking_id} - Create Booking Rating
   */
  async createBookingRating(
    bookingId: string | number,
    input: CreateBookingRatingInput
  ): Promise<BookingRating> {
    console.log(`%c[Ratings API] Rating Booking #${bookingId}...`, "color: #f59e0b; font-weight: bold;", input);
    const res = await apiClient<BookingRating>(`api/v1/booking-ratings/${bookingId}`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    console.log(`%c[Ratings API] Rating Created:`, "color: #10b981; font-weight: bold;", res);
    return res;
  },

  /**
   * GET /api/v1/booking-ratings/booking/{booking_id} - Get Booking Rating
   */
  async getBookingRating(bookingId: string | number): Promise<BookingRating | null> {
    console.log(`%c[Ratings API] Fetching rating for Booking #${bookingId}...`, "color: #f59e0b; font-weight: bold;");
    try {
      const res = await apiClient<BookingRating>(`api/v1/booking-ratings/booking/${bookingId}`, {
        method: "GET",
      });
      console.log(`%c[Ratings API] Booking #${bookingId} Rating:`, "color: #10b981; font-weight: bold;", res);
      return res;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  /**
   * GET /api/v1/booking-ratings/vehicle/{vehicle_id} - Get Vehicle Ratings
   */
  async getVehicleRatings(vehicleId: string | number): Promise<BookingRating[]> {
    console.log(`%c[Ratings API] Fetching ratings for Vehicle #${vehicleId}...`, "color: #f59e0b; font-weight: bold;");
    const res = await apiClient<any>(`api/v1/booking-ratings/vehicle/${vehicleId}`, {
      method: "GET",
    });
    const list = extractArray<BookingRating>(res);
    console.log(`%c[Ratings API] Vehicle #${vehicleId} Ratings:`, "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/booking-ratings/vendor/{vendor_id} - Get Vendor Ratings
   */
  async getVendorRatings(vendorId: string | number): Promise<BookingRating[]> {
    console.log(`%c[Ratings API] Fetching ratings for Vendor #${vendorId}...`, "color: #f59e0b; font-weight: bold;");
    const res = await apiClient<any>(`api/v1/booking-ratings/vendor/${vendorId}`, {
      method: "GET",
    });
    const list = extractArray<BookingRating>(res);
    console.log(`%c[Ratings API] Vendor #${vendorId} Ratings:`, "color: #10b981; font-weight: bold;", list);
    return list;
  },

  /**
   * GET /api/v1/booking-ratings/my - Get My Ratings
   */
  async getMyRatings(): Promise<BookingRating[]> {
    console.log("%c[Ratings API] Fetching My Ratings...", "color: #f59e0b; font-weight: bold;");
    const res = await apiClient<any>("api/v1/booking-ratings/my", {
      method: "GET",
    });
    const list = extractArray<BookingRating>(res);
    console.log("%c[Ratings API] My Ratings:", "color: #10b981; font-weight: bold;", list);
    return list;
  },
};
