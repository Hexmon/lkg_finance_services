// src\app\api\v1\retailer\bbps\bbps-online\bill-fetch\biller-list\[service_id]\[bbps_category_id]\route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps'; // <-- BBPS base, not retailer

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  // Next 15: params is a Promise
  ctx: { params: Promise<{ service_id: string; bbps_category_id: string }> }
) {
  const { service_id, bbps_category_id } = await ctx.params;

  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, '').trim(); // avoid double Bearer

  const url = new URL(req.url);
  // required
  const is_offline = url.searchParams.get('is_offline') ?? 'false';
  const mode = url.searchParams.get('mode') ?? 'ONLINE';
  // optional parity with docs
  const opr_id = url.searchParams.get('opr_id') ?? undefined;
  const is_active = url.searchParams.get('is_active') ?? undefined;

  try {
    const raw = await bbpsFetch<any>(
      `/secure/bbps/biller-list/${encodeURIComponent(service_id)}/${encodeURIComponent(bbps_category_id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        query: {
          is_offline,
          mode,
          ...(opr_id ? { opr_id } : {}),
          ...(is_active ? { is_active } : {}),
        },
      }
    );

    return NextResponse.json(raw, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? 'Biller list failed', status },
      { status }
    );
  }
}
