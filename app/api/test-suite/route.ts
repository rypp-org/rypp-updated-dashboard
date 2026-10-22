import { NextResponse } from "next/server";

const BASE_URL = (process.env.API_BASE_URL || "https://api.rypp.in").replace(/\/+$/, "");

interface EndpointTest {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: any;
  headers?: Record<string, string>;
  expectedStatus?: number[];
}

const ENDPOINTS_TO_TEST: EndpointTest[] = [
  {
    id: "openapi_spec",
    name: "OpenAPI Specification",
    method: "GET",
    path: "/openapi.json",
  },
  {
    id: "docs_page",
    name: "Swagger Docs Page",
    method: "GET",
    path: "/docs",
  },
  {
    id: "v1_vehicles",
    name: "List Vehicles (/api/v1/vehicles)",
    method: "GET",
    path: "/api/v1/vehicles",
  },
  {
    id: "root_vehicles",
    name: "List Vehicles (/vehicles)",
    method: "GET",
    path: "/vehicles",
  },
  {
    id: "v1_vehicle_detail",
    name: "Get Vehicle by ID (/api/v1/vehicles/re-himalayan)",
    method: "GET",
    path: "/api/v1/vehicles/re-himalayan",
  },
  {
    id: "v1_vehicles_categories",
    name: "Vehicle Categories (/api/v1/vehicles/categories)",
    method: "GET",
    path: "/api/v1/vehicles/categories",
  },
  {
    id: "v1_vehicles_featured",
    name: "Featured Vehicles (/api/v1/vehicles/featured)",
    method: "GET",
    path: "/api/v1/vehicles/featured",
  },
  {
    id: "v1_vehicles_availability",
    name: "Check Availability (/api/v1/vehicles/re-himalayan/availability)",
    method: "GET",
    path: "/api/v1/vehicles/re-himalayan/availability?start_date=2026-10-15&end_date=2026-10-18",
  },
  {
    id: "v1_auth_login",
    name: "Auth Login (/api/v1/auth/login)",
    method: "POST",
    path: "/api/v1/auth/login",
    body: {
      username: "demo@rypp.in",
      email: "demo@rypp.in",
      password: "demoPassword123",
    },
  },
  {
    id: "root_auth_login",
    name: "Auth Login (/auth/login)",
    method: "POST",
    path: "/auth/login",
    body: {
      username: "demo@rypp.in",
      email: "demo@rypp.in",
      password: "demoPassword123",
    },
  },
  {
    id: "v1_auth_register",
    name: "Auth Register (/api/v1/auth/register)",
    method: "POST",
    path: "/api/v1/auth/register",
    body: {
      name: "Test Rider",
      email: `test_${Date.now()}@rypp.in`,
      password: "TestPassword123!",
      phone: "+919876543210",
    },
  },
  {
    id: "v1_auth_me",
    name: "Auth Me Profile (/api/v1/auth/me)",
    method: "GET",
    path: "/api/v1/auth/me",
  },
  {
    id: "v1_auth_send_otp",
    name: "Send Mobile OTP (/api/v1/auth/send-otp)",
    method: "POST",
    path: "/api/v1/auth/send-otp",
    body: {
      phone: "+919876543210",
    },
  },
  {
    id: "v1_auth_forgot_password",
    name: "Forgot Password (/api/v1/auth/forgot-password)",
    method: "POST",
    path: "/api/v1/auth/forgot-password",
    body: {
      email: "demo@rypp.in",
    },
  },
];

export async function GET() {
  const results: Record<string, any> = {};
  let openApiRegisteredPaths: string[] = [];

  for (const test of ENDPOINTS_TO_TEST) {
    const url = `${BASE_URL}${test.path}`;
    const startTime = performance.now();

    try {
      const headers: Record<string, string> = {
        "User-Agent": "RYPP-Dashboard-Automated-Tester/1.0",
        Accept: "application/json, text/html, */*",
        ...(test.headers || {}),
      };

      let body: string | undefined = undefined;
      if (test.method !== "GET" && test.body) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(test.body);
      }

      // 6 second timeout per request to avoid hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: test.method,
        headers,
        body,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      const contentType = response.headers.get("content-type") || "";
      let responseData: any = null;

      if (contentType.includes("application/json")) {
        try {
          responseData = await response.json();
          // If this is openapi.json, extract all defined routes!
          if (test.id === "openapi_spec" && responseData?.paths) {
            openApiRegisteredPaths = Object.keys(responseData.paths);
          }
        } catch {
          responseData = { error: "Failed to parse JSON" };
        }
      } else {
        const text = await response.text();
        responseData = {
          preview: text.slice(0, 300),
          isHtml: text.includes("<html") || text.includes("<!DOCTYPE"),
        };
      }

      // Check if reachable and working
      const isReachable = response.status >= 200 && response.status < 500;
      const isSuccess = response.status >= 200 && response.status < 300;

      results[test.id] = {
        name: test.name,
        method: test.method,
        path: test.path,
        url,
        status: response.status,
        statusText: response.statusText,
        isReachable,
        isSuccess,
        latencyMs,
        data: responseData,
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      results[test.id] = {
        name: test.name,
        method: test.method,
        path: test.path,
        url,
        status: 0,
        statusText: "Connection Failed",
        isReachable: false,
        isSuccess: false,
        latencyMs,
        error: err.name === "AbortError" ? "Request timed out (6000ms)" : err.message || "Network error",
      };
    }
  }

  const reachableCount = Object.values(results).filter((r: any) => r.isReachable).length;
  const totalCount = Object.keys(results).length;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    targetHost: BASE_URL,
    summary: {
      totalEndpointsTested: totalCount,
      reachableEndpoints: reachableCount,
      openApiRegisteredRoutesCount: openApiRegisteredPaths.length,
      openApiRegisteredRoutes: openApiRegisteredPaths,
    },
    results,
  });
}
