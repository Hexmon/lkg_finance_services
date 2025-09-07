// src\app\api\v1\retailer\bbps\bbps-online\multiple-bills\online-biller-list\[service_id]\route.ts
import 'server-only';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import { OnlineBillerListQuerySchema, OnlineBillerListResponse, OnlineBillerListResponseSchema } from '@/features/retailer/retailer_bbps/bbps-online/multiple_bills';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';

// Avoid caching for auth-backed data
export const dynamic = 'force-dynamic';

// Helpers to coerce query strings into typed values expected by your zod schema
const toBool = (v: string | null | undefined): boolean | undefined => {
  if (v == null) return undefined;
  const t = v.trim().toLowerCase();
  if (t === 'true' || t === '1') return true;
  if (t === 'false' || t === '0') return false;
  return undefined;
};
const toNum = (v: string | null | undefined): number | undefined => {
  if (v == null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export async function GET(
  req: Request,
  // Next 15: ctx.params is a Promise for dynamic routes
  ctx: { params: Promise<{ service_id: string }> }
) {
  const { service_id } = await ctx.params;

  // ---- Auth (JWT from HttpOnly cookie; never expose) ----
  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  token = token.replace(/^Bearer\s+/i, '').trim(); // prevent double "Bearer "

  // ---- Parse & normalize query with sensible defaults ----
  const sp = new URL(req.url).searchParams;
  const raw = {
    per_page: toNum(sp.get('per_page')) ?? 10,
    page: toNum(sp.get('page')) ?? 1,
    order: (sp.get('order')?.toLowerCase() as 'asc' | 'desc') ?? 'desc',
    sort_by: sp.get('sort_by') ?? 'created_at',
    status: sp.get('status') ?? 'INITIATED',
    is_active: toBool(sp.get('is_active')) ?? true,
    is_direct: toBool(sp.get('is_direct')) ?? false,
  };

  // Validate against your exported schema
  const parsedQuery = OnlineBillerListQuerySchema.parse(raw);

  try {
    // Build path from your endpoints map (append /:service_id)
    const path = `${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ONLINE_BILLER_LIST}/${service_id}`;

    const rawResp = await bbpsFetch<OnlineBillerListResponse>(path, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      query: parsedQuery,
    });

    const data = OnlineBillerListResponseSchema.parse(rawResp);
    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    // Keep response minimal; include deep debug only while diagnosing
    return NextResponse.json(
      {
        status,
        error: { message: err?.message ?? 'Online biller list failed' },
        // debug: { url: err?.url, body: err?.bodyText }, // <- uncomment temporarily if needed
      },
      { status }
    );
  }
}
