import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import {
  AddAddressRequestSchema,
  type AddAddressResponse,
  type GetAddressesResponse,
} from '@/features/address/domain/types';

// Small helper to safely add a trailing slash once
function withTrailingSlash(p: string) {
  return p.endsWith('/') ? p : `${p}/`;
}

/** POST /api/v1/address → upstream POST /secure/address */
export async function POST(req: Request) {
  // Require session
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Validate body
  const json = await req.json().catch(() => null);
  const parsed = AddAddressRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const data = await authFetch<AddAddressResponse>(
      AUTHERIZATION_ENDPOINT.ADDRESS_PATH,
      {
        headers: { Authorization: `Bearer ${token}` },
        body: parsed.data,
      }
    );
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Add address failed' } },
      { status }
    );
  }
}

/** GET /api/v1/address?user_id=... → upstream GET /secure/address/ (optionally with ?user_id=...) */
export async function GET(req: Request) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');

  // Build upstream path: `/secure/address/` (optionally with ?user_id=)
  let path = withTrailingSlash(AUTHERIZATION_ENDPOINT.ADDRESS_PATH);
  if (userId) {
    const sp = new URLSearchParams({ user_id: userId }).toString();
    path = `${path}?${sp}`;
  }

  try {
    // authFetch defaults to POST; override to GET and no body
    const res = await fetch(`${process.env.AUTH_BASE_URL!}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(process.env.AUTH_API_KEY ? { 'X-API-Key': process.env.AUTH_API_KEY } : {}),
      },
      cache: 'no-store',
    });

    const data = (await res.json()) as GetAddressesResponse;
    if (!res.ok) {
      throw Object.assign(new Error(data as unknown as string), {
        status: res.status,
        data,
      });
    }
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Get addresses failed' } },
      { status }
    );
  }
}
