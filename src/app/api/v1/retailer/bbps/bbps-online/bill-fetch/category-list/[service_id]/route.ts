import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { z } from 'zod';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';

export const BbpsCategorySchema = z.object({
  bbps_category_id: z.string(),
  biller_category: z.string(),
});
export type BbpsCategory = z.infer<typeof BbpsCategorySchema>;

export const BbpsCategoryListResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  data: z.array(BbpsCategorySchema),
});
export type BbpsCategoryListResponse = z.infer<typeof BbpsCategoryListResponseSchema>;

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ service_id: string }> };

export async function GET(req: NextRequest, context: Ctx) {
  const { service_id } = await context.params;

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get('mode') ?? 'ONLINE';

  try {
    const raw = await bbpsFetch<BbpsCategoryListResponse>(
      `/secure/bbps/bbps-category-list/${service_id}?mode=${mode}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = BbpsCategoryListResponseSchema.parse(raw);

    return NextResponse.json(data, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Upstream error', status: err?.status ?? 502 },
      { status: err?.status ?? 502 }
    );
  }
}
