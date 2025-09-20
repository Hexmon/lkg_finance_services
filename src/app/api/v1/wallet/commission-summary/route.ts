/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { CommissionSummaryQuerySchema } from '@/features/retailer/wallet/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: GET /api/v1/wallet/commission-summary
 * Proxies upstream:
 *   GET /secure/retailer/commission-summary
 * Returns the upstream payload as-is (no transformation).
 */
export async function GET(req: NextRequest) {
  // ---- auth via HttpOnly cookie -> Bearer ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ---- validate & coerce query params ----
  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  let q: ReturnType<typeof CommissionSummaryQuerySchema['parse']>;
  try {
    q = CommissionSummaryQuerySchema.parse({
      page: sp.page,
      per_page: sp.per_page,
      order: sp.order,
      sort_by: sp.sort_by,
      start_date: sp.start_date,
      end_date: sp.end_date,
      user_id: sp.user_id || undefined, // avoid sending empty string
    });
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Invalid query', issues: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  // ---- upstream call ----
  try {
    const upstream = await retailerFetch<unknown>(
      RETAILER_ENDPOINTS.WALLET.COMMISSION_SUMMARY,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: {
          page: q.page,
          per_page: q.per_page,
          order: q.order,
          sort_by: q.sort_by,
          start_date: q.start_date,
          end_date: q.end_date,
          user_id: q.user_id, // optional
        },
      }
    );

    // return upstream exactly as received
    return NextResponse.json(upstream, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Failed to fetch commission summary' } },
      { status }
    );
  }
}
