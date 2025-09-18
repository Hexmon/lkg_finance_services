// src/app/api/v1/retailer/dmt/beneficiary/add-beneficiary/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  AddBeneficiaryRequestSchema,
  AddBeneficiaryResponseSchema,
  type AddBeneficiaryRequest,
  type AddBeneficiaryResponse,
} from '@/features/retailer/dmt/beneficiaries/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/dmt/beneficiary/add-beneficiary
 * Proxies upstream:
 *   POST https://retailer-uat.bhugtan.in/secure/retailer/add_beneficiary
 */
export async function POST(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let payload: AddBeneficiaryRequest;
  try {
    payload = AddBeneficiaryRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    const raw = await retailerFetch<unknown>('/secure/retailer/add_beneficiary', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: payload,
    });

    const data: AddBeneficiaryResponse = AddBeneficiaryResponseSchema.parse(raw);
    return NextResponse.json<AddBeneficiaryResponse>(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Add beneficiary failed' } },
      { status }
    );
  }
}
