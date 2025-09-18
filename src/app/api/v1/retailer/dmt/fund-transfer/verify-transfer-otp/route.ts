// src/app/api/v1/retailer/dmt/fund-transfer/verify-transfer-otp/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
    VerifyTransferOtpRequestSchema,
    VerifyTransferOtpResponseSchema,
    type VerifyTransferOtpRequest,
    type VerifyTransferOtpResponse,
} from '@/features/retailer/dmt/fund-transfer/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/dmt/fund-transfer/verify-transfer-otp
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/verify-transfer-otp
 */
export async function POST(req: NextRequest) {
    // ---- Auth (HttpOnly cookie -> Bearer) ----
    const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ---- Parse + validate body ----
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    let payload: VerifyTransferOtpRequest;
    try {
        payload = VerifyTransferOtpRequestSchema.parse(body);
    } catch (zerr: any) {
        return NextResponse.json(
            { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
            { status: 400 }
        );
    }

    // ---- Proxy upstream ----
    try {
        const raw = await retailerFetch<unknown>('/secure/retailer/verify-transfer-otp', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: payload,
        });

        const data: VerifyTransferOtpResponse = VerifyTransferOtpResponseSchema.parse(raw);
        return NextResponse.json<VerifyTransferOtpResponse>(data, { status: 200 });
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? 'Verify transfer OTP failed' } },
            { status }
        );
    }
}
