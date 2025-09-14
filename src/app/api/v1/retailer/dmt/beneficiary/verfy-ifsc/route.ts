/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { VerifyIfscRequest, VerifyIfscRequestSchema, VerifyIfscResponse, VerifyIfscResponseSchema } from '@/features/retailer/dmt/beneficiaries/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/dmt/beneficiary/verfy-ifsc
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/verify_ifsc
 */
export async function POST(req: NextRequest) {
    // ---- Auth via HttpOnly cookie ----
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

    let payload: VerifyIfscRequest;
    try {
        payload = VerifyIfscRequestSchema.parse(body);
    } catch (zerr: any) {
        return NextResponse.json(
            { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
            { status: 400 }
        );
    }

    // ---- Proxy upstream ----
    try {
        const url =
            // Prefer constant if present; otherwise fallback literal
            RETAILER_ENDPOINTS.DMT.BENEFICIARIES.VERIFY_IFSC;

        // Use the same base/host configured in retailerFetch
        const raw = await retailerFetch<unknown>(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: payload,
        });

        const parsed: VerifyIfscResponse = VerifyIfscResponseSchema.parse(raw);

        // Normalize to 200 for frontend; UI can rely on `parsed.success` / `parsed.status_code`.
        return NextResponse.json<VerifyIfscResponse>(parsed, { status: 200 });
    } catch (err: any) {
        // Bubble up upstream error payload if available
        return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
    }
}
