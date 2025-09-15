// src/features/retailer/retailer_bbps/bbps-online/bill_avenue/hooks.ts
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";
import { TxnStatusRequest, BillPaymentResponse, BillPaymentRequest, TxnStatusResponse } from "../domain/types";
import { apiBillPayment, apiTxnStatus } from "./endpoints";

/** ---------------------- Query Keys ---------------------- **/
const qk = {
  base: ["bbps", "bill-avenue"] as const,
  billPayment: (service_id: string) =>
    [...qk.base, "bill-payment", service_id] as QueryKey,
  txnStatus: (service_id: string, body: TxnStatusRequest) =>
    [...qk.base, "txn-status", service_id, body] as QueryKey,
};

type BillPaymentVars = {
  service_id: string;
  body: BillPaymentRequest;
};

export function useBillPayment() {
  const mutation = useMutation<BillPaymentResponse, unknown, BillPaymentVars>({
    mutationFn: ({ service_id, body }) => apiBillPayment(service_id, body),
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    billPayment: mutation.mutate,            // sync-call style
    billPaymentAsync: mutation.mutateAsync,  // async/await style
    reset: mutation.reset,
  };
}


/** ---------------------- Txn Status (Query) ---------------------- **/
/**
 * Usage:
 * const { data, fetchStatus, isLoading, error } =
 *   useTxnStatus(service_id, body, { enabled: false });
 */
export function useTxnStatus(
  service_id: string,
  body: TxnStatusRequest,
  options?: Omit<
    UseQueryOptions<TxnStatusResponse, Error, TxnStatusResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  const q = useQuery<TxnStatusResponse, Error, TxnStatusResponse, QueryKey>({
    queryKey: qk.txnStatus(service_id, body),
    queryFn: () => apiTxnStatus({ service_id }, body),
    enabled: options?.enabled ?? false, // default opt-in via refetch
    ...options,
  });

  return {
    data: q.data,
    fetchStatus: q.refetch,
    isLoading: q.isLoading,
    error: q.error,
    status: q.status,
  };
}
