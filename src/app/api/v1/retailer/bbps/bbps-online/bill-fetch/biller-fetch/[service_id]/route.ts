/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import { bbpsFetch } from "@/app/api/_lib/http-bbps";
import { BillFetchRequestSchema } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

/** For this route, the validator expects Promise-based params */
type Ctx = { params: Promise<{ service_id: string }> };

const ALLOWED_MODES = new Set(["ONLINE", "OFFLINE"]);

function toNum(n?: string | number | null): number | undefined {
  if (n == null) return undefined;
  const x = Number(n);
  return Number.isFinite(x) ? x : undefined;
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { service_id } = await params; // ← match expected signature

  // Auth
  const jar = await cookies(); // cookies() is sync in route handlers
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
    validated = BillFetchRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: "Validation failed", details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    // Call upstream (kept identical to your current behavior)
    const upstream = await bbpsFetch<unknown>(
      `/${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILL_FETCH}/${service_id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        query: { mode },
        body: validated,
      }
    );

    // Pass-through success, mirror upstream JSON
    const statusFromBody =
      toNum((upstream as any)?.status) ?? toNum((upstream as any)?.data?.status);

    return NextResponse.json(upstream as any, {
      status:
        statusFromBody && statusFromBody >= 200 && statusFromBody < 600
          ? statusFromBody
          : 200,
    });
  } catch (err: any) {
    // Transport/HTTP error from upstream
    const upstreamBody = err?.data ?? err?.body ?? err?.responseBody;
    const statusNum = toNum(err?.status) ?? toNum(err?.statusCode) ?? 502;

    if (upstreamBody !== undefined) {
      return NextResponse.json(upstreamBody, { status: statusNum });
    }
    return NextResponse.json(
      { error: err?.message ?? "Upstream error" },
      { status: statusNum }
    );
  }
}
