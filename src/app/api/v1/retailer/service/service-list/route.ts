import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
  ServiceListQuerySchema,
  ServiceListResponseSchema,
  type ServiceListResponse,
} from '@/features/retailer/services/domain/types';

export async function GET(req: Request) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Validate optional query params
  const url = new URL(req.url);
  const qp = Object.fromEntries(url.searchParams.entries());
  const parsed = ServiceListQuerySchema.safeParse({
    category: qp.category,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: qp.status as any,
    per_page: qp.per_page ? Number(qp.per_page) : undefined,
    page: qp.page ? Number(qp.page) : undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const raw = await retailerFetch<ServiceListResponse>(
      RETAILER_ENDPOINTS.SERVICE.SERVICE_LIST,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: parsed.data as any,
      }
    );
    const data = ServiceListResponseSchema.parse(raw);
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(err?.data ?? { status, error: { message: err?.message ?? 'Service list failed' } }, { status });
  }
}
