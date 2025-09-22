// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\data\hooks.ts
import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";
import {
  apiGetCategoryList,
  apiGetBillerList,
  apiGetPlanPull,
  apiPostBillFetch
} from "./endpoints";
import {
  type CategoryListResponse,
  type BillerListResponse,
  PlanPullResponse,
  BillFetchRequest,
  BillFetchResponse,
} from "../domain/types";

/** -------- Category List (query) -------- */
export function useBbpsCategoryListQuery(
  params: { service_id: string; mode: 'ONLINE' | 'OFFLINE' },
  _opt?: { query?: Omit<UseQueryOptions<CategoryListResponse, Error, CategoryListResponse, QueryKey>, 'queryKey' | 'queryFn'>; }
) {
  const baseEnabled =
    !!params?.service_id &&
    params.service_id.length > 0 &&
    !!params?.mode;

  const userEnabled = _opt?.query?.enabled ?? true;
  const enabled = baseEnabled && userEnabled;

  return useQuery({
    queryKey: ['bbps', 'category-list', params.service_id, params.mode],
    queryFn: ({ signal }) => apiGetCategoryList(params, { signal }),
    // spread first, then enforce our final enabled
    ...(_opt?.query ?? {}),
    enabled,
  });
}


/** -------- Biller List (query) --------
 * Matches BFF route: /bill-fetch/biller-list/[service_id]/[bbps_category_id]
 */

// ✅ useBbpsBillerListQuery — add default select(normalize) + stability
export function useBbpsBillerListQuery<T = unknown>(
  params: {
    service_id: string;
    bbps_category_id: string;
    is_offline: boolean;
    mode: "ONLINE" | "OFFLINE";
    opr_id?: string;
    is_active?: boolean | string;
  },
  _opt?: {
    token?: string | null;
    query?: Omit<UseQueryOptions<T, Error, T, QueryKey>, "queryKey" | "queryFn">;
  },
) {
  const baseEnabled =
    !!params?.service_id &&
    params.service_id.length > 0 &&
    !!params?.bbps_category_id &&
    params.bbps_category_id.length > 0 &&
    !!params.mode;

  const userEnabled = _opt?.query?.enabled ?? true;
  const enabled = baseEnabled && userEnabled;

  // normalize biller shapes to consistent keys
  const normalize = (raw: any) => {
    const list = raw?.data ?? [];
    const data = Array.isArray(list)
      ? list.map((b: any) => ({
          ...b,
          biller_id: b?.biller_id ?? b?.billerId ?? b?.id ?? "",
          biller_status: b?.biller_status ?? b?.billerStatus ?? "INACTIVE",
          biller_payment_exactness:
            b?.biller_payment_exactness ?? b?.billerPaymentExactness ?? null,
          plan_mdm_requirement:
            b?.plan_mdm_requirement ?? b?.planMdmRequirement ?? "NOT_SUPPORTED",
          biller_fetch_requiremet:
            b?.biller_fetch_requiremet ?? b?.billerFetchRequiremet ?? "NOT_REQUIRED",
          inputParams: b?.inputParams ?? b?.input_params ?? [],
        }))
      : [];
    return { ...raw, data };
  };

  return useQuery<T, Error>({
    queryKey: [
      "bbps",
      "biller-list",
      params.service_id,
      params.bbps_category_id,
      params.mode,
      params.is_offline ? "offline" : "online",
      params.opr_id ?? "",
      String(params.is_active ?? "true"), // ← CHANGED: default active
    ],
    queryFn: ({ signal }) => apiGetBillerList<T>(params, { signal }),
    enabled,
    // prefer caller's select if provided; otherwise normalize
    select: (_opt?.query as any)?.select ?? ((d: any) => normalize(d)),
    staleTime: 60_000, // 1 min
    placeholderData: (prev) => prev, // keeps old list during refetch
    ...(_opt?.query ?? {}),
  });
}


/** -------- Plan Pull (query) --------
 * Matches BFF route:
 *   /retailer/bbps/bbps-online/bill-fetch/plan-pull/[service_id]/[billerId]?mode=
 */
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
    params.service_id.length > 0 &&
    !!params?.billerId &&
    params.billerId.length > 0 &&
    !!params?.mode;

  const userEnabled = _opt?.query?.enabled ?? true;
  const enabled = baseEnabled && userEnabled;

  return useQuery({
    queryKey: [
      "bbps",
      "plan-pull",
      params.service_id,
      params.billerId,
      params.mode,
    ],
    queryFn: ({ signal }) => apiGetPlanPull(params, { signal }),
    ...(_opt?.query ?? {}),
    enabled,
  });
}

/** -------- Bill Fetch (mutation, POST) -------- */
type BillFetchVars = {
  service_id: string;
  mode: "ONLINE" | "OFFLINE";
  body: BillFetchRequest;
};

export function useBbpsBillerFetchMutation<TResp = unknown>(
  _opt?: UseMutationOptions<TResp, Error, BillFetchVars>
) {
  return useMutation<TResp, Error, BillFetchVars>({
    mutationKey: ["bbps", "bill-fetch"],
    mutationFn: (vars) =>
      apiPostBillFetch<TResp>(
        { service_id: vars.service_id, mode: vars.mode, body: vars.body },
        // react-query provides AbortSignal internally; postJSON uses it via client
        undefined
      ),
    ..._opt,
  });
}