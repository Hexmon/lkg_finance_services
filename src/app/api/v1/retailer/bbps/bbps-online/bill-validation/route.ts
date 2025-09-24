import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import {
  BillValidationRequestSchema,
  BillValidationResponseSchema,
  isBillValidationSuccessShape,
} from '@/features/retailer/retailer_bbps/bbps-online/bill_validation/domain/types';

const ALLOWED_MODES = new Set(["ONLINE", "OFFLINE"]);

function toNum(n?: string | number | null): number | undefined {
  if (n == null) return undefined;
  const x = Number(n);
  return Number.isFinite(x) ? x : undefined;
}

export async function POST(req: NextRequest) {
  // Auth
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // mode
  const modeRaw = req.nextUrl.searchParams.get("mode") ?? "ONLINE";
  const mode = String(modeRaw).toUpperCase();
  if (!ALLOWED_MODES.has(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  // parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // validate request
  let validated: unknown;
  try {
    validated = BillValidationRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: "Validation failed", details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    // Upstream call
    const raw = await bbpsFetch<unknown>(
      `/${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.BILL_VALIDATION}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        query: { mode },
        body: validated,
      }
    );

    // PASS-THROUGH ERROR: if it doesn't look like a success shape, return raw as-is with original status
    if (!isBillValidationSuccessShape(raw)) {
      const statusInner =
        (raw as any)?.status ?? (raw as any)?.data?.status ?? undefined;
      const statusNum = toNum(statusInner) ?? 502;
      return NextResponse.json(raw as any, { status: statusNum });
    }

    // SUCCESS: normalize and return 200
    const parsed = BillValidationResponseSchema.parse(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    // Transport/HTTP error from bbpsFetch: forward upstream payload as-is if present
    const upstreamBody = err?.data ?? err?.body ?? err?.responseBody;
    const statusNum =
      toNum(err?.status) ??
      toNum(err?.statusCode) ??
      502;

    if (upstreamBody) {
      return NextResponse.json(upstreamBody, { status: statusNum });
    }
    // Fallback: raw message only (no rewrite)
    return NextResponse.json({ error: err?.message ?? "Upstream error" }, { status: statusNum });
  }
}
