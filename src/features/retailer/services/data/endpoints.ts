// src\features\retailer\services\data\endpoints.ts
import { RETAILER_ENDPOINTS } from "@/config/endpoints";

import {
  ServiceListQuerySchema,
  ServiceListQuery,
  ServiceListResponseSchema,
  ServiceListResponse,
  ServiceSubscriptionListQuerySchema,
  ServiceSubscriptionListQuery,
  ServiceSubscriptionListResponseSchema,
  ServiceSubscriptionListResponse,
  SubscriptionsListQuerySchema,
  SubscriptionsListQuery,
  SubscriptionsListResponseSchema,
  SubscriptionsListResponse,
  ServiceSubscribeBodySchema,
  ServiceSubscribeBody,
  ServiceSubscribeResponseSchema,
  ServiceSubscribeResponse,
  ServiceChargesBodySchema,
  ServiceChargesBody,
  ServiceChargesResponseSchema,
  ServiceChargesResponse,
} from "../domain/types";
import { retailerRequest } from "../../client";
import { getJSON } from "@/lib/api/client";

/** Paths (const string paths only) */
const SERVICE_LIST_PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_LIST;
const SERVICE_SUBSCRIPTION_LIST_PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_SUBSCRIPTION_LIST;
const SUBSCRIPTIONS_LIST_PATH = RETAILER_ENDPOINTS.SERVICE.SUBSCRIPTIONS;
const SERVICE_SUBSCRIBE_PATH = RETAILER_ENDPOINTS.SERVICE.SUBSCRIBE;
const SERVICE_CHARGES_PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_CHARGES;

/**
 * GET /secure/retailer/service-list
 */
export async function apiServiceList(
  input: ServiceListQuery = {},
  opts?: { signal?: AbortSignal }
): Promise<ServiceListResponse> {
  const params = ServiceListQuerySchema.parse(input);

  const res = await retailerRequest<ServiceListResponse>({
    method: "GET",
    path: SERVICE_LIST_PATH,
    query: params,
    headers: {},
    auth: true,
    apiKey: false,
    signal: opts?.signal,
  });

  return ServiceListResponseSchema.parse(res);
}

export async function apiServiceSubscriptionList(
  input: ServiceSubscriptionListQuery,
  opts?: { signal?: AbortSignal }
): Promise<ServiceSubscriptionListResponse> {
  const params = ServiceSubscriptionListQuerySchema.parse(input);
  const qs = new URLSearchParams({ service_name: params.service_name }).toString();

  // ✅ correct BFF path + real query string
  const raw = await getJSON<ServiceSubscriptionListResponse>(
    `retailer/service/service-subscription-list?${qs}`,
    { signal: opts?.signal }
  );

  return ServiceSubscriptionListResponseSchema.parse(raw);
}


/**
 * GET /secure/retailer/subscriptions
 * Paginated list of retailer subscriptions.
 */
export async function apiServiceSubscriptionsList(
  input: SubscriptionsListQuery = {},
  opts?: { signal?: AbortSignal }
): Promise<SubscriptionsListResponse> {
  const params = SubscriptionsListQuerySchema.parse(input);

  const res = await retailerRequest<SubscriptionsListResponse>({
    method: "GET",
    path: SUBSCRIPTIONS_LIST_PATH,
    query: params,
    headers: {},
    auth: true,
    apiKey: false,
    signal: opts?.signal,
  });

  return SubscriptionsListResponseSchema.parse(res);
}

/**
 * POST /secure/retailer/subscribe
 * Creates/updates retailer subscription for a service.
 * Note: If already subscribed, server responds 409; the shared client throws ApiError.
 */
export async function apiServiceSubscribe(
  body: ServiceSubscribeBody,
  opts?: { signal?: AbortSignal }
): Promise<ServiceSubscribeResponse> {
  const payload = ServiceSubscribeBodySchema.parse(body);

  const res = await retailerRequest<ServiceSubscribeResponse>({
    method: "POST",
    path: SERVICE_SUBSCRIBE_PATH,
    body: payload,
    headers: {}, // JSON content-type is auto-set by client
    auth: true,
    apiKey: false,
    signal: opts?.signal,
  });

  return ServiceSubscribeResponseSchema.parse(res);
}

/**
 * POST /secure/retailer/service-charges
 * Calculation-only endpoint (does not mutate server state)
 */
export async function apiServiceCharges(
  body: ServiceChargesBody,
  opts?: { signal?: AbortSignal }
): Promise<ServiceChargesResponse> {
  const payload = ServiceChargesBodySchema.parse(body);

  const res = await retailerRequest<ServiceChargesResponse>({
    method: "POST",
    path: SERVICE_CHARGES_PATH,
    body: payload,
    headers: {}, // JSON content-type is auto-set by client
    auth: true,
    apiKey: false,
    signal: opts?.signal,
  });

  return ServiceChargesResponseSchema.parse(res);
}
