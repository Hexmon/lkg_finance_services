// src/app/api/v1/address/route.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { AUTHERIZATION_ENDPOINT } from "@/config/endpoints";
import {
  AddAddressRequestSchema,
  AddAddressResponseSchema,
  GetAddressesQuerySchema,
  GetAddressesResponseSchema,
  PatchAddressLandmarkBodySchema,
  UpdateAddressResponseSchema,
  UpstreamAddAddressResponseSchema,
  type AddAddressResponse,
  type GetAddressesResponse,
} from "@/features/address/domain/types";

/** Ensure single trailing slash for endpoints that require it */
function withTrailingSlash(p: string) {
  return p.endsWith("/") ? p : `${p}/`;
}

import { BASE_URLS } from '@/config/endpoints';

const BASE = BASE_URLS.AUTH_BASE_URL;
const API_KEY = process.env.AUTH_API_KEY || '';
const TIMEOUT_MS = 20_000;

function withTimeout(signal?: AbortSignal | null) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener('abort', () => ctl.abort(), { once: true });
  return { signal: ctl.signal, cancel: () => clearTimeout(id) };
}

type FetchInit = {
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal;
};

export async function authFetch<T>(path: string, init?: FetchInit) {
  const url = `${BASE}${path}`;
  const method = (init?.method ?? 'POST').toUpperCase();
  const { signal, cancel } = withTimeout(init?.signal);

  // Start with safe defaults
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  };

  // Merge user headers (last one wins)
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      for (const [k, v] of init.headers.entries()) headers[k] = v;
    } else if (Array.isArray(init.headers)) {
      for (const [k, v] of init.headers) headers[k] = v as string;
    } else {
      Object.assign(headers, init.headers);
    }
  }

  // Only set Content-Type when we really have a body AND it's not GET/HEAD
  const hasBody = init?.body !== undefined && init?.body !== null && method !== 'GET' && method !== 'HEAD';
  if (hasBody) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  } else {
    // Ensure we do NOT send Content-Type on GET/HEAD
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(init!.body) : undefined,
      cache: 'no-store',
      signal,
    });

    const text = await res.text();
    let data: any = undefined;
    try { data = text ? JSON.parse(text) : undefined; } catch { /* non-JSON */ }

    if (!res.ok) {
      const status = res.status || data?.status || 500;
      const message = data?.message || `Upstream error (${status})`;
      throw Object.assign(new Error(message), { status, data });
    }
    return data as T;
  } finally {
    cancel();
  }
}


// src/app/api/v1/address/route.ts (POST)
export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = AddAddressRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const upstream = await authFetch(AUTHERIZATION_ENDPOINT.ADDRESS_PATH, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: parsed.data,
    });

    // parse upstream { message, data }, then return only the inner data
    const safeUpstream = UpstreamAddAddressResponseSchema.parse(upstream);

    // keep your public response shape as AddressRecord (flat), matching AddAddressResponse
    return NextResponse.json(safeUpstream.data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Add address failed" } },
      { status }
    );
  }
}


/** ---------- GET /api/v1/address?user_id=... → GET /secure/address/ or /secure/address/:user_id ---------- */
export async function GET(req: NextRequest) {
  const jar = await cookies();
  console.log({ jar });

  // 1) Token from cookie or Authorization header
  const cookieToken = jar.get(AUTH_COOKIE_NAME)?.value;
  const headerAuth = req.headers.get("authorization") || "";
  const headerToken = headerAuth.toLowerCase().startsWith("bearer ")
    ? headerAuth.slice(7).trim()
    : "";
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Validate query; coerce empty user_id -> undefined
  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = GetAddressesQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const userId = parsed.data.user_id?.trim() || undefined;

  // 3) Build upstream path: keep trailing slash on base when no user_id
  const base = AUTHERIZATION_ENDPOINT.ADDRESS_PATH.endsWith("/")
    ? AUTHERIZATION_ENDPOINT.ADDRESS_PATH
    : `${AUTHERIZATION_ENDPOINT.ADDRESS_PATH}/`; // "/secure/address/"

  const upstreamPath = userId
    ? `${base}${encodeURIComponent(userId)}` // "/secure/address/:user_id"
    : base;                                  // "/secure/address/"
  console.log({ upstreamPath });

  try {
    console.log("inside try");

    const data = await authFetch<GetAddressesResponse>(upstreamPath, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log({ data });

    const safe = GetAddressesResponseSchema.parse(data);
    console.log({ data });

    return NextResponse.json(safe, { status: 200 });
  } catch (err: any) {
    // Helpful for debugging upstream errors
    console.log({ err, upstreamPath });
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Get addresses failed" } },
      { status }
    );
  }
}


/** ---------- PATCH /api/v1/address → PATCH /secure/address/ (landmark only) ---------- */
export async function PATCH(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = PatchAddressLandmarkBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const data = await authFetch(withTrailingSlash(AUTHERIZATION_ENDPOINT.ADDRESS_PATH), {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: parsed.data,
    });
    const safe = UpdateAddressResponseSchema.parse(data);
    return NextResponse.json(safe, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Update address failed" } },
      { status }
    );
  }
}
