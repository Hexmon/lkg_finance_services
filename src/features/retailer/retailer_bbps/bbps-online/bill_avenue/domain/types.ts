// src/features/retailer/retailer_bbps/bbps-online/bill_avenue/domain/types.ts
import { z } from "zod";

/** ---------- Common small pieces (isomorphic) ---------- */
export const BAInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});
export type BAInputParam = z.infer<typeof BAInputParamSchema>;

/** Accepts single object OR array (providers vary) */
export const BAInputParamsSchema = z.object({
  input: z.union([BAInputParamSchema, z.array(BAInputParamSchema)]),
});
export type BAInputParams = z.infer<typeof BAInputParamsSchema>;

export const BACustomerInfoSchema = z.object({
  customerMobile: z.string(),
  customerEmail: z.string().email().optional(),
  customerAdhaar: z.string().optional(),
  REMITTER_NAME: z.string(),
  customerPan: z.string().optional(), // server will enforce if amount > 49,999
});
export type BACustomerInfo = z.infer<typeof BACustomerInfoSchema>;

export const BABillerResponseSchema = z.object({
  billAmount: z.string(),              // paise (string)
  billDate: z.string().optional(),     // YYYY-MM-DD
  billNumber: z.string(),
  billPeriod: z.string().optional(),
  customerName: z.string(),
  dueDate: z.string().optional(),
});
export type BABillerResponse = z.infer<typeof BABillerResponseSchema>;

export const BAAmountInfoSchema = z.object({
  amount: z.string(),                  // paise (string)
  currency: z.string(),                // ISO 4217 numeric; "356" for INR
  custConvFee: z.string().optional(),  // stringified number
});
export type BAAmountInfo = z.infer<typeof BAAmountInfoSchema>;

/* ============================
 * BBPS: Bill Payment (POST)
 * Upstream: /secure/bbps/bills/bill-payment/{service_id}
 * ============================ */

/** Path params */
export const BillPaymentPathParamsSchema = z.object({
  service_id: z.string().uuid({ message: "service_id must be a UUID" }),
});
export type BillPaymentPathParams = z.infer<typeof BillPaymentPathParamsSchema>;

/** Helpers */
const digitsString = z.string().regex(/^\d+$/, "Must be digits string");
const ynFlag = z.enum(["Y", "N"]);
const emailOpt = z.string().email().optional();

/** customerInfo */
export const CustomerInfoSchema = z.object({
  customerMobile: z.string().min(1, "customerMobile is required"),
  customerEmail: emailOpt,
  customerAdhaar: z.string().regex(/^\d{12}$/, "customerAdhaar must be 12 digits").optional(),
  REMITTER_NAME: z.string().min(1, "REMITTER_NAME is required"),
  customerPan: z
    .string()
    .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Invalid PAN format")
    .optional(),
}).strict();
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;

/** inputParams — provider samples show { input: { paramName, paramValue } } */
export const InputParamEntrySchema = z.object({
  paramName: z.string().min(1),
  paramValue: z.string().min(1),
}).strict();

export const InputParamsSchema = z.object({
  input: InputParamEntrySchema, // keep 1-entry structure as per examples
}).strict();

export type InputParams = z.infer<typeof InputParamsSchema>;

