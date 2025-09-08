/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  SubscriptionsListQuerySchema,
  SubscriptionsListResponseSchema,
  type SubscriptionsListResponse,
} from '@/features/retailer/services/domain/types';

export async function GET(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const qp = Object.fromEntries(sp.entries());
  const parsed = SubscriptionsListQuerySchema.safeParse({
    per_page: qp.per_page ? Number(qp.per_page) : undefined,
    page: qp.page ? Number(qp.page) : undefined,
    order: qp.order as any,
    sort_by: qp.sort_by,
    service_id: qp.service_id,
    status: qp.status as any,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const raw = await retailerFetch<SubscriptionsListResponse>(
      RETAILER_ENDPOINTS.SERVICE.SUBSCRIPTIONS,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: parsed.data as any,
      }
    );
    const data = SubscriptionsListResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Subscriptions fetch failed' } },
      { status }
    );
  }
}
