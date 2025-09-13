// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\data\endpoints.ts
import {
  CategoryListResponseSchema,
  BillerListResponseSchema,
  BillFetchRequestSchema,
  BillFetchResponseSchema,
  type CategoryListResponse,
  type BillerListResponse,
  type BillFetchRequest,
  type BillFetchResponse,
  PlanPullResponse,
  PlanPullResponseSchema,
} from "../domain/types";
import { getJSON, postJSON } from "@/lib/api/client";

/** GET /secure/bbps/bbps-category-list/{tenantId}?mode= */
export async function apiGetCategoryList(
  params: { service_id: string; mode: 'ONLINE' | 'OFFLINE' },
  opts?: { signal?: AbortSignal }
): Promise<CategoryListResponse> {
  if (!params?.service_id) {
    throw new Error('service_id is required');
  }
  const qs = new URLSearchParams({ mode: params.mode }).toString();

  // Call your BFF route (server reads bt_auth cookie and forwards upstream)
  const raw = await getJSON<CategoryListResponse>(
    `retailer/bbps/bbps-online/bill-fetch/category-list/${encodeURIComponent(params.service_id)}?${qs}`,
    { signal: opts?.signal }
  );

  return CategoryListResponseSchema.parse(raw);
}

/**
 * GET /secure/bbps/biller-list/{service_id}/{bbps_category_id}?is_offline=&mode=&opr_id=&is_active=  (via BFF)
 * NOTE: This matches your server route:
 *   /api/v1/retailer/bbps/bbps-online/bill-fetch/biller-list/[service_id]/[bbps_category_id]
 */
export async function apiGetBillerList(
  params: {
    service_id: string;
    bbps_category_id: string;
    is_offline: boolean;
    mode: "ONLINE" | "OFFLINE";
    opr_id?: string;
    is_active?: string; // keep string to mirror upstream flexibility
  },
  opts?: { signal?: AbortSignal }
): Promise<BillerListResponse> {
  if (!params?.service_id) throw new Error("service_id is required");
  if (!params?.bbps_category_id) throw new Error("bbps_category_id is required");

  const qs = new URLSearchParams({
    is_offline: String(params.is_offline ?? false),
    mode: params.mode,
    ...(params.opr_id ? { opr_id: params.opr_id } : {}),
    ...(params.is_active ? { is_active: params.is_active } : {}),
  }).toString();

  // Hit the BFF route; server will read bt_auth and forward to BBPS base
  const path = `retailer/bbps/bbps-online/bill-fetch/biller-list/${encodeURIComponent(
    params.service_id
  )}/${encodeURIComponent(params.bbps_category_id)}?${qs}`;

  const raw = await getJSON<BillerListResponse>(path, { signal: opts?.signal });
  return BillerListResponseSchema.parse(raw);
}

/**
 * GET (BFF) → /api/v1/retailer/bbps/bbps-online/bill-fetch/plan-pull/[service_id]/[billerId]?mode=ONLINE
 * Proxies upstream: /secure/bbps/bills/all-plans/{service_id}/{billerId}?mode=ONLINE
 */
export async function apiGetPlanPull(
  params: { service_id: string; billerId: string; mode: "ONLINE" | "OFFLINE" },
  opts?: { signal?: AbortSignal }
): Promise<PlanPullResponse> {
  if (!params?.service_id) throw new Error("service_id is required");
  if (!params?.billerId) throw new Error("billerId is required");

  const qs = new URLSearchParams({ mode: params.mode }).toString();

  // NOTE: getJSON prefixes /api/v1, so we keep this relative path without a leading slash.
  const path = `retailer/bbps/bbps-online/bill-fetch/all-plans/${encodeURIComponent(
    params.service_id
  )}/${encodeURIComponent(params.billerId)}?${qs}`;

  const raw = await getJSON<PlanPullResponse>(path, { signal: opts?.signal });
  return PlanPullResponseSchema.parse(raw);
}

/**
 * POST (BFF) → /retailer/bbps/bbps-online/bill-fetch/bill-fetch/[service_id]?mode=
 * Proxies upstream: /secure/bbps/bills/bill-fetch/{service_id}?mode=
 */
export async function apiPostBillFetch(
  params: {
    service_id: string;
    mode: "ONLINE" | "OFFLINE";
    body: BillFetchRequest;
  },
  opts?: { signal?: AbortSignal }
): Promise<BillFetchResponse> {
  if (!params?.service_id) throw new Error("service_id is required");

  // Early validate request (BFF also validates)
  const validated = BillFetchRequestSchema.parse(params.body);

  const qs = new URLSearchParams({ mode: params.mode }).toString();
  const path = `retailer/bbps/bbps-online/bill-fetch/biller-fetch/${encodeURIComponent(
    params.service_id
  )}?${qs}`;

  const raw = await postJSON<BillFetchResponse>(path, validated, { signal: opts?.signal });
  return BillFetchResponseSchema.parse(raw);
}