import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Exempt POST login bootstrap routes (no CSRF yet)
const EXEMPT_POST_PATTERNS: RegExp[] = [
  /^\/api\/v1\/auth\/login(?:\/.*)?$/i,   // covers /api/v1/auth/login and /api/v1/auth/login/signin
];

export async function middleware(req: NextRequest) {
  if (!PROTECTED.has(req.method)) return NextResponse.next();
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

  // normalize trailing slashes
  const path = req.nextUrl.pathname.replace(/\/+$/, '');

  // allow POST login bootstrap paths without CSRF
  if (req.method === 'POST' && EXEMPT_POST_PATTERNS.some(rx => rx.test(path))) {
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get('bt_csrf')?.value ?? '';
  const headerToken = req.headers.get('x-csrf-token') ?? '';

  if (!cookieToken || cookieToken !== headerToken) {
    return NextResponse.json({ error: 'CSRF token invalid' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = { matcher: ['/api/:path*'] };
