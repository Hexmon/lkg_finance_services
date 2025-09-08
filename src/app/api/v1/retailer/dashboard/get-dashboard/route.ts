// src/app/api/v1/retailer/dashboard/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
// ⬇️ Use your shared domain types/schemas (adjust the import path if needed)
import {
  DashboardDetailsResponseSchema,
  type DashboardDetailsResponse,
} from '@/features/retailer/general/domain/types';

export async function GET() {
  // 1) Require Bearer from HttpOnly cookie
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2) Call upstream via retailerFetch (no hardcoded base URL)
    // Make sure RETAILER_ENDPOINTS.GENERAL.DASHBOARD_DETAILS === '/secure/retailer/getDashboard'
    const upstream = await retailerFetch<unknown>(
      RETAILER_ENDPOINTS.GENERAL.DASHBOARD_DETAILS,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 3) Validate/normalize with your passthrough schema
    const data: DashboardDetailsResponse = DashboardDetailsResponseSchema.parse(upstream);

    // 4) Return normalized payload
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? 'Failed to fetch dashboard' } },
      { status }
    );
  }
}
