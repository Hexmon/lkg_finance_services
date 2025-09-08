/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

type Ctx = { params: Promise<{ service_id: string; billerId: string }> };

export async function GET(req: NextRequest, context: Ctx) {
  const { service_id, billerId } = await context.params;

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const mode = req.nextUrl.searchParams.get('mode') ?? 'ONLINE';

  try {
    const raw = await retailerFetch<any>(
      `/secure/bbps/bills/all-plans/${service_id}/${billerId}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` }, query: { mode } }
    );
    return NextResponse.json(raw, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
