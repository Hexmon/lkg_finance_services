/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { paypointFetch } from '@/app/api/_lib/http-paypoint';
import {
  AEPSBankListQuerySchema,
  AEPSBankListResponseSchema,
  type AEPSBankListResponse,
} from '@/features/retailer/cash_withdrawl/domain/types';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';

export const dynamic = 'force-dynamic';

/**
 * BFF: GET /api/v1/retailer/aeps/bank-list?service_id=<uuid>
 * Proxies upstream:
 *   GET https://paypoint-uat.bhugtan.in/secure/paypoint/aeps/banklist?service_id=<uuid>
 */
export async function GET(req: NextRequest) {
  // ---- Auth (HttpOnly cookie -> Bearer) ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ---- Parse + validate query ----
  const sp = req.nextUrl.searchParams;
  const parsed = AEPSBankListQuerySchema.safeParse({
    service_id: sp.get('service_id') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // ---- Proxy upstream ----
  try {
    const raw = await paypointFetch<unknown>(RETAILER_ENDPOINTS.CASH_WITHDRAWL.BANK_LIST, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: { service_id: parsed.data.service_id },
    });

    const data: AEPSBankListResponse = AEPSBankListResponseSchema.parse(raw);
    return NextResponse.json<AEPSBankListResponse>(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      err?.data ?? { error: err.message },
      { status: err?.status ?? 502 }
    );
  }
}
