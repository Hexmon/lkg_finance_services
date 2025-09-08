/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import {
  RemoveOnlineBillerResponseSchema,
  type RemoveOnlineBillerResponse,
} from '@/features/retailer/retailer_bbps/bbps-online/multiple_bills';

// Avoid caching for auth-backed data
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ biller_batch_id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { biller_batch_id } = await ctx.params;

  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, '').trim(); // prevent double "Bearer "

  try {
    const path = `${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.REMOVE_ONLINE_BILLER}/${encodeURIComponent(
      biller_batch_id
    )}`;

    const raw = await bbpsFetch<RemoveOnlineBillerResponse>(path, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = RemoveOnlineBillerResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      {
        status,
        error: { message: err?.message ?? 'Remove online biller failed' },
      },
      { status }
    );
  }
}
