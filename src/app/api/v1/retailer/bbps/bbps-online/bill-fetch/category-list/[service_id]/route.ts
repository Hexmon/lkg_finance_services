// src/app/api/v1/retailer/bbps/bbps-online/bill-fetch/category-list/[service_id]/route.ts
import 'server-only';
import { NextResponse } from 'next/server';
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

// (optional, but keeps it from being cached)
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  // ⬇️ params is a Promise in Next 15 dynamic API routes
  ctx: { params: Promise<{ service_id: string }> }
) {

  console.log("inide the server");
  // ✅ await params before using it
  const { service_id } = await ctx.params;
  console.log({ service_id });

  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  console.log({ token });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') ?? 'ONLINE';
  console.log({ url, mode });

  try {
    console.log("indeisde try");
    
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
    console.log({ er: err.message, st: err.status });

    return NextResponse.json(
      { error: err?.message ?? 'Upstream error', status: err?.status ?? 502 },
      { status: err?.status ?? 502 }
    );
  }
}
