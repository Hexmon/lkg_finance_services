/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { bbpsFetch } from '@/app/api/_lib/http-bbps';
import { RETAILER_ENDPOINTS } from '@/config/endpoints';

// 👇 Use the schemas/types from your domain/types.ts file
import {
  OnlineBillerListQuerySchema,
  OnlineBillerListResponse,
  OnlineBillerListResponseSchema,
} from '@/features/retailer/retailer_bbps/bbps-online/multiple_bills';
import { ZodError } from 'zod';

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
  req: NextRequest,
  { params }: { params: { service_id: string } }
) {
  const { service_id } = params ?? {};
  if (!service_id) {
    return NextResponse.json(
      { status: 400, error: { message: 'service_id is required' } },
      { status: 400 }
    );
  }

  // ---- Auth (JWT from HttpOnly cookie; never expose) ----
  const jar = await cookies();
  let token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  token = token.replace(/^Bearer\s+/i, '').trim(); // prevent double "Bearer "

  // ---- Parse & normalize query with sensible defaults ----
  const sp = req.nextUrl.searchParams;
  const raw = {
    per_page: toNum(sp.get('per_page')) ?? 10,
    page: toNum(sp.get('page')) ?? 1,
    order: (sp.get('order')?.toLowerCase() as 'asc' | 'desc') ?? 'desc',
    sort_by: sp.get('sort_by') ?? 'created_at',
    status: sp.get('status') ?? 'INITIATED',
    is_active: toBool(sp.get('is_active')) ?? true,
    is_direct: toBool(sp.get('is_direct')) ?? false,
  };

  let parsedQuery: ReturnType<typeof OnlineBillerListQuerySchema.parse>;
  try {
    parsedQuery = OnlineBillerListQuerySchema.parse(raw);
  } catch (e) {
    const err = e as ZodError;
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: 'Invalid query parameters',
          issues: err.issues,
        },
      },
      { status: 400 }
    );
  }

  try {
    const path =
      `${RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ONLINE_BILLER_LIST}` +
      `/${service_id}`;

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
  } catch (e: any) {
    // If backend returns structured error with status, prefer it
    const backendStatus =
      e?.status ?? e?.data?.status ?? e?.response?.status ?? 502;

    // If Zod fails while parsing backend response, surface a 502 with details (without leaking full payload)
    if (e instanceof ZodError) {
      return NextResponse.json(
        {
          status: 502,
          error: {
            message: 'Invalid response shape from BBPS backend',
            issues: e.issues,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        status: backendStatus,
        error: { message: e?.message ?? 'Online biller list failed' },
      },
      { status: backendStatus }
    );
  }
}
