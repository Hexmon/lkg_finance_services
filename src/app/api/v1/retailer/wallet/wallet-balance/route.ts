/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { retailerFetch } from "@/app/api/_lib/http-retailer";
import { WalletBalanceResponseSchema } from "@/features/retailer/wallet/domain/types";

export const dynamic = "force-dynamic";

/**
 * BFF: GET /api/v1/retailer/wallet/wallet-balance
 * Upstream (Retailer):
 *  - GET /secure/retailer/wallet-balance/
 *  - Fallback: /secure/retailer/get-wallet-balance/
 */
export async function GET(_req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upstreamCandidates = [
    "/secure/retailer/wallet-balance/",
    "/secure/retailer/get-wallet-balance/",
  ] as const;

  let lastErr: any | null = null;

  for (const path of upstreamCandidates) {
    try {
      // retailerFetch returns parsed JSON (throws on !ok)
      const json = await retailerFetch<unknown>(path, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Validate/normalize upstream payload
      const parsed = WalletBalanceResponseSchema.parse(json);
      return NextResponse.json(parsed, { status: 200 });
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? err?.response?.status;

      // Try next candidate if 404; otherwise bubble immediately
      if (status === 404) continue;
      return NextResponse.json(err?.data ?? { error: err?.message ?? "Bad Gateway" }, { status: status ?? 502 });
    }
  }

  // Exhausted all candidates
  return NextResponse.json(
    lastErr?.data ?? { error: lastErr?.message ?? "Not Found" },
    { status: lastErr?.status ?? 404 }
  );
}