/** billerResponse (presentment flow) */
export const BillerResponseSchema = z.object({
  billAmount: digitsString,            // paise as string
  billDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  billNumber: z.string().min(1),
  billPeriod: z.string().optional(),
  customerName: z.string().min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).strict();
export type BillerResponse = z.infer<typeof BillerResponseSchema>;

/** amountInfo */
export const AmountInfoSchema = z.object({
  amount: digitsString,    // paise as string
  currency: digitsString,  // "356" for INR
  custConvFee: digitsString.optional(),
}).strict();
export type AmountInfo = z.infer<typeof AmountInfoSchema>;

/** paymentMethod */
export const PaymentMethodSchema = z.object({
  paymentMode: z.string().min(1), // Cash / UPI / Card / etc.
  quickPay: ynFlag,               // Y for recharge-type
  splitPay: ynFlag.optional(),
}).strict();
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

/** paymentInfo */
export const PaymentInfoSchema = z.object({
  info: z.object({
    infoName: z.string().min(1),
    infoValue: z.string().min(1),
  }).strict(),
}).strict();
export type PaymentInfo = z.infer<typeof PaymentInfoSchema>;

/** Request body */
export const BillPaymentRequestSchema = z.object({
  requestId: z.string().min(1),
  billerId: z.string().min(1),
  customerInfo: CustomerInfoSchema,
  inputParams: InputParamsSchema,
  billerResponse: BillerResponseSchema.optional(), // required only for presentment flow
  planId: z.string().optional(),
  amountInfo: AmountInfoSchema,
  paymentMethod: PaymentMethodSchema,
  paymentInfo: PaymentInfoSchema.optional(),
}).strict();

export type BillPaymentRequest = z.infer<typeof BillPaymentRequestSchema>;

/** Response */
export const BillPaymentResponseDataSchema = z.object({
  responseCode: z.string().optional(),
  responseReason: z.string().optional(),
  txnRefId: z.string().optional(),
  requestId: z.string().optional(),
  approvalRefNumber: z.string().optional(),
  txnRespType: z.string().optional(),
  inputParams: z
    .object({ input: InputParamEntrySchema })
    .strict()
    .optional(),
  CustConvFee: z.string().optional(),
  RespAmount: digitsString.optional(),
  RespBillDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  RespBillNumber: z.string().optional(),
  RespBillPeriod: z.string().optional(),
  RespCustomerName: z.string().optional(),
  RespDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).passthrough();

export const BillPaymentResponseSchema = z.object({
  status: z.union([z.number(), z.string().regex(/^\d+$/)]).transform((n) => Number(n)),
  requestId: z.string().optional(),
  data: BillPaymentResponseDataSchema.optional(),
}).passthrough();

export type BillPaymentResponse = z.infer<typeof BillPaymentResponseSchema>;

/* ======================================================================
 * Transaction Status
 * POST /secure/bbps/bills/txn-status/{tenantId}
 * header: apiurl: /transactionStatus/fetchInfo/xml
 * ==================================================================== */

export const TxnStatusRequestSchema = z.object({
  trackType: z.enum(["TRANS_REF_ID", "MOBILE_NO"]),
  trackValue: z.string(),
  fromDate: z.string().optional(), // YYYY-MM-DD (required if MOBILE_NO)
  toDate: z.string().optional(),   // YYYY-MM-DD (required if MOBILE_NO)
});
export type TxnStatusRequest = z.infer<typeof TxnStatusRequestSchema>;

/** Flexible; let BFF/UI decide how to interpret */
export const TxnStatusResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).optional(),
    requestId: z.string().optional(),
    data: z.unknown().optional(),
    responseCode: z.string().optional(),
    responseReason: z.string().optional(),
    transactions: z.unknown().optional(),
  })
  .passthrough();
export type TxnStatusResponse = z.infer<typeof TxnStatusResponseSchema>;

/* ======================================================================
 * Complaint Registration
 * POST /secure/bbps/bills/complaint-Reg/{tenantId}
 * header: apiurl: /extComplaints/register/json
 * ==================================================================== */

export const ComplaintRegisterRequestSchema = z.object({
  txn_id: z.string(),
  complaintType: z.string(),
  participationType: z.enum(["AGENT", "BILLER"]),
  billerId: z.string().optional(), // required if participationType=BILLER
  complaintDesc: z.string(),
  servReason: z.string(),
  complaintDisposition: z.string(),
});
export type ComplaintRegisterRequest = z.infer<typeof ComplaintRegisterRequestSchema>;

/** Base + 2 variants (flat | nested under data) */
const ComplaintCoreSchema = z.object({
  complaintId: z.string().optional(),
  complaintRemarks: z.string().optional(),
  responseCode: z.string().optional(),
  responseReason: z.string().optional(),
  complaintStatus: z.string().optional(),
});
const ComplaintBaseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
  })
  .passthrough();
const ComplaintFlatSchema = ComplaintCoreSchema;
const ComplaintNestedSchema = z.object({ data: ComplaintCoreSchema });
export const ComplaintRegisterResponseSchema = ComplaintBaseSchema.and(
  z.union([ComplaintFlatSchema, ComplaintNestedSchema]),
);
export type ComplaintRegisterResponse = z.infer<typeof ComplaintRegisterResponseSchema>;

