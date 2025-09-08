// src\app\api\v1\auth\login\signout\route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { AUTH_COOKIE_NAME, clearAuthCookies } from '@/app/api/_lib/auth-cookies';

export async function POST(_req: NextRequest) {
  try {
    const store = await cookies();
    const token = store.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      await authFetch(AUTHERIZATION_ENDPOINT.AUTH_LOGOUT_PATH, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
    NextResponse.json({ ok: false });
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
