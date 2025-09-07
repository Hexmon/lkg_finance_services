/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { BAInputParamsSchema, BACustomerInfoSchema } from '@/features/retailer/retailer_bbps/bbps-online/bill_avenue/domain/types';
import { retailerFetch } from '@/app/api/_lib/http-retailer';

export async function POST(req: Request, { params }: { params: { service_id: string } }) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.billerId) return NextResponse.json({ error: 'billerId required' }, { status: 400 });

  // (Optional) validate customerInfo & inputParams with zod
  if (body.customerInfo) {
    const parsed = BACustomerInfoSchema.safeParse(body.customerInfo);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid customerInfo', issues: parsed.error.issues }, { status: 400 });
  }
  if (body.inputParams) {
    const parsed = BAInputParamsSchema.safeParse(body.inputParams);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid inputParams', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const raw = await retailerFetch<any>(
      `/secure/bbps/bills/bill-fetch/${params.service_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          apiurl: '/extBillCntrl/billFetchRequest/xml',
        },
        body,
        query: { mode: 'ONLINE' },
      }
    );
    return NextResponse.json(raw, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err?.data ?? { error: err.message }, { status: err.status ?? 502 });
  }
}
