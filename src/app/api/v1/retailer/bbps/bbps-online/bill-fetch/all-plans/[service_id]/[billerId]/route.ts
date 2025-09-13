/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { PlanPullResponseSchema } from '@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';

type Ctx = { params: Promise<{ service_id: string; billerId: string }> };

const ALLOWED_MODES = new Set(['ONLINE', 'OFFLINE']);

export async function GET(req: NextRequest, context: Ctx) {
  const { service_id, billerId } = await context.params;

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Normalize and guard mode (optional but safer)
  const modeRaw = req.nextUrl.searchParams.get('mode') ?? 'ONLINE';
  const mode = String(modeRaw).toUpperCase();
  if (!ALLOWED_MODES.has(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  try {
    // Call upstream as-is
    const raw = await bbpsFetch<unknown>(
      `/${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.ALL_PLANS}/${service_id}/${billerId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        query: { mode }, // ONLINE | OFFLINE
      }
    );

    // Validate/normalize the payload to the exact contract we expect
    const parsed = PlanPullResponseSchema.parse(raw);

    // We already validated and coerced status inside `parsed`
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
