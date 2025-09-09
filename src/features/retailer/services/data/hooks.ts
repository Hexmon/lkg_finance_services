// src/features/retailer/services/data/hooks.ts
'use client';

import {
  useQuery,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  useMutation,
} from '@tanstack/react-query';

import {
  apiServiceList,
  apiServiceSubscriptionList,
  apiServiceSubscriptionsList,
  apiServiceSubscribe,
  apiServiceCharges,
} from './endpoints';

import type {
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
} from '../domain/types';

/** ------------------------------------------------------------------ */
/** Cache keys (stable)                                                */
/** ------------------------------------------------------------------ */
const qk = {
  base: ['retailer', 'services'] as const,
  list: (params: ServiceListQuery) =>
    [...qk.base, 'list', params] as QueryKey,
  subscriptionList: (params: ServiceSubscriptionListQuery) =>
    [...qk.base, 'subscription-list', params] as QueryKey,
  subscriptions: (params: SubscriptionsListQuery) =>
    [...qk.base, 'subscriptions', params] as QueryKey,
};

/** Broadly match this module's keys for invalidation */
const keyStartsWithServiceBase = (key: readonly unknown[]) =>
  Array.isArray(key) &&
  key.length >= qk.base.length &&
  key.slice(0, qk.base.length).every((v, i) => v === qk.base[i]);

/** ------------------------------------------------------------------ */
/** Queries                                                            */
/** ------------------------------------------------------------------ */

/** GET /secure/retailer/service-list */
export function useServiceListQuery(
  params: ServiceListQuery = {},
  options?: Omit<
    UseQueryOptions<ServiceListResponse, Error, ServiceListResponse, QueryKey>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: qk.list(params),
    queryFn: ({ signal }) => apiServiceList(params, { signal }),
    ...options,
  });
}

/** GET /secure/retailer/service-subscription-list */
export function useServiceSubscriptionListQuery(
  params: ServiceSubscriptionListQuery,
  options?: Omit<
    UseQueryOptions<
      ServiceSubscriptionListResponse,
      Error,
      ServiceSubscriptionListResponse,
      QueryKey
    >,
    'queryKey' | 'queryFn' | 'enabled'
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

/** GET /secure/retailer/subscriptions (paginated) */
export function useServiceSubscriptionsListQuery(
  params: SubscriptionsListQuery = {},
  options?: Omit<
    UseQueryOptions<
      SubscriptionsListResponse,
      Error,
      SubscriptionsListResponse,
      QueryKey
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: qk.subscriptions(params),
    queryFn: ({ signal }) => apiServiceSubscriptionsList(params, { signal }),
    ...options,
  });
}

/** ------------------------------------------------------------------ */
/** Mutations                                                          */
/** ------------------------------------------------------------------ */

export function useServiceSubscribe() {
  const qc = useQueryClient();

  const mutation = useMutation<ServiceSubscribeResponse, unknown, ServiceSubscribeBody>({
    mutationFn: apiServiceSubscribe,
    onSuccess: async () => {
      await qc.invalidateQueries({
        predicate: (q) => keyStartsWithServiceBase(q.queryKey),
      });
      await qc.invalidateQueries({ queryKey: ['retailer', 'dashboard'] });
    },
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    subscribe: mutation.mutate,
    subscribeAsync: mutation.mutateAsync, // <-- expose async variant
  };
}

/**
 * POST /secure/retailer/service-charges
 * Returns { data, calculateCharges, error, isLoading }
 * This is a pure calculation; no cache invalidation required.
 */
export function useServiceCharges() {
  const mutation = useMutation<ServiceChargesResponse, Error, ServiceChargesBody>({
    mutationFn: (body) => apiServiceCharges(body),
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    calculateCharges: mutation.mutate,
  };
}

/** ------------------------------------------------------------------ */
/** Optional: imperative aggregator                                    */
/** ------------------------------------------------------------------ */
export function useServiceApi() {
  const qc = useQueryClient();

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
        return Promise.reject(new Error('service_name is required'));
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
  };
}
