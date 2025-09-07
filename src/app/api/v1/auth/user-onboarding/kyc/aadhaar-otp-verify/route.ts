import 'server-only';
import { NextResponse } from 'next/server';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import {
    AadhaarOtpVerifyRequestSchema,
    type AadhaarOtpVerifyResponse,
} from '@/features/auth/domain/types';

export async function POST(req: Request) {
    const json = await req.json().catch(() => null);
    const parsed = AadhaarOtpVerifyRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request body', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    try {
        const data = await authFetch<AadhaarOtpVerifyResponse>(
            AUTHERIZATION_ENDPOINT.AUTH_AADHAAR_OTP_VERIFY_PATH,
            { body: parsed.data }
        );
        return NextResponse.json(data, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? 'Aadhaar OTP verification failed' } },
            { status }
        );
    }
}
