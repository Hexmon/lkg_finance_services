/**
 * Retailer | General module — hooks
 *
 * Hooks covered:
 * - useTransactionSummaryQuery
 * - useDashboardDetailsQuery
 * + Aggregator useGeneralApi()
 */

import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import {
  apiTransactionSummaryList,
  apiDashboardDetails,
} from "./endpoints";
import {
  TransactionSummaryQuery,
  TransactionSummaryResponse,
  DashboardDetailsResponse,
} from "../domain/types";

/** Cache keys */
const qk = {
  base: ["bbps", "retailer", "general"] as const,
  transactionSummary: (params: TransactionSummaryQuery) =>
    [...qk.base, "transaction-summary", params] as QueryKey,
  dashboard: () => [...qk.base, "dashboard"] as QueryKey,
};

/** ---------- Transaction Summary (query) ---------- */
export function useTransactionSummaryQuery(
  params: TransactionSummaryQuery = {},
  options?: Omit<
    UseQueryOptions<TransactionSummaryResponse, Error, TransactionSummaryResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: qk.transactionSummary(params),
    queryFn: ({ signal }) => apiTransactionSummaryList(params, { signal }),
    ...(options ?? {}),
  });
}

/** ---------- Dashboard Details (query) ---------- */
export function useDashboardDetailsQuery(
  options?: Omit<
    UseQueryOptions<DashboardDetailsResponse, Error, DashboardDetailsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: qk.dashboard(),
    queryFn: ({ signal }) => apiDashboardDetails({ signal }),
    ...(options ?? {}),
  });
}

/** ---------- Aggregator ---------- */
export function useGeneralApi() {
  const qc = useQueryClient();

  return {
    /** Imperative, cached fetches */
    getTransactionSummary: (params: TransactionSummaryQuery = {}) =>
      qc.fetchQuery({
        queryKey: qk.transactionSummary(params),
        queryFn: ({ signal }) => apiTransactionSummaryList(params, { signal }),
      }),

    getDashboardDetails: () =>
      qc.fetchQuery({
        queryKey: qk.dashboard(),
        queryFn: ({ signal }) => apiDashboardDetails({ signal }),
      }),
  };
}
