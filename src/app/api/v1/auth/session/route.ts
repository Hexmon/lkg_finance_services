// src/app/api/v1/auth/session/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, UID_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';

export async function GET() {
    const jar = await cookies();
    const jwt = jar.get(AUTH_COOKIE_NAME)?.value || '';
    const uid = jar.get(UID_COOKIE_NAME)?.value ?? null;

    const authenticated = Boolean(jwt);

    // Match your client type: { authenticated: boolean; userId: string | null | undefined }
    return NextResponse.json(
        { authenticated, userId: authenticated ? uid : null },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
}
