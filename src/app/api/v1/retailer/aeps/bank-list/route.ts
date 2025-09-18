/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { AEPSBankListQuerySchema, AEPSBankListResponseSchema, type AEPSBankListResponse } from '@/features/retailer/cash_withdrawl/domain/types';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

export const dynamic = 'force-dynamic';

/**
 * BFF: GET /api/v1/retailer/aeps/bank-list?service_id=<uuid>&bank_name=<text>
 * Proxies upstream:
 *   GET https://retailer-uat.bhugtan.in/secure/retailer/bank_info?service_id=<uuid>&bank_name=<text>
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
    bank_name: sp.get('bank_name') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    // ---- Call upstream ----
    const raw = await retailerFetch<unknown>(RETAILER_ENDPOINTS.CASH_WITHDRAWL.BANK_LIST, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      query: {
        service_id: parsed.data.service_id,
        bank_name: parsed.data.bank_name,
      },
    });

    // ---- Normalize upstream -> schema shape ----
    // Upstream example:
    // { status: "200", banks: [{ bank_code, bank_name, ... }], count: 2 }
    const r = raw as any;

    const normalized =
      Array.isArray(r?.bankList)
        // Already in expected shape
        ? { status: Number(r?.status), bankList: r.bankList }
        // Retailer 'bank_info' shape -> map to expected 'bankList'
        : {
          status: Number(r?.status ?? r?.status_code ?? 200),
          bankList: Array.isArray(r?.banks)
            ? r.banks.map((b: any) => ({
              // Map only what your UI needs; keep passthrough in schema for extras
              'Bank Code': b?.bank_code,
              'Bank Name': b?.bank_name,
              // Optional carry-overs if you want them available downstream:
              BankId: b?.BankId,
              IMPS: b?.imps_allowed,
              NEFT: b?.neft_allowed,
              'Account Verification': b?.account_verification_allowed,
            }))
            : [],
        };

    const data: AEPSBankListResponse = AEPSBankListResponseSchema.parse(normalized);
    return NextResponse.json<AEPSBankListResponse>(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err?.message ?? 'Upstream error' }, { status: err?.status ?? 502 });
  }
}
