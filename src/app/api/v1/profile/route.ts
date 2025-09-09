// src\app\api\v1\profile\route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import {
  GetProfileResponseSchema,
  type GetProfileResponse,
} from '@/features/profile';
import { authFetch } from '../../_lib/http-profile';

export async function GET() {
  // 1) Pull Bearer from HttpOnly cookie
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2) Call upstream
    const upstream = await authFetch<unknown>('/secure/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    // 3) Validate/normalize with Zod
    const parsed = GetProfileResponseSchema.parse(upstream) as GetProfileResponse;

    // 4) Return the validated payload
    return NextResponse.json(parsed, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; data?: unknown };
    const status = e?.status ?? 502;
    return NextResponse.json(
      e?.data ?? { status, error: { message: e?.message ?? 'Failed to fetch profile' } },
      { status }
    );
  }
}
