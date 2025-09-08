// src\app\api\v1\auth\login\change-password\route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { ChangePasswordRequestSchema } from '@/features/auth/domain/types';

type ChangePasswordSuccess = {
  status: 200;
  message: string;
};

type UpstreamError = {
  request_id?: string;
  method?: string;
  status?: number;
  error?: { code?: string; message?: string };
  created_at?: string;
  user_id?: string;
};

export async function POST(req: NextRequest) {
  // 1) Auth: require JWT in HttpOnly cookie
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) Validate request body
  let body: z.infer<typeof ChangePasswordRequestSchema>;
  try {
    body = ChangePasswordRequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // 3) Proxy to upstream with Bearer
  try {
    const data = await authFetch<ChangePasswordSuccess>(
      AUTHERIZATION_ENDPOINT.AUTH_CHANGE_PASSWORD_PATH,
      {
        headers: { Authorization: `Bearer ${token}` },
        body,
      }
    );

    return NextResponse.json(
      { status: data.status, message: data.message },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status: number = err?.status ?? err?.data?.status ?? 502;
    const payload: UpstreamError =
      err?.data && typeof err.data === 'object'
        ? err.data
        : { status, error: { message: err?.message ?? 'Change password failed' } };

    return NextResponse.json(payload, { status });
  }
}
