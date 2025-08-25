import { retailerRequest, getTenantId } from "./client";
import {
  CircleListResponseSchema,
  CategoryListResponseSchema,
  BillerListResponseSchema,
  BillFetchRequestSchema,
  BillFetchResponseSchema,
  type CircleListResponse,
  type CategoryListResponse,
  type BillerListResponse,
  type BillFetchRequest,
  type BillFetchResponse,
  BillerInfoRequest,
  BillerInfoRequestSchema,
  BillerInfoResponse,
  BillerInfoResponseSchema,
} from "../domain/types";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";

/** Build paths that require tenant segment */
function pathWithTenant(basePath: string, extra?: string) {
  const tenantId = getTenantId();
  if (extra && extra.length > 0) return `${basePath}/${tenantId}/${extra}`;
  return `${basePath}/${tenantId}`;
}

/** GET /secure/bbps/circle-list/{tenantId}?search=&mode= */
export async function apiGetCircleList(
  params: { search?: string; mode: "ONLINE" | "OFFLINE" },
): Promise<CircleListResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.CIRCLE_LIST);
  const raw = await retailerRequest<unknown>(path, "GET", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
    query: { search: params.search, mode: params.mode },
  });
  return CircleListResponseSchema.parse(raw);
}

/** GET /secure/bbps/bbps-category-list/{tenantId}?mode= */
export async function apiGetCategoryList(
  params: { mode: "ONLINE" | "OFFLINE" },
): Promise<CategoryListResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.CATEGORY_LIST);
  const raw = await retailerRequest<unknown>(path, "GET", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
    query: { mode: params.mode },
  });
  return CategoryListResponseSchema.parse(raw);
}

/** GET /secure/bbps/biller-list/{tenantId}/{bbps_category_id}?is_offline=&mode= */
export async function apiGetBillerList(
  params: { bbps_category_id: string; is_offline: boolean; mode: "ONLINE" | "OFFLINE" },
): Promise<BillerListResponse> {
  const base = RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILLER_LIST;
  const path = pathWithTenant(base, params.bbps_category_id);
  const raw = await retailerRequest<unknown>(path, "GET", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
    query: { is_offline: params.is_offline, mode: params.mode },
  });
  return BillerListResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/bill-fetch/{tenantId} */
export async function apiBillFetch(
  body: BillFetchRequest,
): Promise<BillFetchResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILL_FETCH);
  const validated = BillFetchRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(path, "POST", validated, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return BillFetchResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/biller-info/{tenantId} */
export async function apiGetBillerInfo(body: BillerInfoRequest): Promise<BillerInfoResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_FETCH.BILLER_INFO,
  );
  const validated = BillerInfoRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>(
    path,
    "POST",
    validated,
    { headers: { apiurl: "/extMdmCntrl/mdmRequestNew/xml" } }, // required header
    { includeApiKey: true, includeAuth: true },
  );

  return BillerInfoResponseSchema.parse(raw);
}
