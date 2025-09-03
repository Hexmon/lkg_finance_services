/**
 * React Query v5 hooks for Retailer Service APIs.
 * Query keys are stable & discoverable. Each hook validates IO via Zod.
 */

import {
  useQuery,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  useMutation,
} from "@tanstack/react-query";
import {
  apiServiceList,
  apiServiceSubscriptionList,
  apiServiceSubscriptionsList,
  apiServiceSubscribe,
  apiServiceCharges,
} from "./endpoints";
import {
  ServiceListQuery,
  ServiceListResponse,
  ServiceSubscriptionListQuery,
  ServiceSubscriptionListResponse,
  SubscriptionsListQuery,
  SubscriptionsListResponse,
  ServiceSubscribeBody,
  ServiceSubscribeResponse,
  ServiceChargesBody,
  ServiceChargesResponse,
} from "../domain/types";

/** Cache keys */
const qk = {
  base: ["bbps", "retailer", "service"] as const,
  list: (params: ServiceListQuery) =>
    [...qk.base, "list", params] as QueryKey,
  subscriptionList: (params: ServiceSubscriptionListQuery) =>
    [...qk.base, "subscription-list", params] as QueryKey,
  subscriptions: (params: SubscriptionsListQuery) =>
    [...qk.base, "subscriptions", params] as QueryKey,
};

/** Helper to broadly match this module's keys */
const keyStartsWithServiceBase = (key: readonly unknown[]) =>
  Array.isArray(key) &&
  key.length >= 3 &&
  key[0] === "bbps" &&
  key[1] === "retailer" &&
  key[2] === "service";

/** ========== Queries ========== */

/**
 * GET /secure/retailer/service-list
 */
export function useServiceListQuery(
  params: ServiceListQuery = {},
  options?: Omit<
    UseQueryOptions<ServiceListResponse, Error, ServiceListResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: qk.list(params),
    queryFn: ({ signal }) => apiServiceList(params, { signal }),
    ...options,
  });
}

/**
 * GET /secure/retailer/service-subscription-list
 */
export function useServiceSubscriptionListQuery(
  params: ServiceSubscriptionListQuery,
  options?: Omit<
    UseQueryOptions<
      ServiceSubscriptionListResponse,
      Error,
      ServiceSubscriptionListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn" | "enabled"
  >
) {
  const enabled = Boolean(params?.service_name && params.service_name.length > 0);
  return useQuery({
    queryKey: qk.subscriptionList(params),
    queryFn: ({ signal }) => apiServiceSubscriptionList(params, { signal }),
    enabled,
    ...options,
  });
}

/**
 * GET /secure/retailer/subscriptions (paginated)
 */
export function useServiceSubscriptionsListQuery(
  params: SubscriptionsListQuery = {},
  options?: Omit<
    UseQueryOptions<
      SubscriptionsListResponse,
      Error,
      SubscriptionsListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: qk.subscriptions(params),
    queryFn: ({ signal }) => apiServiceSubscriptionsList(params, { signal }),
    ...options,
  });
}

/** ========== Mutations ========== */

/**
 * POST /secure/retailer/subscribe
 * Invalidate all service-related caches on success.
 */
export function useServiceSubscribeMutation() {
  const qc = useQueryClient();

  return useMutation<ServiceSubscribeResponse, Error, ServiceSubscribeBody>({
    mutationFn: (body) => apiServiceSubscribe(body),
    onSuccess: async () => {
      await qc.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "bbps" &&
          query.queryKey[1] === "retailer" &&
          query.queryKey[2] === "service",
      });
    },
  });
}

/**
 * POST /secure/retailer/service-charges (calculation)
 * No invalidation needed (non-mutating).
 */
export function useServiceChargesMutation() {
  return useMutation<ServiceChargesResponse, Error, ServiceChargesBody>({
    mutationFn: (body) => apiServiceCharges(body),
  });
}

/** ========== Aggregator helper ========== */
export function useServiceApi() {
  const qc = useQueryClient();
  const { mutateAsync: subscribe } = useServiceSubscribeMutation();
  const { mutateAsync: calculateCharges } = useServiceChargesMutation();

  return {
    /** Imperative fetch with caching for service list */
    getServiceList: (params: ServiceListQuery = {}) =>
      qc.fetchQuery({
        queryKey: qk.list(params),
        queryFn: ({ signal }) => apiServiceList(params, { signal }),
      }),

    /** Imperative fetch with caching for subscription list (by service_name) */
    getServiceSubscriptionList: (params: ServiceSubscriptionListQuery) => {
      if (!params?.service_name) {
        return Promise.reject(new Error("service_name is required"));
      }
      return qc.fetchQuery({
        queryKey: qk.subscriptionList(params),
        queryFn: ({ signal }) => apiServiceSubscriptionList(params, { signal }),
      });
    },

    /** Imperative fetch with caching for subscriptions (paginated) */
    getServiceSubscriptionsList: (params: SubscriptionsListQuery = {}) =>
      qc.fetchQuery({
        queryKey: qk.subscriptions(params),
        queryFn: ({ signal }) => apiServiceSubscriptionsList(params, { signal }),
      }),

    /** Mutations as callables */
    subscribe,
    calculateCharges,
  };
}
