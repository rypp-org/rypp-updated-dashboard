// Central HTTP Client for RYPP API

const TOKEN_KEY = "rypp_auth_token";
const REFRESH_TOKEN_KEY = "rypp_refresh_token";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Check if running in browser
const isBrowser = typeof window !== "undefined";

export function getStoredToken(): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    // Also set cookie for SSR / middleware availability
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function getStoredRefreshToken(): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredRefreshToken(token: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearStoredToken(): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch {
    // ignore
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  useProxy?: boolean;
}

/**
 * Executes an HTTP request to the RYPP API backend.
 * Uses Next.js proxy route `/api/proxy/*` to prevent CORS issues in local and production environments,
 * or direct calls if configured.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, useProxy = true, headers: customHeaders, ...restOptions } = options;

  // Clean path (remove leading slash)
  const cleanPath = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  // Build query string
  let queryString = "";
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      queryString = `?${qs}`;
    }
  }

  // Construct Target URL
  let url: string;
  if (isBrowser && useProxy) {
    // Route via Next.js proxy handler
    url = `/api/proxy/${cleanPath}${queryString}`;
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.rypp.in";
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    url = `${cleanBase}/${cleanPath}${queryString}`;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (!(restOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getStoredToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      ...restOptions,
      headers,
    });
  } catch (netErr) {
    // If proxy failed or network error occurred, try direct fetch if proxy was used
    if (isBrowser && useProxy) {
      try {
        const directBase = process.env.NEXT_PUBLIC_API_URL || "https://api.rypp.in";
        const directUrl = `${directBase.replace(/\/$/, "")}/${cleanPath}${queryString}`;
        response = await fetch(directUrl, {
          ...restOptions,
          headers,
        });
      } catch {
        throw new ApiError(
          "Unable to connect to RYPP API. Please check your network connection.",
          0,
          netErr
        );
      }
    } else {
      throw new ApiError(
        "Network connection error to RYPP API.",
        0,
        netErr
      );
    }
  }

  let data: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMsg = `API request failed with status ${response.status}`;
    if (data && typeof data === "object") {
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
        errorMsg = data.detail.map((d: any) => d.msg).join(", ");
      } else if (data.message) {
        errorMsg = data.message;
      } else if (data.error) {
        errorMsg = data.error;
      }
    }
    throw new ApiError(errorMsg, response.status, data);
  }

  return data as T;
}
