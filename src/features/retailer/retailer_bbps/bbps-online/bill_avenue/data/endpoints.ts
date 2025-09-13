// src/features/retailer/retailer_bbps/bbps-online/bill_avenue/data/endpoints.ts
import {
  BillPaymentRequest,
  BillPaymentRequestSchema,
  BillPaymentResponse,
  BillPaymentResponseSchema,
  TxnStatusRequest,
  TxnStatusRequestSchema,
  TxnStatusResponse,
  TxnStatusResponseSchema,
} from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue/domain/types";
import { postJSON } from "@/lib/api/client";
/**
 * POST /api/v1/retailer/bbps/bills/bill-payment/:service_id
 * Validates both request and response with zod.
 */
export async function apiBillPayment(
  params: { service_id: string },
  body: BillPaymentRequest,
  init?: RequestInit
): Promise<BillPaymentResponse> {
  if (!params?.service_id) throw new Error("service_id is required");

  // Validate outbound payload
  const payload = BillPaymentRequestSchema.parse(body);

  const url = `/api/v1/retailer/bbps/bills/bill-payment/${params.service_id}`;
  const raw = await postJSON<unknown>(url, payload, init);

  // Validate inbound response (accept union variants)
  return BillPaymentResponseSchema.parse(raw);
}

/**
 * (Optional) POST /api/v1/retailer/bbps/bills/txn-status/:service_id
 * If you implement this BFF route, this function is ready to call it.
 */
export async function apiTxnStatus(
  params: { service_id: string },
  body: TxnStatusRequest,
  init?: RequestInit
): Promise<TxnStatusResponse> {
  if (!params?.service_id) throw new Error("service_id is required");

  const payload = TxnStatusRequestSchema.parse(body);

  const url = `/api/v1/retailer/bbps/bills/txn-status/${params.service_id}`;
  const raw = await postJSON<unknown>(url, payload, init);

  return TxnStatusResponseSchema.parse(raw);
}
