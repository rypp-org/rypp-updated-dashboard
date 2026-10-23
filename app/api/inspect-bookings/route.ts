import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.rypp.in/openapi.json", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Failed: ${res.status}` }, { status: 500 });
    }
    const data = await res.json();
    const paths = data.paths || {};
    const bookingPaths: Record<string, any> = {};
    for (const [key, val] of Object.entries(paths)) {
      if (key.includes("booking")) {
        bookingPaths[key] = val;
      }
    }
    const components = data.components?.schemas || {};
    const bookingSchemas: Record<string, any> = {};
    for (const [key, val] of Object.entries(components)) {
      if (key.toLowerCase().includes("book") || key.toLowerCase().includes("rating")) {
        bookingSchemas[key] = val;
      }
    }
    return NextResponse.json({ paths: bookingPaths, schemas: bookingSchemas });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
