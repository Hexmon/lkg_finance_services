// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\data\hooks.ts
import {
  useQuery,
  useMutation,
  // useQueryClient,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
// import { useCallback } from "react";
import {
  apiGetCircleList,
  apiGetCategoryList,
  apiGetBillerList,
  apiBillFetch,
  apiGetBillerInfo,
} from "./endpoints";
import {
  type CircleListResponse,
  type CategoryListResponse,
  type BillerListResponse,
  type BillFetchResponse,
  type BillFetchRequest,
  type BillerInfoRequest,
  type BillerInfoResponse,
} from "../domain/types";

/** -------- Circle List (query) -------- */
export function useBbpsCircleListQuery(
  params: { search?: string; mode: "ONLINE" | "OFFLINE" },
  _opt?: {
    token?: string | null; // reserved for future per-call override
    query?: Omit<
      UseQueryOptions<CircleListResponse, Error, CircleListResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
  },
) {
  return useQuery({
    queryKey: ["bbps", "circle-list", params.mode, params.search ?? ""],
    queryFn: ({ signal }) => apiGetCircleList(params, { signal }),
    enabled: (_opt?.query?.enabled ?? true) && !!params.mode,
    ...(_opt?.query ?? {}),
  });
}

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

/** -------- Bill Fetch (mutation) -------- */
export function useBbpsBillFetchMutation(_opt?: { token?: string | null }) {
  return useMutation<BillFetchResponse, Error, BillFetchRequest>({
    mutationKey: ["bbps", "bill-fetch"],
    mutationFn: (body) => apiBillFetch(body),
    // onSuccess: () => {
    //   // If you add cache invalidation later, reintroduce:
    //   // const qc = useQueryClient();
    //   // qc.invalidateQueries({ queryKey: ["bbps", "recent-bills"] });
    // },
  });
}

/** -------- Biller Info (mutation) -------- */
export function useBbpsBillerInfoMutation() {
  return useMutation<BillerInfoResponse, Error, BillerInfoRequest>({
    mutationKey: ["bbps", "biller-info"],
    mutationFn: (body) => apiGetBillerInfo(body),
  });
}