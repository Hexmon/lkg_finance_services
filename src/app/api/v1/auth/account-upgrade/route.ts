/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps'; // helper you shared (points to ADMIN base)
import {
  AccountUpgradeRequestSchema,
  AccountUpgradeResponseSchema,
  type AccountUpgradeRequest,
  type AccountUpgradeResponse,
} from '@/features/upgrade-account/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: PATCH /api/v1/auth/account-upgrade
 * Proxies upstream:
 *   PATCH https://admin-uat.bhugtan.in/admin/account-upgrade/{user_id}/{request_id}
 * Body: { user_id, request_id, status, reason? }
 */
export async function PATCH(req: NextRequest) {
  // ---- Auth (HttpOnly cookie -> Bearer) ----
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // ---- Parse + validate body ----
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let payload: AccountUpgradeRequest;
  const parsed = AccountUpgradeRequestSchema.safeParse(bodyUnknown);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 });
  }
  payload = parsed.data;

  const { user_id, request_id, status, reason } = payload;

  // ---- Proxy upstream ----
  try {
    const raw = await bbpsFetch<unknown>(
      `/admin/account-upgrade/${user_id}/${request_id}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: { status, reason },
      }
    );

    const data: AccountUpgradeResponse = AccountUpgradeResponseSchema.parse(raw);
    return NextResponse.json<AccountUpgradeResponse>(data, { status: 200 });
  } catch (err: any) {
    const code = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(err?.data ?? { error: err?.message ?? 'Account upgrade failed' }, { status: code });
  }
}
