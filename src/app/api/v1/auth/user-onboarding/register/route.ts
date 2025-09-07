import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import {
    RegisterRequestSchema,
    type RegisterResponse,
} from '@/features/auth/domain/types';

export async function POST(req: Request) {
    // 1) Validate body
    const json = await req.json().catch(() => null);
    const parsed = RegisterRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid request body', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    // 2) Pull Bearer from HttpOnly cookie
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    // if (!token) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    const headers: HeadersInit = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    // 3) Forward to upstream
    try {
        const data = await authFetch<RegisterResponse>(
            AUTHERIZATION_ENDPOINT.AUTH_REGISTER_PATH,
            {
                body: parsed.data,
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return NextResponse.json(data, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? 'Register failed' } },
            { status }
        );
    }
}
