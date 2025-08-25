import { retailerRequest, getTenantId } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/data/client";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import {
  AddOnlineBillerRequestSchema,
  AddOnlineBillerResponseSchema,
  OnlineBillerListQuerySchema,
  OnlineBillerListResponseSchema,
  UpdateOnlineBillerRequestSchema,
  UpdateOnlineBillerResponseSchema,
  RemoveOnlineBillerResponseSchema,
  OnlineBillProceedRequestSchema,
  OnlineBillProceedResponseSchema,
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

function pathWithTenant(basePath: string) {
  const tenantId = getTenantId();
  return `${basePath}/${tenantId}`;
}

/** POST /secure/bbps/add-online-biller/{tenantId} */
export async function apiAddOnlineBiller(
  body: AddOnlineBillerRequest,
): Promise<AddOnlineBillerResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ADD_ONLINE_BILLER);
  const validated = AddOnlineBillerRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>(path, "POST", validated, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return AddOnlineBillerResponseSchema.parse(raw);
}

/** GET /secure/bbps/online-biller-list/{tenantId}?... */
export async function apiGetOnlineBillerList(
  query: OnlineBillerListQuery,
): Promise<OnlineBillerListResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ONLINE_BILLER_LIST);
  const validated = OnlineBillerListQuerySchema.parse(query);

  const raw = await retailerRequest<unknown>(path, "GET", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
    query: validated as Record<string, string | number | boolean | undefined>,
  });
  return OnlineBillerListResponseSchema.parse(raw);
}

/** PATCH /secure/bbps/update-online-biller/{biller_batch_id}  (no tenant in path) */
export async function apiUpdateOnlineBiller(
  biller_batch_id: string,
  body: UpdateOnlineBillerRequest,
): Promise<UpdateOnlineBillerResponse> {
  const base = RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.UPDATE_ONLINE_BILLER;
  const path = `${base}/${encodeURIComponent(biller_batch_id)}`;
  const validated = UpdateOnlineBillerRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>(path, "PATCH", validated, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return UpdateOnlineBillerResponseSchema.parse(raw);
}

/** DELETE /secure/bbps/remove-online-biller/{biller_batch_id}  (no tenant in path) */
export async function apiRemoveOnlineBiller(biller_batch_id: string): Promise<RemoveOnlineBillerResponse> {
  const base = RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.REMOVE_ONLINE_BILLER;
  const path = `${base}/${encodeURIComponent(biller_batch_id)}`;

  const raw = await retailerRequest<unknown>(path, "DELETE", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return RemoveOnlineBillerResponseSchema.parse(raw);
}

/** POST /secure/bbps/online-bill-proceed/{tenantId} */
export async function apiOnlineBillProceed(
  body: OnlineBillProceedRequest,
): Promise<OnlineBillProceedResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.MULTIPLE_BILLS.ONLINE_BILL_PROCEED);
  const validated = OnlineBillProceedRequestSchema.parse(body);

  const raw = await retailerRequest<unknown>(path, "POST", validated, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return OnlineBillProceedResponseSchema.parse(raw);
}
