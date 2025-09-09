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
import { getJSON, postJSON } from "@/lib/api/client";

/** Paths (const string paths only) */
const SERVICE_LIST_PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_LIST;
const SUBSCRIPTIONS_LIST_PATH = RETAILER_ENDPOINTS.SERVICE.SUBSCRIPTIONS;
const SERVICE_CHARGES_PATH = RETAILER_ENDPOINTS.SERVICE.SERVICE_CHARGES;

const p = {
  subscribe: '/retailer/service/subscribe',
}

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

export async function apiServiceSubscribe(
  payload: ServiceSubscribeBody
): Promise<ServiceSubscribeResponse> {
  const body = ServiceSubscribeBodySchema.parse(payload);
  const data = await postJSON<ServiceSubscribeResponse>(p.subscribe, body, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return ServiceSubscribeResponseSchema.parse(data);
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