/* ======================================================================
 * Complaint Tracking
 * POST /secure/bbps/bills/track-complaint/{tenantId}
 * header: apiurl: /extComplaints/track/json
 * ==================================================================== */

export const ComplaintTrackRequestSchema = z.object({
  complaintId: z.string(),
});
export type ComplaintTrackRequest = z.infer<typeof ComplaintTrackRequestSchema>;

export const ComplaintTrackResponseSchema = z
  .object({
    complaintStatus: z.string().optional(),
    complaintRemarks: z.string().optional(),
    responseCode: z.string().optional(),
    responseReason: z.string().optional(),
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
  })
  .passthrough();
export type ComplaintTrackResponse = z.infer<typeof ComplaintTrackResponseSchema>;

/* ======================================================================
 * Bill Validation
 * POST /secure/bbps/billavenue/bill-validation/{tenantId}
 * header: apiurl: /extBillValCntrl/billValidationRequest/json
 * ==================================================================== */

export const BillValidationInputParamsSchema = z.object({
  input: z.array(BAInputParamSchema),
});
export type BillValidationInputParams = z.infer<typeof BillValidationInputParamsSchema>;

export const BillValidationInnerSchema = z.object({
  agentId: z.string(),
  billerId: z.string(),
  inputParams: BillValidationInputParamsSchema,
});
export type BillValidationInner = z.infer<typeof BillValidationInnerSchema>;

export const BillValidationRequestSchema = z.object({
  billValidationRequest: BillValidationInnerSchema,
});
export type BillValidationRequest = z.infer<typeof BillValidationRequestSchema>;

export const BillValidationResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
    requestId: z.string().optional(),
  })
  .passthrough();
export type BillValidationResponse = z.infer<typeof BillValidationResponseSchema>;

/* ======================================================================
 * All Plans (Plan Pull)
 * GET /secure/bbps/bills/all-plans/{tenantId}/{billerId}
 * ==================================================================== */

export const AllPlansResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    data: z.unknown().optional(),
    plans: z.array(z.unknown()).optional(),
  })
  .passthrough();
export type AllPlansResponse = z.infer<typeof AllPlansResponseSchema>;

/* ======================================================================
 * Helpers (shared by UI & BFF)
 * ==================================================================== */

/** Normalize Bill Payment response (Variant A or B) into a single flat shape */
export type NormalizedBillPayment = {
  responseCode?: string;
  responseReason?: string;
  txnRefId?: string;
  requestId?: string;
  approvalRefNumber?: string;
  txnRespType?: string;
  CustConvFee?: string;
  RespAmount?: string;       // paise
  RespBillDate?: string;
  RespBillNumber?: string;
  RespBillPeriod?: string;
  RespCustomerName?: string;
  RespDueDate?: string;
};

// export function normalizeBillPaymentResponse(
//   res: BillPaymentResponse
// ): NormalizedBillPayment {
//   const core =
//     "ExtBillPayResponse" in res
//       ? res.ExtBillPayResponse
//       : (res as z.infer<typeof BillPaymentResponseVariantA>).data ?? {};

//   const {
//     responseCode,
//     responseReason,
//     txnRefId,
//     requestId,
//     approvalRefNumber,
//     txnRespType,
//     CustConvFee,
//     RespAmount,
//     RespBillDate,
//     RespBillNumber,
//     RespBillPeriod,
//     RespCustomerName,
//     RespDueDate,
//   } = (core as z.infer<typeof BillPaymentCoreSchema>) || {};

//   return {
//     responseCode,
//     responseReason,
//     txnRefId,
//     requestId,
//     approvalRefNumber,
//     txnRespType,
//     CustConvFee,
//     RespAmount,
//     RespBillDate,
//     RespBillNumber,
//     RespBillPeriod,
//     RespCustomerName,
//     RespDueDate,
//   };
// }

/** Money helpers for paise/rupees (UI-friendly) */
export const fromPaise = (p?: string | number | null) =>
  (p == null || p === "") ? 0 : Number(p) / 100;

export const toPaise = (r?: string | number | null) => {
  if (r == null || r === "") return "0";
  const n = typeof r === "string" ? Number(r) : r;
  return String(Math.round((n || 0) * 100));
};
