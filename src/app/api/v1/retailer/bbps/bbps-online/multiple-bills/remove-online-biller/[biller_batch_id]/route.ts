// src\app\api\v1\retailer\bbps\bbps-online\multiple-bills\remove-online-biller\[biller_batch_id]\route.ts
import 'server-only';
import { NextResponse } from 'next/server';
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

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ biller_batch_id: string }> }
) {
  const { biller_batch_id } = await ctx.params;

  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // prevent double "Bearer "
  token = token.replace(/^Bearer\s+/i, '').trim();

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      {
        status,
        error: { message: err?.message ?? 'Remove online biller failed' },
        // debug: { url: err?.url, body: err?.bodyText }, // uncomment when diagnosing
      },
      { status }
    );
  }
}
