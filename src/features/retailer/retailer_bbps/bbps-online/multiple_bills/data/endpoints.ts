import { deleteJSON, getJSON, postJSON } from "@/lib/api/client";
import { AddOnlineBillerBffRequest, AddOnlineBillerBffRequestSchema, AddOnlineBillerRequest, AddOnlineBillerRequestSchema, AddOnlineBillerResponse, AddOnlineBillerResponseSchema, OnlineBillerListQuery, OnlineBillerListResponse, OnlineBillerListResponseSchema, OnlineBillProceedRequest, OnlineBillProceedRequestSchema, OnlineBillProceedResponse, OnlineBillProceedResponseSchema, RemoveOnlineBillerResponse, RemoveOnlineBillerResponseSchema } from "../domain/types";

/**
 * GET /api/v1/retailer/bbps/bbps-online/multiple-bills/online-biller-list/[service_id]
 * (Call via BFF so HttpOnly cookie is sent automatically)
 */
export async function apiGetOnlineBillerList(
  params: {
    service_id: string;
    per_page?: number | string;
    page?: number | string;
    order?: "asc" | "desc";
    sort_by?: string; // e.g. 'created_at'
  },
  opts?: { signal?: AbortSignal }
): Promise<OnlineBillerListResponse> {
  if (!params?.service_id) throw new Error("service_id is required");

  const qp = new URLSearchParams({
    per_page: String(params.per_page ?? 10),
    page: String(params.page ?? 1),
    order: String(params.order ?? "desc"),
    sort_by: String(params.sort_by ?? "created_at"),
  }).toString();

  const raw = await getJSON<OnlineBillerListResponse>(
    `/retailer/bbps/bbps-online/multiple-bills/online-biller-list/${encodeURIComponent(
      params.service_id
    )}?${qp}`,
    { signal: opts?.signal }
  );

  return OnlineBillerListResponseSchema.parse(raw);
}


/**
 * DELETE /api/v1/retailer/bbps/bbps-online/multiple-bills/remove-online-biller/[biller_batch_id]
 * Calls the BFF so HttpOnly cookie is sent automatically.
 */
// export async function apiRemoveOnlineBiller(
//   params: { biller_batch_id: string },
//   opts?: { signal?: AbortSignal }
// ): Promise<RemoveOnlineBillerResponse> {
//   if (!params?.biller_batch_id) {
//     throw new Error("biller_batch_id is required");
//   }

//   const url = `/retailer/bbps/bbps-online/multiple-bills/remove-online-biller/${encodeURIComponent(
//     params.biller_batch_id
//   )}`;

//   const res = await fetch(url, {
//     method: "DELETE",
//     credentials: "include", // send cookies
//     headers: { Accept: "application/json" },
//     cache: "no-store",
//     signal: opts?.signal,
//   });

//   // try to parse JSON response either way
//   const body = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const msg = body?.error?.message || body?.message || `Remove biller failed (HTTP ${res.status})`;
//     const err = new Error(msg) as Error & { status?: number; data?: unknown };
//     err.status = res.status;
//     err.data = body;
//     throw err;
//   }

//   return RemoveOnlineBillerResponseSchema.parse(body);
// }
export async function apiRemoveOnlineBiller(
  params: { biller_batch_id: string, service_id: string },
  opts?: { signal?: AbortSignal }
): Promise<RemoveOnlineBillerResponse> {
  if (!params?.biller_batch_id) throw new Error("biller_batch_id is required");

  const path = `retailer/bbps/bbps-online/multiple-bills/remove-online-biller/${encodeURIComponent(params.service_id)}/${encodeURIComponent(params.biller_batch_id)}`;

  const raw = await deleteJSON<RemoveOnlineBillerResponse>(path, undefined, { signal: opts?.signal });
  return RemoveOnlineBillerResponseSchema.parse(raw);
}

/**
 * POST /api/v1/retailer/bbps/bbps-online/multiple-bills/online-bill-proceed/[service_id]
 * Calls the BFF so HttpOnly cookie is sent automatically.
 */
export async function apiOnlineBillProceed(
  params: { service_id: string } & OnlineBillProceedRequest,
  opts?: { signal?: AbortSignal }
): Promise<OnlineBillProceedResponse> {
  if (!params?.service_id) throw new Error("service_id is required");

  const body = OnlineBillProceedRequestSchema.parse({ batch_id: params.batch_id });

  const path = `retailer/bbps/bbps-online/multiple-bills/online-bill-proceed/${encodeURIComponent(params.service_id)}`;

  const json = await postJSON<OnlineBillProceedResponse>(path, body, { signal: opts?.signal });
  return OnlineBillProceedResponseSchema.parse(json);
}


const ADD_ONLINE_BILLER_PATH = '/retailer/bbps/bbps-online/multiple-bills/add-online-biller';

export async function apiAddOnlineBiller(
  body: AddOnlineBillerBffRequest
): Promise<AddOnlineBillerResponse> {
  // Validate on the client as well (helps during dev)
  const payload = AddOnlineBillerBffRequestSchema.parse(body);

  const res = await postJSON<unknown>(ADD_ONLINE_BILLER_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AddOnlineBillerResponseSchema.parse(res);
}

export type { OnlineBillProceedResponse, OnlineBillProceedRequest, RemoveOnlineBillerResponse };
