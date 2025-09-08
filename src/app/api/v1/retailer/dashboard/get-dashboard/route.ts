import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';
import {
  DashboardDetailsResponseSchema,
  type DashboardDetailsResponse,
} from '@/features/retailer/general/domain/types';

export async function GET(_req: NextRequest) {
  // 1) Require Bearer from HttpOnly cookie
  const jar = await cookies(); // sync in Next 15
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2) Upstream
    const upstream = await retailerFetch<unknown>(
      RETAILER_ENDPOINTS.GENERAL.DASHBOARD_DETAILS,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 3) Validate/normalize
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
