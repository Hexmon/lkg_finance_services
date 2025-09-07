import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

export async function POST(req: Request, { params }: { params: { service_id: string } }) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.billerId) return NextResponse.json({ error: 'billerId required' }, { status: 400 });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await retailerFetch<any>(
      `/secure/bbps/bills/biller-info/${params.service_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          apiurl: '/extMdmCntrl/mdmRequestNew/xml',
        },
        body,
        query: { mode: 'ONLINE' },
      }
    );
    return NextResponse.json(raw, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
