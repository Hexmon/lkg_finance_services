/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

import {
  FundTransferRequestSchema,
  FundTransferResponseSchema,
  type FundTransferRequest,
  type FundTransferResponse,
} from '@/features/retailer/dmt/fund-transfer/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/dmt/fund-transfer/dtm-fund-transfer
 * Proxies upstream:
 *   POST /secure/retailer/fund-transfer
 */
export async function POST(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Parse JSON
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate body against FundTransfer
  let payload: FundTransferRequest;
  try {
    payload = FundTransferRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    // Upstream call
    const raw = await retailerFetch<unknown>('/secure/retailer/fund-transfer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
    });

    // Response is permissive (z.any)
    const data: FundTransferResponse = FundTransferResponseSchema.parse(raw);

    // Typical success payload:
    // { status: "200", message: "OTP sent successfully", txn_id: "...", verify_OTP: true }
    return NextResponse.json<FundTransferResponse>(data, { status: 200 });
  } catch (err: any) {
    const status = Number(err?.status ?? err?.data?.status ?? 502);
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Fund transfer request failed' } },
      { status }
    );
  }
}
