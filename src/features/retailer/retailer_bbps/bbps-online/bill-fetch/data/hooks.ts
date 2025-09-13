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
export function useBbpsBillerListQuery(
  params: {
    service_id: string;
    bbps_category_id: string;
    is_offline: boolean;
    mode: "ONLINE" | "OFFLINE";
    opr_id?: string;
    is_active?: string;
  },
  _opt?: {
    token?: string | null;
    query?: Omit<
      UseQueryOptions<BillerListResponse, Error, BillerListResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
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

  return useQuery({
    queryKey: [
      "bbps",
      "biller-list",
      params.service_id,
      params.bbps_category_id,
      params.mode,
      params.is_offline ? "offline" : "online",
      params.opr_id ?? "",
      params.is_active ?? "",
    ],
    queryFn: ({ signal }) => apiGetBillerList(params, { signal }),
    enabled,
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

export function useBbpsBillerFetchMutation(
  _opt?: UseMutationOptions<BillFetchResponse, Error, BillFetchVars>
) {
  return useMutation<BillFetchResponse, Error, BillFetchVars>({
    mutationKey: ["bbps", "bill-fetch"],
    mutationFn: (vars) =>
      apiPostBillFetch(
        { service_id: vars.service_id, mode: vars.mode, body: vars.body },
        // react-query provides AbortSignal internally; postJSON uses it via client
        undefined
      ),
    ..._opt,
  });
}