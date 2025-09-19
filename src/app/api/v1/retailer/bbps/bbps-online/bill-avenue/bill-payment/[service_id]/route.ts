// src/app/api/v1/retailer/bbps/bbps-online/bill-avenue/bill-payment/[service_id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import {
  BillPaymentPathParamsSchema,
  BillPaymentRequest,
  BillPaymentRequestSchema,
  BillPaymentResponse,
  BillPaymentResponseSchema,
  PaymentInfoSchema, // <-- ensure imported
} from '@/features/retailer/retailer_bbps/bbps-online/bill_avenue';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ service_id: string }> } // Next 15 Promise
) {
  // ---- Auth ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ---- Params ----
  const params = await ctx.params;
  const pathParsed = BillPaymentPathParamsSchema.safeParse(params);
  if (!pathParsed.success) {
    return NextResponse.json(
      { error: 'Invalid path params', issues: pathParsed.error.issues },
      { status: 400 }
    );
  }
  const { service_id } = pathParsed.data;

  // ---- Body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1) Base structural validation
  let payload: BillPaymentRequest;
  try {
    payload = BillPaymentRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  // 2) Business rules & normalization
  try {
    // currency must be INR (356)
    if (payload.amountInfo.currency !== '356') {
      return NextResponse.json(
        { error: 'Invalid currency', detail: "amountInfo.currency must be '356' (INR)" },
        { status: 400 }
      );
    }

    // amount checks (string digits; compare in rupees)
    const amountPaise = Number(payload.amountInfo.amount);
    if (!Number.isFinite(amountPaise) || amountPaise < 0) {
      return NextResponse.json(
        { error: 'Invalid amount', detail: 'amountInfo.amount must be a non-negative digits string (paise)' },
        { status: 400 }
      );
    }
    const amountRupees = amountPaise / 100;

    // quickPay vs billerResponse
    const quickPay = payload.paymentMethod.quickPay;
    if (quickPay === 'N') {
      if (!payload.billerResponse) {
        return NextResponse.json(
          { error: 'billerResponse required', detail: 'For presentment flow (quickPay=N), billerResponse must be provided.' },
          { status: 400 }
        );
      }
    } // if quickPay === 'Y', billerResponse is optional/bypass

    // PAN required if > 49,999 INR
    if (amountRupees > 49999) {
      const pan = payload.customerInfo.customerPan;
      // PAN format is already validated by schema if present; enforce presence here
      if (!pan) {
        return NextResponse.json(
          { error: 'PAN required', detail: 'Transactions above ₹49,999 require customerInfo.customerPan.' },
          { status: 400 }
        );
      }
    }

    // paymentInfo: accept both shapes, normalize to { info: { ... } }
    function normalizePaymentInfo(pi: unknown | undefined): { info: { infoName: string; infoValue: string } } | undefined {
      if (!pi) return undefined;
      const parsed = PaymentInfoSchema.safeParse(pi);
      if (!parsed.success) return undefined;

      if ('info' in parsed.data) {
        return parsed.data as { info: { infoName: string; infoValue: string } };
      }
      // flat shape -> wrap
      return { info: { infoName: parsed.data.infoName, infoValue: parsed.data.infoValue } };
    }

    let normalizedPaymentInfo = normalizePaymentInfo(payload.paymentInfo);

    // If caller didn’t send paymentInfo, auto-fill per your examples
    if (!normalizedPaymentInfo) {
      normalizedPaymentInfo =
        amountRupees > 50000
          ? { info: { infoName: 'Payment Account Info', infoValue: 'Cash' } }
          : { info: { infoName: 'Remarks', infoValue: 'Received' } };
    }

    // Construct final outbound body (keep original keys, but override normalized paymentInfo)
    const outbound: BillPaymentRequest = {
      ...payload,
      paymentInfo: normalizedPaymentInfo,
    };

    // 3) Proxy
    const raw = await bbpsFetch<unknown>(
      `/secure/bbps/bills/bill-payment/${service_id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: outbound,
      }
    );
    return NextResponse.json(raw, { status: 200 });
    // const parsed: BillPaymentResponse = BillPaymentResponseSchema.parse(raw);
    // return NextResponse.json<BillPaymentResponse>(parsed, { status: 200 });
  } catch (err: any) {
    // Upstream error shape passthrough if present
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err?.status ?? 502 });
  }
}
