// src/features/retailer/retailer_bbps/bbps-online/bill_avenue/data/endpoints.ts
import {
  BillPaymentPathParamsSchema,
  BillPaymentRequest,
  BillPaymentRequestSchema,
  BillPaymentResponse,
  BillPaymentResponseSchema,
  PaymentInfoSchema,
  PaymentMethodSchema,
  TxnStatusRequest,
  TxnStatusRequestSchema,
  TxnStatusResponse,
  TxnStatusResponseSchema,
} from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue/domain/types";
import { postJSON } from "@/lib/api/client";

function normalizePaymentInfo(pi?: BillPaymentRequest["paymentInfo"]): { info: { infoName: string; infoValue: string } } | undefined {
  if (!pi) return undefined;
  const parsed = PaymentInfoSchema.safeParse(pi);
  if (!parsed.success) return undefined;
  if ("info" in parsed.data) return parsed.data as { info: { infoName: string; infoValue: string } };
  return { info: { infoName: (parsed.data as any).infoName, infoValue: (parsed.data as any).infoValue } };
}

function preprocessBillPayment(body: BillPaymentRequest): BillPaymentRequest {
  // Validate basics early (will throw with Zod details if wrong)
  BillPaymentRequestSchema.parse(body);

  // 1) INR only
  if (body.amountInfo.currency !== "356") {
    throw new Error(`amountInfo.currency must be '356' (INR)`);
  }

  // 2) amount checks (paise string -> rupees for comparison)
  const amountPaise = Number(body.amountInfo.amount);
  if (!Number.isFinite(amountPaise) || amountPaise < 0) {
    throw new Error(`amountInfo.amount must be a non-negative digits string (paise)`);
  }
  const amountRupees = amountPaise / 100;

  // 3) quickPay vs billerResponse
  const quickPay = PaymentMethodSchema.parse(body.paymentMethod).quickPay; // validates Y/N
  if (quickPay === "N" && !body.billerResponse) {
    throw new Error(`billerResponse is required when paymentMethod.quickPay === 'N' (presentment flow)`);
  }

  // 4) PAN required if > 49,999 INR
  if (amountRupees > 49999 && !body.customerInfo.customerPan) {
    throw new Error(`customerInfo.customerPan is required for transactions above ₹49,999`);
  }

  // 5) Normalize/auto-fill paymentInfo
  let normalizedPaymentInfo = normalizePaymentInfo(body.paymentInfo);
  if (!normalizedPaymentInfo) {
    normalizedPaymentInfo =
      amountRupees > 50000
        ? { info: { infoName: "Payment Account Info", infoValue: "Cash" } }
        : { info: { infoName: "Remarks", infoValue: "Received" } };
  }

  return {
    ...body,
    paymentInfo: normalizedPaymentInfo,
  };
}

/**
 * POST /api/v1/retailer/bbps/bills/bill-payment/:service_id
 * Validates both request and response with zod.
 */
const BILL_PAYMENT_BASE =
  '/retailer/bbps/bbps-online/bill-avenue/bill-payment';

export async function apiBillPayment(
  service_id: string,
  body: BillPaymentRequest
): Promise<unknown> {
  // Validate inputs
  BillPaymentPathParamsSchema.parse({ service_id });

  // Normalize + guardrails (throws on violations)
  const payload = preprocessBillPayment(body);

  const path = `${BILL_PAYMENT_BASE}/${service_id}`;
  const res = await postJSON<unknown>(path, payload, {
    redirectOn401: true,
    redirectPath: "/signin",
  });

  return res;
  // return BillPaymentResponseSchema.parse(res);
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
