import { retailerRequest, getTenantId } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/data/client";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import {
  BillPaymentRequestSchema,
  BillPaymentResponseSchema,
  TxnStatusRequestSchema,
  TxnStatusResponseSchema,
  ComplaintRegisterRequestSchema,
  ComplaintRegisterResponseSchema,
  ComplaintTrackRequestSchema,
  ComplaintTrackResponseSchema,
  BillValidationRequestSchema,
  BillValidationResponseSchema,
  AllPlansResponseSchema,
  type BillPaymentRequest,
  type BillPaymentResponse,
  type TxnStatusRequest,
  type TxnStatusResponse,
  type ComplaintRegisterRequest,
  type ComplaintRegisterResponse,
  type ComplaintTrackRequest,
  type ComplaintTrackResponse,
  type BillValidationRequest,
  type BillValidationResponse,
  type AllPlansResponse,
} from "../domain/types";

function pathWithTenant(basePath: string, extra?: string) {
  const tenantId = getTenantId();
  if (extra && extra.length > 0) return `${basePath}/${tenantId}/${extra}`;
  return `${basePath}/${tenantId}`;
}

/** POST /secure/bbps/bills/bill-payment/{tenantId} */
export async function apiBillPayment(body: BillPaymentRequest): Promise<BillPaymentResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.BILL_PAYMENT);
  const validated = BillPaymentRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(path, "POST", validated, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return BillPaymentResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/txn-status/{tenantId}   (header: apiurl) */
export async function apiTxnStatus(body: TxnStatusRequest): Promise<TxnStatusResponse> {
  const path = pathWithTenant(RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.TXN_STATUS);
  const validated = TxnStatusRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(
    path,
    "POST",
    validated,
    { headers: { apiurl: "/transactionStatus/fetchInfo/xml" } },
    { includeApiKey: true, includeAuth: true },
  );
  return TxnStatusResponseSchema.parse(raw);
}

/** POST /secure/bbps/bills/complaint-Reg/{tenantId} (header: apiurl) */
export async function apiComplaintRegister(
  body: ComplaintRegisterRequest,
): Promise<ComplaintRegisterResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.COMPLAINT_REGISTER,
  );
  const validated = ComplaintRegisterRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(
    path,
    "POST",
    validated,
    { headers: { apiurl: "/extComplaints/register/json" } },
    { includeApiKey: true, includeAuth: true },
  );
  return ComplaintRegisterResponseSchema.parse(raw);
}

/** Complaint Tracking
 * Docs show GET, examples provide body. We follow provider pattern: POST with header.
 * /secure/bbps/bills/track-complaint/{tenantId} (header: apiurl)
 */
export async function apiComplaintTrack(
  body: ComplaintTrackRequest,
): Promise<ComplaintTrackResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.TRACK_COMPLAINT,
  );
  const validated = ComplaintTrackRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(
    path,
    "POST",
    validated,
    { headers: { apiurl: "/extComplaints/track/json" } },
    { includeApiKey: true, includeAuth: true },
  );
  return ComplaintTrackResponseSchema.parse(raw);
}

/** Bill Validation
 * POST /secure/bbps/billavenue/bill-validation/{tenantId} (header: apiurl)
 * Auth: API Key (we include Bearer if available; harmless for UAT)
 */
export async function apiBillValidation(
  body: BillValidationRequest,
): Promise<BillValidationResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.BILL_VALIDATION,
  );
  const validated = BillValidationRequestSchema.parse(body);
  const raw = await retailerRequest<unknown>(
    path,
    "POST",
    validated,
    { headers: { apiurl: "/extBillValCntrl/billValidationRequest/json" } },
    { includeApiKey: true, includeAuth: true },
  );
  return BillValidationResponseSchema.parse(raw);
}

/** All Plans (Plan Pull)
 * GET /secure/bbps/bills/all-plans/{tenantId}/{billerId}
 */
export async function apiAllPlans(billerId: string): Promise<AllPlansResponse> {
  const path = pathWithTenant(
    RETAILER_ENDPOINTS.RETAILER_BBPS.BBPS_ONLINE.BILL_AVENUE.ALL_PLANS,
    encodeURIComponent(billerId),
  );
  const raw = await retailerRequest<unknown>(path, "GET", undefined, undefined, {
    includeApiKey: true,
    includeAuth: true,
  });
  return AllPlansResponseSchema.parse(raw);
}
