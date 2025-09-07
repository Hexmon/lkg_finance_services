import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  ServiceChargesBodySchema,
  ServiceChargesResponseSchema,
  type ServiceChargesResponse,
} from '@/features/retailer/services/domain/types';

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = ServiceChargesBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const raw = await retailerFetch<ServiceChargesResponse>(
      RETAILER_ENDPOINTS.SERVICE.SERVICE_CHARGES,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: parsed.data,
      }
    );
    const data = ServiceChargesResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Service charges calculation failed' } },
      { status }
    );
  }
}
