// src/app/api/v1/address/route.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { AUTHERIZATION_ENDPOINT } from "@/config/endpoints";
import { authFetch } from "@/app/api/_lib/http";
import {
  AddAddressRequestSchema,
  AddAddressResponseSchema,
  GetAddressesQuerySchema,
  GetAddressesResponseSchema,
  PatchAddressLandmarkBodySchema,
  UpdateAddressResponseSchema,
  type AddAddressResponse,
  type GetAddressesResponse,
} from "@/features/address/domain/types";

/** Ensure single trailing slash for endpoints that require it */
function withTrailingSlash(p: string) {
  return p.endsWith("/") ? p : `${p}/`;
}

/** ---------- POST /api/v1/address → POST /secure/address ---------- */
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
    const data = await authFetch<AddAddressResponse>(AUTHERIZATION_ENDPOINT.ADDRESS_PATH, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: parsed.data,
    });
    const safe = AddAddressResponseSchema.parse(data);
    return NextResponse.json(safe, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Add address failed" } },
      { status }
    );
  }
}

/** ---------- GET /api/v1/address?user_id=... → GET /secure/address/ ---------- */
export async function GET(req: NextRequest) {
  const jar = await cookies();
  const cookieToken = jar.get(AUTH_COOKIE_NAME)?.value;

  // Optional: accept Authorization header when cookie is absent
  const headerAuth = req.headers.get('authorization') || '';
  const headerToken = headerAuth.toLowerCase().startsWith('bearer ')
    ? headerAuth.slice(7).trim()
    : '';

  const token = cookieToken || headerToken;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
  const q = GetAddressesQuerySchema.safeParse(raw);
  if (!q.success) {
    return NextResponse.json({ error: "Invalid query", issues: q.error.issues }, { status: 400 });
  }

  const base = AUTHERIZATION_ENDPOINT.ADDRESS_PATH.replace(/\/$/, ""); // "/secure/address"
  const upstreamPath = q.data.user_id
    ? `${base}/${encodeURIComponent(q.data.user_id)}`
    : base; // <- no trailing slash
console.log({upstreamPath});

  try {
    const data = await authFetch<GetAddressesResponse>(upstreamPath, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const safe = GetAddressesResponseSchema.parse(data);
    return NextResponse.json(safe, { status: 200 });
  } catch (err: any) {
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
