/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { VerifyOtpOnboardSenderRequest, VerifyOtpOnboardSenderRequestSchema, VerifyOtpOnboardSenderResponse, VerifyOtpOnboardSenderResponseSchema } from '@/features/retailer/dmt/sender';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';

/**
 * BFF: POST /api/v1/retailer/dmt/sender/verify-otp-onboard-sender
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/verify-otp-onboard-sender
 */
export async function POST(req: NextRequest) {
  // Auth (HttpOnly cookie set by your auth flow)
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // NOTE: Upstream docs say some fields are "required" but their example omits them.
  // Schema below keeps ref_id + otp required; others optional to match real-world payloads.
  let validated: VerifyOtpOnboardSenderRequest;
  try {
    validated = VerifyOtpOnboardSenderRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    console.log("qwerty inside try");

    // Upstream: /secure/retailer/verify-otp-onboard-sender
    const raw = await retailerFetch<unknown>(
      RETAILER_ENDPOINTS.DMT.SENDER.REGISTER_SENDERVERIFY_OTP,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: validated,
      }
    );

    const parsed: VerifyOtpOnboardSenderResponse = VerifyOtpOnboardSenderResponseSchema.parse(raw);

    // Normalize to 200 at BFF even if upstream returns 201 in payload.status; UI reads message/status from JSON.
    return NextResponse.json<VerifyOtpOnboardSenderResponse>(parsed, { status: 200 });
  } catch (err: any) {
    // Surface upstream error payload when possible
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
