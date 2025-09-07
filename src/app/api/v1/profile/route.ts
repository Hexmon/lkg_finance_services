import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import {
    GetProfileResponseSchema,
    type GetProfileResponse,
} from '@/features/profile/domain/types'; // or the path where you placed the given schema

export async function GET() {
    // 1) Require session (Bearer in HttpOnly cookie)
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2) Upstream GET /secure/profile (some UATs are /secure/profile/)
        const raw = await authFetch<GetProfileResponse>(
            AUTHERIZATION_ENDPOINT.PROFILE_GET_PATH.endsWith('/')
                ? AUTHERIZATION_ENDPOINT.PROFILE_GET_PATH
                : `${AUTHERIZATION_ENDPOINT.PROFILE_GET_PATH}/`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // 3) Validate/normalize with Zod (profile_id coerced to number, etc.)
        const parsed = GetProfileResponseSchema.parse(raw);
        return NextResponse.json(parsed, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? 'Fetch profile failed' } },
            { status }
        );
    }
}
