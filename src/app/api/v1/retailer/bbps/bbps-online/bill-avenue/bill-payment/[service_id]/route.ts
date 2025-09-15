/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import { BillPaymentPathParamsSchema, BillPaymentRequest, BillPaymentRequestSchema, BillPaymentResponse, BillPaymentResponseSchema } from '@/features/retailer/retailer_bbps/bbps-online/bill_avenue';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/bbps/bills/bill-payment/[service_id]
 * Proxies upstream:
 *   POST https://bbps-uat.bhugtan.in/secure/bbps/bills/bill-payment/{service_id}
 */
export async function POST(
  req: NextRequest,
  ctx: { params: { service_id: string } }
) {
  // ---- Auth (HttpOnly cookie -> Bearer) ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ---- Validate path param ----
  const pathParsed = BillPaymentPathParamsSchema.safeParse(ctx.params);
  if (!pathParsed.success) {
    return NextResponse.json(
      { error: 'Invalid path params', issues: pathParsed.error.issues },
      { status: 400 }
    );
  }
  const { service_id } = pathParsed.data;

  // ---- Parse + validate body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let payload: BillPaymentRequest;
  try {
    payload = BillPaymentRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  // ---- Proxy upstream ----
  try {
    const raw = await bbpsFetch<unknown>(
      `/secure/bbps/bills/bill-payment/${service_id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      }
    );

    const parsed: BillPaymentResponse = BillPaymentResponseSchema.parse(raw);
    return NextResponse.json<BillPaymentResponse>(parsed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      err?.data ?? { error: err.message },
      { status: err?.status ?? 502 }
    );
  }
}
