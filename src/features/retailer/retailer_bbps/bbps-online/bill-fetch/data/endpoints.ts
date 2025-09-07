// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\data\endpoints.ts
import { RETAILER_ENDPOINTS } from "@/config/endpoints";

import {
  CircleListResponseSchema,
  CategoryListResponseSchema,
  BillerListResponseSchema,
  BillFetchRequestSchema,
  BillFetchResponseSchema,
  BillerInfoRequestSchema,
  BillerInfoResponseSchema,
  type CircleListResponse,
  type CategoryListResponse,
  type BillerListResponse,
  type BillFetchRequest,
  type BillFetchResponse,
  type BillerInfoRequest,
  type BillerInfoResponse,
} from "../domain/types";
import { getTenantId, retailerRequest } from "@/features/retailer/client";
import { getJSON } from "@/lib/api/client";

/** Build paths that require tenant segment */
function pathWithTenant(basePath: string, extra?: string) {
  const tenantId = getTenantId();
  if (extra && extra.length > 0) return `${basePath}/${tenantId}/${extra}`;
  return `${basePath}/${tenantId}`;
}

/** GET /secure/bbps/circle-list/{tenantId}?search=&mode= */
export async function apiGetCircleList(
  params: { search?: string; mode: "ONLINE" | "OFFLINE" },
  opts?: { signal?: AbortSignal }
): Promise<CircleListResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.CIRCLE_LIST
  );

  const raw = await retailerRequest<unknown>({
    method: "GET",
    path,
    query: { search: params.search, mode: params.mode },
    headers: {},
    auth: true,
    apiKey: true,
    signal: opts?.signal,
  });

  return CircleListResponseSchema.parse(raw);
}

/** GET /secure/bbps/bbps-category-list/{tenantId}?mode= */
export async function apiGetCategoryList(
  params: { service_id: string; mode: 'ONLINE' | 'OFFLINE' },
  opts?: { signal?: AbortSignal }
): Promise<CategoryListResponse> {
  if (!params?.service_id) {
    throw new Error('service_id is required');
  }
  const qs = new URLSearchParams({ mode: params.mode }).toString();

  // Call your BFF route (server reads bt_auth cookie and forwards upstream)
  const raw = await getJSON<CategoryListResponse>(
    `retailer/bbps/bbps-online/bill-fetch/category-list/${encodeURIComponent(params.service_id)}?${qs}`,
    { signal: opts?.signal }
  );

  return CategoryListResponseSchema.parse(raw);
}

/**
 * GET /secure/bbps/biller-list/{service_id}/{bbps_category_id}?is_offline=&mode=&opr_id=&is_active=  (via BFF)
 * NOTE: This matches your server route:
 *   /api/v1/retailer/bbps/bbps-online/bill-fetch/biller-list/[service_id]/[bbps_category_id]
 */
export async function apiGetBillerList(
  params: {
    service_id: string;
    bbps_category_id: string;
    is_offline: boolean;
    mode: "ONLINE" | "OFFLINE";
    opr_id?: string;
    is_active?: string; // keep string to mirror upstream flexibility
  },
  opts?: { signal?: AbortSignal }
): Promise<BillerListResponse> {
  if (!params?.service_id) throw new Error("service_id is required");
  if (!params?.bbps_category_id) throw new Error("bbps_category_id is required");

  const qs = new URLSearchParams({
    is_offline: String(params.is_offline ?? false),
    mode: params.mode,
    ...(params.opr_id ? { opr_id: params.opr_id } : {}),
    ...(params.is_active ? { is_active: params.is_active } : {}),
  }).toString();

  // Hit the BFF route; server will read bt_auth and forward to BBPS base
  const path = `retailer/bbps/bbps-online/bill-fetch/biller-list/${encodeURIComponent(
    params.service_id
  )}/${encodeURIComponent(params.bbps_category_id)}?${qs}`;

  const raw = await getJSON<BillerListResponse>(path, { signal: opts?.signal });
  return BillerListResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/bill-fetch/{tenantId} */
export async function apiBillFetch(
  body: BillFetchRequest,
  opts?: { signal?: AbortSignal }
): Promise<BillFetchResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILL_FETCH
  );
  const validated = BillFetchRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>({
    method: "POST",
    path,
    body: validated,
    headers: {},
    auth: true,
    apiKey: true,
    signal: opts?.signal,
  });

  return BillFetchResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/biller-info/{tenantId} */
export async function apiGetBillerInfo(
  body: BillerInfoRequest,
  opts?: { signal?: AbortSignal }
): Promise<BillerInfoResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILLER_INFO
  );
  const validated = BillerInfoRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>({
    method: "POST",
    path,
    body: validated,
    // provider requires this static header for the biller-info call
    headers: { apiurl: "/extMdmCntrl/mdmRequestNew/xml" },
    auth: true,
    apiKey: true,
    signal: opts?.signal,
  });

  return BillerInfoResponseSchema.parse(raw);
}