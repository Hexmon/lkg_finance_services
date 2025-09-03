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
  params: { mode: "ONLINE" | "OFFLINE" },
  opts?: { signal?: AbortSignal }
): Promise<CategoryListResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.CATEGORY_LIST
  );

  const raw = await retailerRequest<unknown>({
    method: "GET",
    path,
    query: { mode: params.mode },
    headers: {},
    auth: true,
    apiKey: true,
    signal: opts?.signal,
  });

  return CategoryListResponseSchema.parse(raw);
}

/** GET /secure/bbps/biller-list/{tenantId}/{bbps_category_id}?is_offline=&mode= */
export async function apiGetBillerList(
  params: { bbps_category_id: string; is_offline: boolean; mode: "ONLINE" | "OFFLINE" },
  opts?: { signal?: AbortSignal }
): Promise<BillerListResponse> {
  const base = RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILLER_LIST;
  const path = pathWithTenant(base, params.bbps_category_id);

  const raw = await retailerRequest<unknown>({
    method: "GET",
    path,
    query: { is_offline: params.is_offline, mode: params.mode },
    headers: {},
    auth: true,
    apiKey: true,
    signal: opts?.signal,
  });

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
