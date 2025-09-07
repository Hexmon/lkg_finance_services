import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import {
  ResetPasswordRequestSchema,
  type ResetPasswordResponse,
} from '@/features/auth/domain/types';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = ResetPasswordRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 });
  }

  // Optional Bearer (your curl includes it). If present in cookie, forward it.
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;

  try {
    const data = await authFetch<ResetPasswordResponse>(
      AUTHERIZATION_ENDPOINT.AUTH_RESET_PASSWORD_PATH.trim(), // constants include a trailing space in your snippet—trim for safety
      {
        body: parsed.data,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(err?.data ?? { status, error: { message: err?.message ?? 'Reset password initiation failed' } }, { status });
  }
}
