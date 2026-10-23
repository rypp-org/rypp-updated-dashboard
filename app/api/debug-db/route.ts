import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseUrl = "https://api.rypp.in";
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  // 1. Fetch OpenAPI spec to inspect exact Booking schema
  try {
    const res = await fetch(`${baseUrl}/openapi.json`, { cache: "no-store" });
    if (res.ok) {
      const spec = await res.json();
      const bookingEndpoints = Object.keys(spec.paths || {}).filter((p) => p.includes("booking"));
      const bookingPost = spec.paths?.["/api/v1/bookings/"]?.post || spec.paths?.["/api/v1/bookings"]?.post;
      const schemaRef = bookingPost?.requestBody?.content?.["application/json"]?.schema?.$ref;
      const schemaName = schemaRef ? schemaRef.split("/").pop() : null;
      const bookingSchema = schemaName ? spec.components?.schemas?.[schemaName] : null;

      results.openapi = {
        bookingEndpoints,
        bookingPostParameters: bookingPost?.parameters,
        requestBodySchemaName: schemaName,
        bookingSchema,
      };
    } else {
      results.openapi = { error: `Failed with status ${res.status}` };
    }
  } catch (err: any) {
    results.openapi = { error: err.message };
  }

  // 2. Fetch all Vehicles in DB
  try {
    const res = await fetch(`${baseUrl}/api/v1/vehicles`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items || data.vehicles || data.data || [];
      results.vehicles = {
        totalInDb: items.length,
        items: items.map((v: any) => ({
          id: v.id,
          name: v.name || v.model || v.title,
          category: v.category || v.type,
          price_per_day: v.price_per_day,
        })),
      };
    } else {
      results.vehicles = { error: `Status ${res.status}` };
    }
  } catch (err: any) {
    results.vehicles = { error: err.message };
  }

  // 3. Check All Bookings in DB
  const endpointsToCheck = [
    "/api/v1/bookings/",
    "/api/v1/bookings",
    "/api/v1/bookings/owner/all",
    "/api/v1/bookings/owner/today",
    "/api/v1/bookings/my",
  ];

  results.bookings = {};
  for (const ep of endpointsToCheck) {
    try {
      const res = await fetch(`${baseUrl}${ep}`, { cache: "no-store" });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : json.items || json.bookings || json.data || [];
        results.bookings[ep] = {
          status: res.status,
          totalEntries: Array.isArray(list) ? list.length : "N/A",
          sampleData: json,
        };
      } catch {
        results.bookings[ep] = {
          status: res.status,
          rawPreview: text.slice(0, 300),
        };
      }
    } catch (err: any) {
      results.bookings[ep] = { error: err.message };
    }
  }

  // Write out to workspace file for inspection
  try {
    const outputPath = path.join(process.cwd(), "db_status.json");
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
    results.writtenToFile = outputPath;
  } catch (writeErr: any) {
    results.writeError = writeErr.message;
  }

  return NextResponse.json(results);
}
