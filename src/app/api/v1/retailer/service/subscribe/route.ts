/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  ServiceSubscribeBodySchema,
  ServiceSubscribeResponseSchema,
  type ServiceSubscribeResponse,
} from '@/features/retailer/services';

export async function POST(req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = ServiceSubscribeBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    console.log("indeisd rtyr ");
    
    const raw = await retailerFetch<ServiceSubscribeResponse>(
      RETAILER_ENDPOINTS.SERVICE.SUBSCRIBE,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Tip: you can omit Content-Type, retailerFetch sets it when needed
        },
        body: parsed.data, // <-- FIX: do NOT JSON.stringify here
      }
    );

    const data = ServiceSubscribeResponseSchema.parse(raw);

    const statusCode =
      typeof (data as any)?.status === 'string' && (data as any).status === '201'
        ? 201
        : 200;

    return NextResponse.json(data, { status: statusCode });
  } catch (err: any) {
    console.log({err});
    
    const status = Number(
      err?.status ?? err?.response?.status ?? err?.data?.status ?? 502
    );

    const payload =
      err?.data ?? {
        error: { message: err?.message ?? 'Service subscribe failed' },
      };

    return NextResponse.json(payload, { status: status || 502 });
  }
}
