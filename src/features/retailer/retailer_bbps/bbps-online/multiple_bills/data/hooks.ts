import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
  apiAddOnlineBiller,
  apiGetOnlineBillerList,
  apiUpdateOnlineBiller,
  apiRemoveOnlineBiller,
  apiOnlineBillProceed,
} from "./endpoints";
import {
  type AddOnlineBillerRequest,
  type AddOnlineBillerResponse,
  type OnlineBillerListQuery,
  type OnlineBillerListResponse,
  type UpdateOnlineBillerRequest,
  type UpdateOnlineBillerResponse,
  type RemoveOnlineBillerResponse,
  type OnlineBillProceedRequest,
  type OnlineBillProceedResponse,
} from "../domain/types";

/** -------- Add Online Biller (mutation) -------- */
export function useAddOnlineBillerMutation() {
  const qc = useQueryClient();
  return useMutation<AddOnlineBillerResponse, unknown, AddOnlineBillerRequest>({
    mutationKey: ["bbps", "multiple-bills", "add-online-biller"],
    mutationFn: (body) => apiAddOnlineBiller(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] });
    },
  });
}

/** -------- Online Biller List (query) -------- */
export function useOnlineBillerListQuery(
  params: OnlineBillerListQuery,
  opt?: {
    query?: Omit<
      UseQueryOptions<OnlineBillerListResponse, unknown, OnlineBillerListResponse, unknown[]>,
      "queryKey" | "queryFn"
    >;
  },
) {
  return useQuery({
    queryKey: [
      "bbps",
      "multiple-bills",
      "online-biller-list",
      params.per_page ?? 10,
      params.page ?? 1,
      params.order ?? "desc",
      params.sort_by ?? "created_at",
      params.status ?? "INITIATED",
      params.is_active ?? true,
      params.is_direct ?? false,
    ],
    queryFn: () => apiGetOnlineBillerList(params),
    enabled: opt?.query?.enabled ?? true,
    ...(opt?.query ?? {}),
  });
}

/** -------- Update Online Biller (mutation) -------- */
export function useUpdateOnlineBillerMutation() {
  const qc = useQueryClient();
  return useMutation<
    UpdateOnlineBillerResponse,
    unknown,
    { biller_batch_id: string; body: UpdateOnlineBillerRequest }
  >({
    mutationKey: ["bbps", "multiple-bills", "update-online-biller"],
    mutationFn: ({ biller_batch_id, body }) => apiUpdateOnlineBiller(biller_batch_id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] });
    },
  });
}

/** -------- Remove Online Biller (mutation) -------- */
export function useRemoveOnlineBillerMutation() {
  const qc = useQueryClient();
  return useMutation<RemoveOnlineBillerResponse, unknown, { biller_batch_id: string }>({
    mutationKey: ["bbps", "multiple-bills", "remove-online-biller"],
    mutationFn: ({ biller_batch_id }) => apiRemoveOnlineBiller(biller_batch_id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] });
    },
  });
}

/** -------- Online Bill Proceed (mutation) -------- */
export function useOnlineBillProceedMutation() {
  const qc = useQueryClient();
  return useMutation<OnlineBillProceedResponse, unknown, OnlineBillProceedRequest>({
    mutationKey: ["bbps", "multiple-bills", "online-bill-proceed"],
    mutationFn: (body) => apiOnlineBillProceed(body),
    onSuccess: () => {
      // If proceeding affects list status, refresh it
      qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] });
    },
  });
}

/** -------- Aggregator: function-call style -------- */
export function useMultipleBillsApi() {
  const qc = useQueryClient();

  const getOnlineBillerList = useCallback(
    (params: OnlineBillerListQuery) =>
      qc.fetchQuery({
        queryKey: [
          "bbps",
          "multiple-bills",
          "online-biller-list",
          params.per_page ?? 10,
          params.page ?? 1,
          params.order ?? "desc",
          params.sort_by ?? "created_at",
          params.status ?? "INITIATED",
          params.is_active ?? true,
          params.is_direct ?? false,
        ],
        queryFn: () => apiGetOnlineBillerList(params),
      }),
    [qc],
  );

  const addOnlineBillerMut = useMutation<AddOnlineBillerResponse, unknown, AddOnlineBillerRequest>({
    mutationKey: ["bbps", "multiple-bills", "add-online-biller"],
    mutationFn: apiAddOnlineBiller,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] }),
  });

  const updateOnlineBillerMut = useMutation<
    UpdateOnlineBillerResponse,
    unknown,
    { biller_batch_id: string; body: UpdateOnlineBillerRequest }
  >({
    mutationKey: ["bbps", "multiple-bills", "update-online-biller"],
    mutationFn: ({ biller_batch_id, body }) => apiUpdateOnlineBiller(biller_batch_id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] }),
  });

  const removeOnlineBillerMut = useMutation<RemoveOnlineBillerResponse, unknown, { biller_batch_id: string }>({
    mutationKey: ["bbps", "multiple-bills", "remove-online-biller"],
    mutationFn: ({ biller_batch_id }) => apiRemoveOnlineBiller(biller_batch_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] }),
  });

  const onlineBillProceedMut = useMutation<OnlineBillProceedResponse, unknown, OnlineBillProceedRequest>({
    mutationKey: ["bbps", "multiple-bills", "online-bill-proceed"],
    mutationFn: apiOnlineBillProceed,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bbps", "multiple-bills", "online-biller-list"] }),
  });

  return {
    // Queries
    getOnlineBillerList,

    // Mutations as async functions
    addOnlineBiller: addOnlineBillerMut.mutateAsync,
    updateOnlineBiller: updateOnlineBillerMut.mutateAsync,
    removeOnlineBiller: removeOnlineBillerMut.mutateAsync,
    onlineBillProceed: onlineBillProceedMut.mutateAsync,

    // Optional status objects
    addOnlineBillerStatus: addOnlineBillerMut,
    updateOnlineBillerStatus: updateOnlineBillerMut,
    removeOnlineBillerStatus: removeOnlineBillerMut,
    onlineBillProceedStatus: onlineBillProceedMut,
  };
}
