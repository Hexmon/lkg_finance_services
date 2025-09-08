// src\app\api\_lib\auth-cookies.ts
import 'server-only';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

export const AUTH_COOKIE_NAME = 'bt_auth';   // HttpOnly JWT
export const UID_COOKIE_NAME = 'bt_uid';    // optional, HttpOnly
export const CSRF_COOKIE_NAME = 'bt_csrf';   // readable cookie for double-submit

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.AUTH_COOKIE_DOMAIN || undefined;

type Base = { name: string; value: string; maxAge?: number; path?: string };

async function setHttpOnly({ name, value, maxAge, path = '/' }: Base) {
  const store = await cookies();
  store.set({
    name,
    value,
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    domain: COOKIE_DOMAIN,
    path,
    maxAge,
  });
}

async function setReadable({ name, value, maxAge, path = '/' }: Base) {
  const store = await cookies();
  store.set({
    name,
    value,
    httpOnly: false,
    secure: isProd,
    sameSite: 'strict',
    domain: COOKIE_DOMAIN,
    path,
    maxAge,
  });
}

export async function clearAuthCookies() {
  await setHttpOnly({ name: AUTH_COOKIE_NAME, value: '', maxAge: 0 });
  await setHttpOnly({ name: UID_COOKIE_NAME, value: '', maxAge: 0 });
  await setReadable({ name: CSRF_COOKIE_NAME, value: '', maxAge: 0 });
}

export function getJwtExp(jwt: string): number | undefined {
  try {
    const [, payloadB64] = jwt.split('.');
    const json = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    return typeof json?.exp === 'number' ? json.exp : undefined;
  } catch { return undefined; }
}

export async function setSessionCookies(jwt: string, userId: string, exp?: number) {
  const now = Math.floor(Date.now() / 1000);
  const ttl = exp && exp > now ? Math.min(exp - now, 24 * 60 * 60) : 15 * 60; // max 24h, default 15m
  await setHttpOnly({ name: AUTH_COOKIE_NAME, value: jwt, maxAge: ttl });
  await setHttpOnly({ name: UID_COOKIE_NAME, value: userId, maxAge: ttl });

  // CSRF token (random) — double-submit cookie pattern
  const csrf = crypto.randomBytes(24).toString('hex');
  await setReadable({ name: CSRF_COOKIE_NAME, value: csrf, maxAge: ttl });
  return csrf;
}
