/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';

// Use the Bill Fetch types you already defined earlier
import {
  BillFetchRequestSchema,
  BillFetchResponseSchema,
} from '@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';

type Ctx = { params: Promise<{ service_id: string }> };

const ALLOWED_MODES = new Set(['ONLINE', 'OFFLINE']);

export async function POST(req: NextRequest, context: Ctx) {
  const { service_id } = await context.params;

  // Auth (HttpOnly cookie set by your auth flow)
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Query param: mode (default ONLINE)
  const modeRaw = req.nextUrl.searchParams.get('mode') ?? 'ONLINE';
  const mode = String(modeRaw).toUpperCase();
  if (!ALLOWED_MODES.has(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  // Validate request body against your schema
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let validated: unknown;
  try {
    validated = BillFetchRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  try {
    console.log("inside tyr");

    // Upstream POST: /secure/bbps/bills/bill-fetch/{service_id}?mode=ONLINE
    const raw = await bbpsFetch<unknown>(
      `/${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILL_FETCH}/${service_id}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        query: { mode },
        body: validated, // retailerFetch sets JSON content-type automatically for non-GET
      }
    );
    console.log({ raw });

    // Validate upstream response for a stable UI contract
    const parsed = BillFetchResponseSchema.parse(raw);
    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    console.log({ err });

    // Surface upstream error payload when possible
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
