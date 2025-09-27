// src/features/retailer/retailer_bbps/bbps-online/multiple-bills/hooks.ts

import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  apiAddOnlineBiller,
  apiGetOnlineBillerList,
  apiOnlineBillProceed,
  apiRemoveOnlineBiller,
} from "./endpoints";

import type {
  AddOnlineBillerBffRequest,
  AddOnlineBillerResponse,
  OnlineBillerListQuery,
  OnlineBillerListResponse,
  OnlineBillProceedRequest,
  OnlineBillProceedResponse,
  RemoveOnlineBillerResponse,
} from "../domain/types";

/* ---------------------------------------------
 * Online Biller List (GET)
 * --------------------------------------------- */
export function useOnlineBillerListQuery(
  params: { service_id: string } & Partial<OnlineBillerListQuery>,
  _opt?: {
    query?: Omit<
      UseQueryOptions<OnlineBillerListResponse, Error, OnlineBillerListResponse, QueryKey>,
      "queryKey" | "queryFn"
    >;
  }
) {
  const baseEnabled = !!params?.service_id && params.service_id.length > 0;
  const userEnabled = _opt?.query?.enabled ?? true;
  const enabled = baseEnabled && userEnabled;

  return useQuery({
    queryKey: [
      "bbps",
      "multiple-bills",
      "online-biller-list",
      params.service_id,
      params.per_page,
      params.page,
      params.order,
      params.sort_by,
      params.status,
      params.is_active,
      params.is_direct,
    ],
    queryFn: ({ signal }) => apiGetOnlineBillerList(params, { signal }),
    // spread first, then enforce our final enabled
    ...(_opt?.query ?? {}),
    enabled,
  });
}

/* ---------------------------------------------
 * Online Bill Proceed (POST) - low-level mutation
 * --------------------------------------------- */
type ProceedVarsFull = { service_id: string } & OnlineBillProceedRequest;

export function useOnlineBillProceedMutation(
  options?: UseMutationOptions<OnlineBillProceedResponse, Error, ProceedVarsFull>
) {
  return useMutation<OnlineBillProceedResponse, Error, ProceedVarsFull>({
    mutationKey: ["bbps", "multiple-bills", "online-bill-proceed"],
    mutationFn: (vars) => apiOnlineBillProceed(vars),
    ...options,
  });
}

/* ---------------------------------------------
 * Online Bill Proceed (POST) - convenience hook
 * Usage:
 *   const { proceed, data, isLoading, error } = useOnlineBillProceed(serviceId);
 *   await proceed({ batch_id });
 * --------------------------------------------- */
type ProceedVars = Pick<OnlineBillProceedRequest, "batch_id">;

export function useOnlineBillProceed(
  service_id: string,
  options?: UseMutationOptions<OnlineBillProceedResponse, Error, ProceedVars>
) {
  const mutation = useMutation<OnlineBillProceedResponse, Error, ProceedVars>({
    mutationKey: ["bbps", "multiple-bills", "online-bill-proceed", service_id],
    mutationFn: ({ batch_id }) => apiOnlineBillProceed({ service_id, batch_id }),
    ...options,
  });

  return {
    proceed: mutation.mutateAsync, // function to call
    data: mutation.data,           // response payload
    isLoading: mutation.isPending, // loading flag
    error: mutation.error,         // Error | null
    // optional extras
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    status: mutation.status,
  };
}

/* ---------------------------------------------
 * Remove Online Biller (DELETE) - low-level mutation
 * --------------------------------------------- */
type RemoveVars = { biller_batch_id: string };

export function useRemoveOnlineBillerMutation(
  options?: UseMutationOptions<RemoveOnlineBillerResponse, Error, RemoveVars>
) {
  return useMutation<RemoveOnlineBillerResponse, Error, RemoveVars>({
    mutationKey: ["bbps", "multiple-bills", "remove-online-biller"],
    mutationFn: (vars) => apiRemoveOnlineBiller(vars),
    ...options,
  });
}

/* ---------------------------------------------
 * Remove Online Biller (DELETE) - convenience hook
 * Usage:
 *   const { removeBiller, data, isLoading, error } = useRemoveOnlineBiller();
 *   await removeBiller({ biller_batch_id });
 * --------------------------------------------- */
export function useRemoveOnlineBiller(
  options?: UseMutationOptions<RemoveOnlineBillerResponse, Error, RemoveVars>
) {
  const mutation = useMutation<RemoveOnlineBillerResponse, Error, RemoveVars>({
    mutationKey: ["bbps", "multiple-bills", "remove-online-biller"],
    mutationFn: (vars) => apiRemoveOnlineBiller(vars),
    ...options,
  });

  return {
    removeBillerasync: mutation.mutateAsync, // function to call
    data: mutation.data,                // response payload
    isLoading: mutation.isPending,      // loading flag
    error: mutation.error,              // Error | null
    // optional extras
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    status: mutation.status,
  };
}

export function useAddOnlineBiller() {
  const mutation = useMutation<AddOnlineBillerResponse, unknown, AddOnlineBillerBffRequest>({
    mutationFn: apiAddOnlineBiller,
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    addOnlineBiller: mutation.mutate,
    addOnlineBillerAsync: mutation.mutateAsync,
    reset: mutation.reset,
  };
}