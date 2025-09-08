/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps'; // BBPS base, not retailer

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ service_id: string; bbps_category_id: string }> };

export async function GET(req: NextRequest, context: Ctx) {
  const { service_id, bbps_category_id } = await context.params;

  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, '').trim(); // avoid double Bearer

  const sp = req.nextUrl.searchParams;
  const is_offline = sp.get('is_offline') ?? 'false'; // required
  const mode = sp.get('mode') ?? 'ONLINE';             // required
  const opr_id = sp.get('opr_id') ?? undefined;        // optional
  const is_active = sp.get('is_active') ?? undefined;  // optional

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
