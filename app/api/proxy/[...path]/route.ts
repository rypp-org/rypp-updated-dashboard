import { NextRequest, NextResponse } from "next/server";

const REMOTE_API_BASE = (process.env.API_BASE_URL || "https://api.rypp.in").replace(/\/+$/, "");

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, context, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, context, "POST");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, context, "PUT");
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, context, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, context, "DELETE");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    },
  });
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  try {
    const { path } = await context.params;
    const subPath = (path || []).join("/");
    const search = request.nextUrl.search;
    const targetUrl = `${REMOTE_API_BASE}/${subPath}${search}`;

    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "RYPP-Dashboard/1.0 (Mozilla/5.0 Next.js Proxy)",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    let body: BodyInit | undefined = undefined;
    if (method !== "GET" && method !== "HEAD") {
      const text = await request.text();
      if (text) {
        body = text;
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const responseText = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = { message: responseText || `Remote returned HTTP ${response.status}`, raw: responseText };
    }

    return NextResponse.json(parsed, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: "Proxy connection failed",
        message: err.message || "Failed to reach remote RYPP API server",
      },
      { status: 502 }
    );
  }
}
