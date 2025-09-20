// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\data\endpoints.ts
import { UseQueryOptions, QueryKey, useQuery } from "@tanstack/react-query";
import {
  CategoryListResponseSchema,
  BillerListResponseSchema,
  BillFetchRequestSchema,
  BillFetchResponseSchema,
  type CategoryListResponse,
  type BillerListResponse,
  type BillFetchRequest,
  type BillFetchResponse,
  PlanPullResponse,
  PlanPullResponseSchema,
} from "../domain/types";
import { getJSON, postJSON } from "@/lib/api/client";

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

export async function apiGetBillerList<T = unknown>(
  params: {
    service_id: string;
    bbps_category_id: string;
    is_offline: boolean;
    mode: "ONLINE" | "OFFLINE";
    opr_id?: string;
    is_active?: boolean | string;
  },
  opts?: { signal?: AbortSignal }
): Promise<T> {
  if (!params?.service_id) throw new Error("service_id is required");
  if (!params?.bbps_category_id) throw new Error("bbps_category_id is required");

  const qs = new URLSearchParams({
    is_offline: String(params.is_offline ?? true),
    mode: params.mode,
    ...(params.opr_id ? { opr_id: params.opr_id } : {}),
    ...(typeof params.is_active !== "undefined" ? { is_active: String(params.is_active) } : {}),
  }).toString();

  const path = `/retailer/bbps/bbps-online/bill-fetch/biller-list/${encodeURIComponent(
    params.service_id
  )}/${encodeURIComponent(params.bbps_category_id)}?${qs}`;

  // ⬇️ Pass-through: return exactly what the BFF returns
  return getJSON<T>(path, { signal: opts?.signal });
}



/**
 * GET (BFF) → /api/v1/retailer/bbps/bbps-online/bill-fetch/plan-pull/[service_id]/[billerId]?mode=ONLINE
 * Proxies upstream: /secure/bbps/bills/all-plans/{service_id}/{billerId}?mode=ONLINE
 */
export async function apiGetPlanPull(
  params: { service_id: string; billerId: string; mode: "ONLINE" | "OFFLINE" },
  opts?: { signal?: AbortSignal }
): Promise<PlanPullResponse> {
  if (!params?.service_id) throw new Error("service_id is required");
  if (!params?.billerId) throw new Error("billerId is required");

  const qs = new URLSearchParams({ mode: params.mode }).toString();

  // ✅ point to plan-pull, not biller-list
  const path =
    `/retailer/bbps/bbps-online/bill-fetch/plan-pull/` +
    `${encodeURIComponent(params.service_id)}/` +
    `${encodeURIComponent(params.billerId)}?${qs}`;

  const raw = await getJSON<unknown>(path, { signal: opts?.signal });
  return PlanPullResponseSchema.parse(raw);
}


export function useBbpsPlanPullQuery(
  params: { service_id: string; billerId: string; mode: "ONLINE" | "OFFLINE" },
  _opt?: {
    query?: Omit<
      UseQueryOptions<PlanPullResponse, Error, PlanPullResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
  }
) {
  const baseEnabled =
    !!params?.service_id &&
    !!params?.billerId &&
    !!params?.mode;

  const userEnabled = _opt?.query?.enabled ?? true;
  const enabled = baseEnabled && userEnabled;

  return useQuery({
    queryKey: ["bbps", "plan-pull", params.service_id, params.billerId, params.mode],
    queryFn: ({ signal }) => apiGetPlanPull(params, { signal }),
    // optional: avoid refetch loop on tab focus
    // staleTime: 60_000,
    // refetchOnWindowFocus: false,
    ...(_opt?.query ?? {}),
    enabled,
  });
}


/**
 * POST (BFF) → /retailer/bbps/bbps-online/bill-fetch/bill-fetch/[service_id]?mode=
 * Proxies upstream: /secure/bbps/bills/bill-fetch/{service_id}?mode=
 */
export async function apiPostBillFetch<TResp = unknown>(
  params: {
    service_id: string;
    mode: "ONLINE" | "OFFLINE";
    body: BillFetchRequest;
  },
  opts?: { signal?: AbortSignal }
): Promise<TResp> {
  if (!params?.service_id) throw new Error("service_id is required");

  // validate the request (keep this)
  const validated = BillFetchRequestSchema.parse(params.body);

  const qs = new URLSearchParams({ mode: params.mode }).toString();
  const path = `retailer/bbps/bbps-online/bill-fetch/biller-fetch/${encodeURIComponent(
    params.service_id
  )}?${qs}`;

  // ⬇️ do NOT parse the response; return as-is
  return postJSON<TResp>(path, validated, { signal: opts?.signal });
}