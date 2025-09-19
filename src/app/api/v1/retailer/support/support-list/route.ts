/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import {
  CreateTicketRequestSchema,
  CreateTicketResponseSchema,
  type CreateTicketRequest,
  type CreateTicketResponse,
} from '@/features/support/domain/types';

export const dynamic = 'force-dynamic';

// Upstream absolute URL (AUTH service)
const AUTH_CREATE_TICKET_URL = 'https://auth-uat.bhugtan.in/secure/create-ticket';

/**
 * BFF: POST /api/v1/retailer/support/support-list
 * Proxies upstream:
 *   POST https://auth-uat.bhugtan.in/secure/create-ticket
 */
export async function POST(req: NextRequest) {
  // ---- Auth (HttpOnly JWT cookie -> Bearer) ----
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

  let payload: CreateTicketRequest;
  try {
    payload = CreateTicketRequestSchema.parse(body);
  } catch (zerr: any) {
    return NextResponse.json(
      { error: 'Validation failed', issues: zerr?.errors ?? String(zerr) },
      { status: 400 }
    );
  }

  // ---- Proxy upstream ----
  try {
    const res = await fetch(AUTH_CREATE_TICKET_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });

    const text = await res.text().catch(() => '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

    if (!res.ok) {
      const status = res.status || json?.status || 502;
      return NextResponse.json(
        json ?? { status, error: { message: res.statusText || 'Upstream error' } },
        { status }
      );
    }

    const parsed: CreateTicketResponse = CreateTicketResponseSchema.parse(json);
    // Upstream returns "status": "201" in body; normalize HTTP status to 200 for UI
    return NextResponse.json<CreateTicketResponse>(parsed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err?.status ?? 502 });
  }
}
