import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  ServiceSubscribeBodySchema,
  ServiceSubscribeResponseSchema,
  type ServiceSubscribeResponse,
} from '@/features/retailer/services/domain/types';

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = ServiceSubscribeBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const raw = await retailerFetch<ServiceSubscribeResponse>(
      RETAILER_ENDPOINTS.SERVICE.SUBSCRIBE,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: parsed.data,
      }
    );
    const data = ServiceSubscribeResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Service subscribe failed' } },
      { status }
    );
  }
}
