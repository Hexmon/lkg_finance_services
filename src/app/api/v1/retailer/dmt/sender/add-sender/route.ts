/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';

/**
 * BFF: POST /api/v1/retailer/dmt/sender/add-sender
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/addSender
 *
 * Notes:
 * - No response schema is enforced; raw upstream JSON is returned to the client.
 * - Minimal request validation here is optional; leaving it permissive to match docs.
 */
export async function POST(req: NextRequest) {
    // Auth (HttpOnly cookie set by your auth flow)
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body (pass-through; no zod validation as requested)
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    try {
        // Upstream Retailer UAT endpoint (case-sensitive path per docs)
        // POST https://retailer-uat.bhugtan.in/secure/retailer/addSender
        const raw = await retailerFetch<unknown>(
            RETAILER_ENDPOINTS.DMT.SENDER.ADD_SENDER,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body, // retailerFetch sets JSON content-type automatically for non-GET
            }
        );

        // Pass the upstream response through unchanged; always respond 200 from BFF
        return NextResponse.json(raw, { status: 200 });
    } catch (err: any) {
        // Surface upstream error payload when possible
        return NextResponse.json(
            err?.data ?? { error: err.message },
            { status: err.status ?? 502 }
        );
    }
}
