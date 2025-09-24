// src/app/api/v1/auth/account-upgrade/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { AUTHERIZATION_ENDPOINT } from "@/config/endpoints";
import { authFetch } from "@/app/api/_lib/http"; // your shared helper (no Content-Type on GET)
import {
  AccountUpgradeRequestSchema,
  AccountUpgradeResponseSchema,
  type AccountUpgradeRequest,
  type AccountUpgradeResponse,
} from "@/features/upgrade-account/domain/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/auth/account-upgrade
 * -> POST https://auth-uat.bhugtan.in/secure/account-upgrade
 * Body: { user_id, request_type, description }
 * Returns: { status, request_id, message }
 */
export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let unknownBody: unknown;
  try {
    unknownBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = AccountUpgradeRequestSchema.safeParse(unknownBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const payload: AccountUpgradeRequest = parsed.data;

  try {
    const upstream = await authFetch<AccountUpgradeResponse>(
      AUTHERIZATION_ENDPOINT.ACCOUNT_UPGRADE_PATH, // "/secure/account-upgrade"
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload, // authFetch will JSON.stringify + set Content-Type
      }
    );

    const safe = AccountUpgradeResponseSchema.parse(upstream);
    // You can return 200 while keeping upstream's "status" field in the body
    return NextResponse.json<AccountUpgradeResponse>(safe, { status: 200 });
  } catch (err: any) {
    const code = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? "Account upgrade request failed" },
      { status: code }
    );
  }
}
