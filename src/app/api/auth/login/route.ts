import { AUTHERIZATION_ENDPOINT, BASE_URLS } from '@/config/endpoints';
import { NextResponse } from 'next/server';

const AUTH_BASE = BASE_URLS.AUTH_BASE_URL; // same as BASE_URLS.AUTH_BASE_URL
const LOGIN_PATH = AUTHERIZATION_ENDPOINT.AUTH_LOGIN_PATH; // adjust to your real path
const AUTH_API_KEY = process.env.NEXT_PUBLIC_AUTH_API_KEY || '';

export async function POST(req: Request) {
  const payload = await req.json();

  // forward to backend
  const res = await fetch(`${AUTH_BASE}${LOGIN_PATH}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(AUTH_API_KEY ? { 'X-API-Key': AUTH_API_KEY } : {}),
    },
    body: JSON.stringify(payload),
    // do NOT include credentials here; this is server-to-server
  });

  const text = await res.text().catch(() => '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) ||
      res.statusText ||
      `HTTP ${res.status}`;
    return NextResponse.json({ message }, { status: res.status });
  }

  const token = json?.token;
  if (!token) {
    return NextResponse.json({ message: 'Token missing in response' }, { status: 500 });
  }

  // decide cookie lifetime (e.g., 1 hour or from backend)
  const maxAgeSeconds = 60 * 60; // 1 hour

  const response = NextResponse.json({ ok: true });
  response.cookies.set('access_token', token, {
    httpOnly: true,
    secure: true,                // only over HTTPS (true in prod)
    sameSite: 'strict',          // consider 'lax' if needed for cross-site navigations
    path: '/',
    maxAge: maxAgeSeconds,
  });

  return response;
}
