/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  PayoutRequestSchema,
  PayoutResponseSchema,
  type PayoutRequest,
  type PayoutResponse,
} from '@/features/wallet/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/wallet/payout
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/payout
 * Body: { account_id: string, mode: "IMPS" | "NEFT", amount: string|number }
 */
export async function POST(req: NextRequest) {
  // ---- Auth (HttpOnly cookie -> Bearer) ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ---- Parse + validate body ----
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = PayoutRequestSchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const payload: PayoutRequest = parsed.data;

  // ---- Proxy upstream ----
  try {
    const raw = await retailerFetch<unknown>('/secure/retailer/payout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
    });

    const data: PayoutResponse = PayoutResponseSchema.parse(raw);
    return NextResponse.json<PayoutResponse>(data, { status: 200 });
  } catch (err: any) {
    const code = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? 'Payout failed' },
      { status: code }
    );
  }
}
