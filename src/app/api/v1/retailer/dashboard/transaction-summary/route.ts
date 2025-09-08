// src\app\api\v1\retailer\dashboard\transaction-summary\route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import {
  TransactionSummaryQuerySchema,
  type TransactionSummaryQuery,
  TransactionSummaryResponseSchema,
  type TransactionSummaryResponse,
} from '@/features/retailer/general/domain/types';

export async function GET(req: Request) {
  // 1) Auth via HttpOnly cookie
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) Normalize + validate query params with Zod
  const url = new URL(req.url);
  const spIn = url.searchParams;

  const raw: Partial<TransactionSummaryQuery> = {
    page: spIn.get('page') ? Number(spIn.get('page')) : undefined,
    per_page: spIn.get('per_page') ? Number(spIn.get('per_page')) : undefined,
    order: (spIn.get('order') as 'asc' | 'desc') || undefined,
    sort_by: spIn.get('sort_by') || undefined,
  };

  const parsed = TransactionSummaryQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query params', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const q = parsed.data;

  // rebuild normalized querystring
  const spOut = new URLSearchParams();
  if (q.page !== undefined) spOut.set('page', String(q.page));
  if (q.per_page !== undefined) spOut.set('per_page', String(q.per_page));
  if (q.order !== undefined) spOut.set('order', q.order);
  if (q.sort_by !== undefined) spOut.set('sort_by', q.sort_by);

  const path = spOut.toString()
    ? `${RETAILER_ENDPOINTS.GENERAL.Transaction_SUMMARY}?${spOut.toString()}`
    : RETAILER_ENDPOINTS.GENERAL.Transaction_SUMMARY;

  try {
    // 3) Upstream call
    const upstream = await retailerFetch<unknown>(path, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    // 4) Parse/validate response
    const data: TransactionSummaryResponse =
      TransactionSummaryResponseSchema.parse(upstream);

    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Failed to fetch transaction summary' } },
      { status }
    );
  }
}
