import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import {
  GenerateEmailOtpRequestSchema,
  type GenerateEmailOtpResponse,
} from '@/features/auth/domain/types';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = GenerateEmailOtpRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 });
  }

  // Read optional Bearer from HttpOnly cookie (Next 15: await cookies())
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;

  try {
    const data = await authFetch<GenerateEmailOtpResponse>(
      AUTHERIZATION_ENDPOINT.AUTH_GENERATE_EMAIL_OTP_PATH,
      {
        body: parsed.data,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(err?.data ?? { status, error: { message: err?.message ?? 'Generate email OTP failed' } }, { status });
  }
}
