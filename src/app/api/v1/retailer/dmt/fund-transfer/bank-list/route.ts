/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  BankInfoQuerySchema,
  BankInfoResponseSchema,
  type BankInfoQuery,
  type BankInfoResponse,
} from '@/features/retailer/dmt/fund-transfer/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: GET /api/v1/retailer/dmt/fund-transfer/bank-list
 * Proxies upstream:
 *   GET https://retailer-uat.bhugtan.in/secure/retailer/bank_info?service_id=...&bank_name=...
 */
export async function GET(req: NextRequest) {
  // ---- Auth (HttpOnly cookie -> Bearer) ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ---- Parse + validate query ----
  const sp = req.nextUrl.searchParams;
  const qp = Object.fromEntries(sp.entries());
  const parsed = BankInfoQuerySchema.safeParse({
    service_id: qp.service_id,
    bank_name: qp.bank_name,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 });
  }
  const query: BankInfoQuery = parsed.data;

  // ---- Proxy upstream ----
  try {
    const raw = await retailerFetch<unknown>(
      '/secure/retailer/bank_info',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: query as any,
      }
    );

    const data: BankInfoResponse = BankInfoResponseSchema.parse(raw);
    return NextResponse.json<BankInfoResponse>(data, { status: 200 });
  } catch (err: any) {
    const code = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(err?.data ?? { error: err?.message ?? 'Bank info lookup failed' }, { status: code });
  }
}
