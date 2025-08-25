import { z } from "zod";

/** ---------- Common small pieces ---------- */
export const BAInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

export const BAInputParamsSchema = z.object({
  input: z.union([BAInputParamSchema, z.array(BAInputParamSchema)]),
});

export const BACustomerInfoSchema = z.object({
  customerMobile: z.string(),
  customerEmail: z.string().email().optional(),
  customerAdhaar: z.string().optional(),
  REMITTER_NAME: z.string(),
  customerPan: z.string().optional(),
});

export const BABillerResponseSchema = z.object({
  billAmount: z.string(),
  billDate: z.string().optional(),
  billNumber: z.string(),
  billPeriod: z.string().optional(),
  customerName: z.string(),
  dueDate: z.string().optional(),
});

export const BAAmountInfoSchema = z.object({
  amount: z.string(),     // paise
  currency: z.string(),   // ISO 4217 numeric ("356" for INR)
  custConvFee: z.string().optional(),
});

/** =========================================
 *  Bill Payment
 *  POST /secure/bbps/bills/bill-payment/{tenantId}
 * ========================================= */
export const BAPaymentMethodSchema = z.object({
  paymentMode: z.string(),
  quickPay: z.enum(["Y", "N"]),
  splitPay: z.enum(["Y", "N"]).optional(),
});

export const BAPaymentInfoSchema = z.object({
  info: z.object({
    infoName: z.string(),
    infoValue: z.string(),
  }),
});

export const BillPaymentRequestSchema = z.object({
  requestId: z.string(),
  billerId: z.string(),
  customerInfo: BACustomerInfoSchema,
  inputParams: BAInputParamsSchema,
  billerResponse: BABillerResponseSchema.optional(), // required for bill-presentment, optional for quickPay=Y
  amountInfo: BAAmountInfoSchema,
  paymentMethod: BAPaymentMethodSchema,
  paymentInfo: BAPaymentInfoSchema.optional(),
});
export type BillPaymentRequest = z.infer<typeof BillPaymentRequestSchema>;

export const BillPaymentResponseSchema = z.object({
  ExtBillPayResponse: z.object({
    responseCode: z.string(),
    responseReason: z.string().optional(),
    txnRefId: z.string().optional(),
    requestId: z.string().optional(),
    approvalRefNumber: z.string().optional(),
    txnRespType: z.string().optional(),
    inputParams: z.object({ input: BAInputParamSchema }).optional(),
    CustConvFee: z.string().optional(),
    RespAmount: z.string().optional(),
    RespBillDate: z.string().optional(),
    RespBillNumber: z.string().optional(),
    RespBillPeriod: z.string().optional(),
    RespCustomerName: z.string().optional(),
    RespDueDate: z.string().optional(),
  }),
  requestId: z.string().optional(),
});
export type BillPaymentResponse = z.infer<typeof BillPaymentResponseSchema>;

/** =========================================
 *  Transaction Status
 *  POST /secure/bbps/bills/txn-status/{tenantId}
 *  header: apiurl: /transactionStatus/fetchInfo/xml
 * ========================================= */
export const TxnStatusRequestSchema = z.object({
  trackType: z.enum(["TRANS_REF_ID", "MOBILE_NO"]),
  trackValue: z.string(),
  fromDate: z.string().optional(), // YYYY-MM-DD (required if MOBILE_NO)
  toDate: z.string().optional(),   // YYYY-MM-DD (required if MOBILE_NO)
});
export type TxnStatusRequest = z.infer<typeof TxnStatusRequestSchema>;

// Flexible response — provider formats vary
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

/** =========================================
 *  Complaint Registration
 *  POST /secure/bbps/bills/complaint-Reg/{tenantId}
 *  header: apiurl: /extComplaints/register/json
 * ========================================= */
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

// Accept either flat or nested payloads
const ComplaintCoreSchema = z.object({
  complaintId: z.string().optional(),
  complaintRemarks: z.string().optional(),
  responseCode: z.string().optional(),
  responseReason: z.string().optional(),
  complaintStatus: z.string().optional(),
});

// Base (allow unknown top-level keys)
const ComplaintBaseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
  })
  .passthrough();

// Variant A: flat fields at top level
const ComplaintFlatSchema = ComplaintCoreSchema;

// Variant B: nested under `data`
const ComplaintNestedSchema = z.object({
  data: ComplaintCoreSchema,
});

// Final: base ∧ (flat ∨ nested)
export const ComplaintRegisterResponseSchema = ComplaintBaseSchema.and(
  z.union([ComplaintFlatSchema, ComplaintNestedSchema]),
);
export type ComplaintRegisterResponse = z.infer<typeof ComplaintRegisterResponseSchema>;

/** =========================================
 *  Complaint Tracking
 *  (Docs say GET, examples show body; we implement POST with header apiurl)
 *  /secure/bbps/bills/track-complaint/{tenantId}
 *  header: apiurl: /extComplaints/track/json
 * ========================================= */
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

/** =========================================
 *  Bill Validation
 *  POST /secure/bbps/billavenue/bill-validation/{tenantId}
 *  header: apiurl: /extBillValCntrl/billValidationRequest/json
 *  (Auth: API Key; we still allow Bearer as configured)
 * ========================================= */
export const BillValidationInputParamsSchema = z.object({
  input: z.array(BAInputParamSchema),
});

export const BillValidationInnerSchema = z.object({
  agentId: z.string(),
  billerId: z.string(),
  inputParams: BillValidationInputParamsSchema,
});

export const BillValidationRequestSchema = z.object({
  billValidationRequest: BillValidationInnerSchema,
});
export type BillValidationRequest = z.infer<typeof BillValidationRequestSchema>;

export const BillValidationResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
    requestId: z.string().optional(),
    // Providers may return nested envelopes like { billValidationResponse: {...} } — allow anything.
  })
  .passthrough();
export type BillValidationResponse = z.infer<typeof BillValidationResponseSchema>;

/** =========================================
 *  All Plans (Plan Pull)
 *  GET /secure/bbps/bills/all-plans/{tenantId}/{billerId}
 * ========================================= */
export const AllPlansResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    data: z.unknown().optional(),
    plans: z.array(z.unknown()).optional(),
  })
  .passthrough();
export type AllPlansResponse = z.infer<typeof AllPlansResponseSchema>;
