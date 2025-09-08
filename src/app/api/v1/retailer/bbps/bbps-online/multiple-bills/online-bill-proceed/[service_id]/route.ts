/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import {
  OnlineBillProceedRequestSchema,
  OnlineBillProceedResponseSchema,
  type OnlineBillProceedResponse,
} from '@/features/retailer/retailer_bbps/bbps-online/multiple_bills';

// Avoid caching for auth-backed data
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ service_id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { service_id } = await ctx.params;

  // ---- Auth (JWT from HttpOnly cookie; never expose) ----
  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, '').trim(); // prevent double "Bearer "

  // ---- Parse & validate JSON body ----
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = OnlineBillProceedRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'batch_id required', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const path = `${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ONLINE_BILL_PROCEED}/${encodeURIComponent(
      service_id
    )}`;

    const raw = await bbpsFetch<OnlineBillProceedResponse>(path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: parsed.data, // { batch_id }
    });

    const data = OnlineBillProceedResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      {
        status,
        error: { message: err?.message ?? 'Online bill proceed failed' },
        // debug: { url: err?.url, body: err?.bodyText }, // <- uncomment while diagnosing
      },
      { status }
    );
  }
}
