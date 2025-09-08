import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTHERIZATION_ENDPOINT } from '@/config/endpoints';
import { authFetch } from '@/app/api/_lib/http';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import {
  UpdateAddressBodySchema,
  type UpdateAddressResponse,
  type DeleteAddressResponse,
} from '@/features/address/domain/types';

/** PATCH /api/v1/address/:address_id → upstream PATCH /secure/address/:address_id */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ address_id: string }> }
) {
  const { address_id } = await ctx.params;
  if (!address_id) {
    return NextResponse.json({ error: 'address_id required' }, { status: 400 });
  }

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = UpdateAddressBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const data = await authFetch<UpdateAddressResponse>(
      `${AUTHERIZATION_ENDPOINT.ADDRESS_PATH}/${encodeURIComponent(address_id)}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: parsed.data,
      }
    );
    return NextResponse.json(data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Update address failed' } },
      { status }
    );
  }
}

/** DELETE /api/v1/address/:address_id → upstream DELETE /secure/address/:address_id */
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ address_id: string }> }
) {
  const { address_id } = await ctx.params;
  if (!address_id) {
    return NextResponse.json({ error: 'address_id required' }, { status: 400 });
  }

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${process.env.AUTH_BASE_URL!}${AUTHERIZATION_ENDPOINT.ADDRESS_PATH}/${encodeURIComponent(address_id)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(process.env.AUTH_API_KEY ? { 'X-API-Key': process.env.AUTH_API_KEY } : {}),
        },
        cache: 'no-store',
      }
    );

    const data = (await res.json()) as DeleteAddressResponse;
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
      err?.data ?? { status, error: { message: err?.message ?? 'Delete address failed' } },
      { status }
    );
  }
}
