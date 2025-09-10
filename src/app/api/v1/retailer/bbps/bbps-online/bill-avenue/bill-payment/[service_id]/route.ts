// src/app/api/v1/retailer/bbps/bills/bill-payment/[service_id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import {
    BillPaymentRequestSchema,
    BillPaymentResponseSchema,
    type BillPaymentRequest,
    type BillPaymentResponse,
} from '@/features/retailer/retailer_bbps/bbps-online/bill_avenue/domain/types';

export const dynamic = 'force-dynamic';

export async function POST(
    req: NextRequest,
    { params }: { params: { service_id: string } }
) {
    const { service_id } = params ?? {};
    if (!service_id) {
        return NextResponse.json(
            { status: 400, error: { message: 'service_id is required' } },
            { status: 400 }
        );
    }

    const jar = await cookies();
    let token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    token = token.replace(/^Bearer\s+/i, '').trim();

    let bodyJson: unknown;
    try {
        bodyJson = await req.json();
    } catch {
        return NextResponse.json(
            { status: 400, error: { message: 'Invalid JSON body' } },
            { status: 400 }
        );
    }

    let payload: BillPaymentRequest;
    try {
        payload = BillPaymentRequestSchema.parse(bodyJson);
    } catch (e) {
        const ze = e as ZodError;
        return NextResponse.json(
            { status: 400, error: { message: 'Invalid body', issues: ze.issues } },
            { status: 400 }
        );
    }

    try {
        const path = `/secure/bbps/bills/bill-payment/${service_id}`;

        const upstream = await bbpsFetch<unknown>(path, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            body: payload,
        });

        let parsed: BillPaymentResponse;
        try {
            parsed = BillPaymentResponseSchema.parse(upstream);
        } catch (e) {
            // If provider shape drifts, still return 200 with raw upstream for debugging
            return NextResponse.json(upstream, { status: 200 });
        }

        // If you prefer normalized output for UI:
        // const normalized = normalizeBillPaymentResponse(parsed);
        // return NextResponse.json({ ...parsed, normalized }, { status: 200 });

        return NextResponse.json(parsed, { status: 200 });
    } catch (e: any) {
        const status = e?.status ?? e?.data?.status ?? e?.response?.status ?? 502;
        const message =
            e?.message ??
            e?.data?.message ??
            e?.data?.error ??
            'Bill payment failed';
        return NextResponse.json(
            { status, error: { message }, upstream: e?.data ?? undefined },
            { status }
        );
    }
}
