/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';

// ✅ import from your *actual* types file
import {
  AddOnlineBillerBffRequestSchema,
  AddOnlineBillerRequest,
  AddOnlineBillerResponse,
  AddOnlineBillerResponseSchema,
} from '@/features/retailer/retailer_bbps/bbps-online/multiple_bills/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: POST /api/v1/retailer/bbps/bbps-online/multiple-bills/add-online-biller
 * Proxies upstream:
 *   POST https://bbps-uat.bhugtan.in/secure/bbps/add-online-biller/{service_id}
 *
 * Note: This BFF expects `service_id` in the request body (UUID). It is used to
 * construct the upstream path segment.
 */
export async function POST(req: NextRequest) {
  // ---- Auth ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ---- Parse + validate body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = AddOnlineBillerBffRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { service_id, ...payload } = parsed.data;

  try {
    const raw = await bbpsFetch<unknown>(
      `/secure/bbps/add-online-biller/${service_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: payload as AddOnlineBillerRequest, // upstream payload shape (no service_id)
      }
    );

    const data: AddOnlineBillerResponse = AddOnlineBillerResponseSchema.parse(raw);
    // Normalize to 200 for UI; upstream may return status: "201" in JSON
    return NextResponse.json<AddOnlineBillerResponse>(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      err?.data ?? { error: err?.message ?? 'Upstream error' },
      { status: err?.status ?? 502 }
    );
  }
}
