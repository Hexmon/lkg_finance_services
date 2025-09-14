/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { paypointFetch } from '@/app/api/_lib/http-paypoint';
import {
    AEPSCheckAuthRequestSchema,
    AEPSCheckAuthResponseSchema,
    type AEPSCheckAuthRequest,
    type AEPSCheckAuthResponse,
} from '@/features/retailer/cash_withdrawl/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/aeps/check-authentication
 * Proxies upstream:
 *   POST https://paypoint-uat.bhugtan.in/secure/paypoint/aeps/check_authentication
 */
export async function POST(req: NextRequest) {
    // ---- Auth via HttpOnly cookie (Bearer token) ----
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ---- Parse + validate body ----
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    let payload: AEPSCheckAuthRequest;
    try {
        payload = AEPSCheckAuthRequestSchema.parse(body);
    } catch (zerr: any) {
        return NextResponse.json(
            { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
            { status: 400 }
        );
    }

    // ---- Proxy upstream ----
    try {
        const raw = await paypointFetch<unknown>(
            '/secure/paypoint/aeps/check_authentication',
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: payload,
            }
        );

        const parsed: AEPSCheckAuthResponse = AEPSCheckAuthResponseSchema.parse(raw);
        return NextResponse.json<AEPSCheckAuthResponse>(parsed, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
    }
}
