import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { useCallback } from "react";
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
  params: { mode: "ONLINE" | "OFFLINE" },
  _opt?: {
    token?: string | null;
    query?: Omit<
      UseQueryOptions<CategoryListResponse, Error, CategoryListResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
  },
) {
  return useQuery({
    queryKey: ["bbps", "category-list", params.mode],
    queryFn: ({ signal }) => apiGetCategoryList(params, { signal }),
    enabled: _opt?.query?.enabled ?? true,
    ...(_opt?.query ?? {}),
  });
}

/** -------- Biller List (query) -------- */
export function useBbpsBillerListQuery(
  params: { bbps_category_id: string; is_offline: boolean; mode: "ONLINE" | "OFFLINE" },
  _opt?: {
    token?: string | null;
    query?: Omit<
      UseQueryOptions<BillerListResponse, Error, BillerListResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
  },
) {
  return useQuery({
    queryKey: [
      "bbps",
      "biller-list",
      params.bbps_category_id,
      params.mode,
      params.is_offline ? "offline" : "online",
    ],
    queryFn: ({ signal }) => apiGetBillerList(params, { signal }),
    enabled: (_opt?.query?.enabled ?? true) && params.bbps_category_id.length > 0,
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

/**
 * ---------- Aggregator: “function-call” style ----------
 * Usage:
 * const { getCircleList, getCategoryList, getBillerList, billFetch, billerInfo } = useBbpsApi();
 * const circles = await getCircleList({ mode: "ONLINE", search: "MH" });
 * await billFetch({ ... });
 * await billerInfo({ billerId: "DUMMY0000DIG08" });
 */
export function useBbpsApi() {
  const qc = useQueryClient();

  // Imperative GETs via QueryClient (cached, deduped)
  const getCircleList = useCallback(
    (params: { search?: string; mode: "ONLINE" | "OFFLINE" }) =>
      qc.fetchQuery({
        queryKey: ["bbps", "circle-list", params.mode, params.search ?? ""],
        queryFn: ({ signal }) => apiGetCircleList(params, { signal }),
      }),
    [qc],
  );

  const getCategoryList = useCallback(
    (params: { mode: "ONLINE" | "OFFLINE" }) =>
      qc.fetchQuery({
        queryKey: ["bbps", "category-list", params.mode],
        queryFn: ({ signal }) => apiGetCategoryList(params, { signal }),
      }),
    [qc],
  );

  const getBillerList = useCallback(
    (params: { bbps_category_id: string; is_offline: boolean; mode: "ONLINE" | "OFFLINE" }) =>
      qc.fetchQuery({
        queryKey: [
          "bbps",
          "biller-list",
          params.bbps_category_id,
          params.mode,
          params.is_offline ? "offline" : "online",
        ],
        queryFn: ({ signal }) => apiGetBillerList(params, { signal }),
      }),
    [qc],
  );

  // Mutations (expose async functions for clean destructuring)
  const billFetchMut = useMutation<BillFetchResponse, Error, BillFetchRequest>({
    mutationKey: ["bbps", "bill-fetch"],
    mutationFn: apiBillFetch,
  });

  const billerInfoMut = useMutation<BillerInfoResponse, Error, BillerInfoRequest>({
    mutationKey: ["bbps", "biller-info"],
    mutationFn: apiGetBillerInfo,
  });

  return {
    // Callable GETs
    getCircleList,
    getCategoryList,
    getBillerList,

    // Callable POSTs (async)
    billFetch: billFetchMut.mutateAsync,
    billerInfo: billerInfoMut.mutateAsync,

    // Optional status if you want to render loading/error states
    billFetchStatus: {
      isPending: billFetchMut.isPending,
      isSuccess: billFetchMut.isSuccess,
      error: billFetchMut.error,
      data: billFetchMut.data,
    },
    billerInfoStatus: {
      isPending: billerInfoMut.isPending,
      isSuccess: billerInfoMut.isSuccess,
      error: billerInfoMut.error,
      data: billerInfoMut.data,
    },
  };
}
