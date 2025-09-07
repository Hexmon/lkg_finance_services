import { getJSON } from "@/lib/api/client";
import { OnlineBillerListQuery, OnlineBillerListResponse, OnlineBillerListResponseSchema, OnlineBillProceedRequest, OnlineBillProceedRequestSchema, OnlineBillProceedResponse, OnlineBillProceedResponseSchema, RemoveOnlineBillerResponse, RemoveOnlineBillerResponseSchema } from "../domain/types";

/**
 * GET /api/v1/retailer/bbps/bbps-online/multiple-bills/online-biller-list/[service_id]
 * (Call via BFF so HttpOnly cookie is sent automatically)
 */
export async function apiGetOnlineBillerList(
  params: { service_id: string } & Partial<OnlineBillerListQuery>,
  opts?: { signal?: AbortSignal }
): Promise<OnlineBillerListResponse> {
  if (!params?.service_id) {
    throw new Error("service_id is required");
  }

  // Only include known query keys
  const sp = new URLSearchParams();
  if (params.per_page !== undefined) sp.set("per_page", String(params.per_page));
  if (params.page !== undefined) sp.set("page", String(params.page));
  if (params.order !== undefined) sp.set("order", String(params.order));
  if (params.sort_by !== undefined) sp.set("sort_by", String(params.sort_by));
  if (params.status !== undefined) sp.set("status", String(params.status));
  if (params.is_active !== undefined) sp.set("is_active", String(params.is_active));
  if (params.is_direct !== undefined) sp.set("is_direct", String(params.is_direct));

  const qs = sp.toString();

  // Call your BFF route (server reads bt_auth cookie and forwards upstream)
  const raw = await getJSON<OnlineBillerListResponse>(
    `retailer/bbps/bbps-online/multiple-bills/online-biller-list/${encodeURIComponent(
      params.service_id
    )}${qs ? `?${qs}` : ""}`,
    { signal: opts?.signal }
  );

  return OnlineBillerListResponseSchema.parse(raw);
}

/**
 * DELETE /api/v1/retailer/bbps/bbps-online/multiple-bills/remove-online-biller/[biller_batch_id]
 * Calls the BFF so HttpOnly cookie is sent automatically.
 */
export async function apiRemoveOnlineBiller(
  params: { biller_batch_id: string },
  opts?: { signal?: AbortSignal }
): Promise<RemoveOnlineBillerResponse> {
  if (!params?.biller_batch_id) {
    throw new Error("biller_batch_id is required");
  }

  const url = `retailer/bbps/bbps-online/multiple-bills/remove-online-biller/${encodeURIComponent(
    params.biller_batch_id
  )}`;

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include", // send cookies
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: opts?.signal,
  });

  // try to parse JSON response either way
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = body?.error?.message || body?.message || `Remove biller failed (HTTP ${res.status})`;
    const err = new Error(msg) as Error & { status?: number; data?: unknown };
    err.status = res.status;
    err.data = body;
    throw err;
  }

  return RemoveOnlineBillerResponseSchema.parse(body);
}

/**
 * POST /api/v1/retailer/bbps/bbps-online/multiple-bills/online-bill-proceed/[service_id]
 * Calls the BFF so HttpOnly cookie is sent automatically.
 */
export async function apiOnlineBillProceed(
  params: { service_id: string } & OnlineBillProceedRequest,
  opts?: { signal?: AbortSignal }
): Promise<OnlineBillProceedResponse> {
  if (!params?.service_id) {
    throw new Error("service_id is required");
  }

  // Validate client payload early (optional but keeps UI honest)
  const body = OnlineBillProceedRequestSchema.parse({ batch_id: params.batch_id });

  const url = `retailer/bbps/bbps-online/multiple-bills/online-bill-proceed/${encodeURIComponent(
    params.service_id
  )}`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include", // send cookies
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: opts?.signal,
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `Online bill proceed failed (HTTP ${res.status})`;
    const err = new Error(msg) as Error & { status?: number; data?: unknown };
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return OnlineBillProceedResponseSchema.parse(json);
}

export type { OnlineBillProceedResponse, OnlineBillProceedRequest, RemoveOnlineBillerResponse };
