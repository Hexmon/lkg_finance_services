/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

import {
    CheckSenderBodySchema,
    CheckSenderResponseSchema,
    type CheckSenderResponse,
} from '@/features/retailer/dmt/sender/domain/types';

/**
 * POST /api/v1/retailer/dmt/sender/check-sender
 * Proxies to: POST {RETAILER_BASE_URL}/secure/retailer/checksender
 */
export async function POST(req: NextRequest) {
    // ---- Auth required ----
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ---- Validate incoming body ----
    const json = await req.json().catch(() => null);
    const parsed = CheckSenderBodySchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request body', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    try {
        // ---- Upstream call ----
        const raw = await retailerFetch<unknown>(
            RETAILER_ENDPOINTS.DMT.SENDER.CHECK_SENDER_REGISTER, // "/secure/retailer/checksender"
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type is auto-set by retailerFetch for JSON payloads
                },
                body: parsed.data, // pass object; retailerFetch JSON.stringifies it
            }
        );

        // ---- Response validation (loose) ----
        const data = CheckSenderResponseSchema.parse(raw) as CheckSenderResponse;

        // Upstream typically returns 200 for both “exists” and “not found” cases (with a message)
        return NextResponse.json(data, { status: 200 });
    } catch (err: any) {
        const status = Number(
            err?.status ?? err?.response?.status ?? err?.data?.status ?? 502
        );

        const payload =
            err?.data ?? {
                error: { message: err?.message ?? 'Check sender failed' },
            };

        return NextResponse.json(payload, { status: status || 502 });
    }
}
