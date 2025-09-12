/* eslint-disable @typescript-eslint/no-explicit-any */
// src\features\retailer\retailer_bbps\bbps-online\bill-fetch\domain\types.ts
import { z } from "zod";

/** ------------ Circle List ------------ */
export const CircleSchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string(),
});

export const CircleListResponseSchema = z.object({
  status: z.union([z.number(), z.string()]).transform((s) => Number(s)),
  data: z.array(CircleSchema),
});
export type Circle = z.infer<typeof CircleSchema>;
export type CircleListResponse = z.infer<typeof CircleListResponseSchema>;

/** ------------ Category List ------------ */
export const CategorySchema = z.object({
  bbps_category_id: z.string(),
  biller_category: z.string(),
  icon: z.string()
});
export const CategoryListResponseSchema = z.object({
  status: z.union([z.number(), z.string()]).transform((s) => Number(s)),
  data: z.array(CategorySchema),
});
export type Category = z.infer<typeof CategorySchema>;
export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>;

/** ------------ Biller List ------------ */
export const BillerInputParamSchema = z.object({
  opr_id: z.string(),
  param_name: z.string(),
  display_name: z.string(),
  data_type: z.string(),
  regex_pattern: z.string().nullable().optional(),
  min_length: z.number().nullable().optional(),
  max_length: z.number().nullable().optional(),
  is_optional: z.boolean(),
  is_visible: z.boolean(),
});

export const BillerSchema = z.object({
  inputParams: z.array(BillerInputParamSchema).optional(),
  opr_id: z.string(),
  bbps_category_id: z.string(),
  service_id: z.string(),
  biller_id: z.string(),
  biller_name: z.string(),
  biller_description: z.string().nullable().optional(),
  biller_alias: z.string().nullable().optional(),
  billerTimeout: z.number().nullable().optional(),
  planMdmRequirement: z.string().nullable().optional(),
  biller_fetch_requiremet: z.string().nullable().optional(),
  biller_payment_exactness: z.string().nullable().optional(),
  billerAdhoc: z.boolean().nullable().optional(),
  biller_payment_modes: z.string().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  support_pending_status: z.boolean().nullable().optional(),
  billerAdditionalInfoPayment: z.unknown().nullable().optional(),
  interchange_feeCCF1: z.unknown().nullable().optional(),
  biller_status: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const BillerListResponseSchema = z.object({
  data: z.array(BillerSchema),
  status: z.union([z.number(), z.string()]),
});
export type BillerInputParam = z.infer<typeof BillerInputParamSchema>;
export type Biller = z.infer<typeof BillerSchema>;
export type BillerListResponse = z.infer<typeof BillerListResponseSchema>;

/** ------------ Bill Fetch ------------ */
/** ---------- Request (unchanged) ---------- */
export const BillFetchInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

const BillFetchInputContainerSchema = z.object({
  input: z.union([BillFetchInputParamSchema, z.array(BillFetchInputParamSchema)]),
});

export const BillFetchRequestSchema = z.object({
  customerInfo: z.object({
    customerMobile: z.string(),
    customerEmail: z.string().email().optional(),
  }),
  billerId: z.string(),
  inputParams: BillFetchInputContainerSchema,
});
export type BillFetchRequest = z.infer<typeof BillFetchRequestSchema>;

/** ---------- Core inner success payload ---------- */
const BillFetchInnerSuccessSchema = z.object({
  responseCode: z.string(),
  inputParams: z.object({
    input: z.union([BillFetchInputParamSchema, z.array(BillFetchInputParamSchema)]),
  }),
  billerResponse: z.object({
    billAmount: z.string(),
    billDate: z.string(),
    billNumber: z.string(),
    billPeriod: z.string(),
    customerName: z.string(),
    dueDate: z.string(),
  }),
});

/** ---------- Success shape #1: canonical ---------- */
const BillFetchSuccessSchema = z.object({
  billFetchResponse: BillFetchInnerSuccessSchema,
});

/** ---------- Success shape #2: wrapped with data.billFetchResponse ---------- */
const BillFetchWrappedWithKeySchema = z.object({
  status: z.union([z.string(), z.number()]).optional(),
  data: z.object({
    billFetchResponse: BillFetchInnerSuccessSchema,
  }),
});

/** ---------- Success shape #3: wrapped with data (no billFetchResponse key) ---------- */
const BillFetchWrappedBareSchema = z.object({
  status: z.union([z.string(), z.number()]).optional(),
  data: BillFetchInnerSuccessSchema,
});

/** ---------- Success shape #4: bare top-level inner fields ---------- */
const BillFetchBareTopSchema = BillFetchInnerSuccessSchema;

/** ---------- Error envelope ---------- */
const BillFetchErrorSchema = z.object({
  status: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
  error: z.unknown().optional(),
});

/** ---------- Union + Normalize to { billFetchResponse: {...} } ---------- */
export const BillFetchResponseSchema = z
  .union([
    BillFetchSuccessSchema,
    BillFetchWrappedWithKeySchema,
    BillFetchWrappedBareSchema,
    BillFetchBareTopSchema,
    BillFetchErrorSchema,
  ])
  .transform((val) => {
    // Already canonical
    if ("billFetchResponse" in val) {
      return val;
    }

    // Wrapped with data.billFetchResponse
    if ("data" in val && val?.data && typeof val.data === "object" && "billFetchResponse" in (val as any).data) {
      return { billFetchResponse: (val as any).data.billFetchResponse };
    }

    // Wrapped with data (bare fields)
    if ("data" in val && val?.data && typeof val.data === "object" && "responseCode" in (val as any).data) {
      return { billFetchResponse: (val as any).data };
    }

    // Bare top-level inner fields
    if ("responseCode" in val && "billerResponse" in val) {
      return { billFetchResponse: val as z.infer<typeof BillFetchInnerSuccessSchema> };
    }

    // Error envelope → throw a clean error
    if ("message" in val || "error" in val) {
      const status = (val as any)?.status;
      const message = (val as any)?.message || "Bill fetch failed";
      throw new Error(`${status ? `[${status}] ` : ""}${message}`);
    }

    // Unknown structure
    throw new Error("Invalid BillFetchResponse format");
  });

export type BillFetchResponse = z.infer<typeof BillFetchResponseSchema>;


/** ------------ Error Envelope (best-guess; refine if docs change) ------------ */
export const ApiErrorEnvelopeSchema = z.object({
  status: z.union([z.number(), z.string()]).optional(),
  message: z.string().optional(),
  error: z.unknown().optional(),
  code: z.string().optional(),
  data: z.unknown().optional(),
});
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

/** ------------ Biller Info (request) ------------ */
export const BillerInfoRequestSchema = z.object({
  billerId: z.union([z.string(), z.array(z.string()).min(1)]),
});
export type BillerInfoRequest = z.infer<typeof BillerInfoRequestSchema>;

/** ------------ Biller Info (response) ------------ */
const BillerInfoParamInfoSchema = z.object({
  paramName: z.string(),
  dataType: z.string(),
  isOptional: z.string(),      // "true"/"false" as per example
  minLength: z.string(),
  maxLength: z.string(),
  regEx: z.string(),
  visibility: z.string(),      // "true"/"false"
});

const BillerInfoInputParamsSchema = z.object({
  // Sometimes a single object, sometimes an array
  paramInfo: z.union([BillerInfoParamInfoSchema, z.array(BillerInfoParamInfoSchema)]),
});

const BillerInfoPaymentChannelInfoSchema = z.object({
  paymentChannelName: z.string(),
  minAmount: z.string(),
  maxAmount: z.string(),
});

const BillerInfoPaymentChannelsSchema = z.object({
  paymentChannelInfo: z.array(BillerInfoPaymentChannelInfoSchema),
});

export const BillerInfoBillerSchema = z.object({
  billerId: z.string(),
  billerAliasName: z.string(),
  billerName: z.string(),
  billerCategory: z.string(),
  billerAdhoc: z.string(), // "false"/"true"
  billerCoverage: z.string(),
  billerFetchRequiremet: z.string(),
  billerPaymentExactness: z.string(),
  billerSupportBillValidation: z.string(),
  supportPendingStatus: z.string(),
  supportDeemed: z.string(),
  billerStatus: z.string(),
  billerTimeout: z.number().nullable(),
  billerInputParams: BillerInfoInputParamsSchema,
  billerAdditionalInfo: z.unknown().nullable(),
  billerAmountOptions: z.string(),
  billerPaymentModes: z.string(),
  billerDescription: z.string().nullable(),
  rechargeAmountInValidationRequest: z.string(),
  billerPaymentChannels: BillerInfoPaymentChannelsSchema,
  billerAdditionalInfoPayment: z.unknown().nullable(),
  planAdditionalInfo: z.unknown().nullable(),
  planMdmRequirement: z.string(),
  billerResponseType: z.string(),
  billerPlanResponseParams: z.unknown().nullable(),
  interchangeFeeCCF1: z.unknown().nullable(),
});

export const BillerInfoResponseSchema = z.object({
  status: z.union([z.number(), z.string()]),
  requestId: z.string(),
  data: z.object({
    responseCode: z.string(),
    biller: BillerInfoBillerSchema,
  }),
});
export type BillerInfoResponse = z.infer<typeof BillerInfoResponseSchema>;

/** ------------ Plan Pull (GET /secure/bbps/bills/all-plans/{service_id}/{billerId}?mode=ONLINE) ------------ */

/** paramTag can be a single object or an array */
export const PlanParamTagSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

export const PlanAddnlInfoSchema = z.object({
  paramTag: z.union([PlanParamTagSchema, z.array(PlanParamTagSchema)]),
});

/** One plan item */
export const PlanSchema = z.object({
  planId: z.string(),
  billerId: z.string(),
  categoryType: z.string().nullable().optional(),
  categorySubType: z.string().nullable().optional(),
  amountInRupees: z.string(),       // API returns as string (e.g., "500.0")
  planDesc: z.string(),
  planAddnlInfo: PlanAddnlInfoSchema.optional(),
  effectiveFrom: z.string(),        // ISO date as string
  effectiveTo: z.string().nullable(),// can be null
  status: z.string(),               // e.g., "ACTIVE" | "DEACTIVATED"
});

export const PlanPullResponseSchema = z.object({
  status: z.union([z.string(), z.number()]).transform((s) => Number(s)), // "200" -> 200
  requestId: z.string(),
  data: z.object({
    responseCode: z.string(),       // e.g., "000"
    respReason: z.string(),         // e.g., "Successful"
    planDetails: z.array(PlanSchema),
  }),
});

export type PlanParamTag = z.infer<typeof PlanParamTagSchema>;
export type PlanAddnlInfo = z.infer<typeof PlanAddnlInfoSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type PlanPullResponse = z.infer<typeof PlanPullResponseSchema>;

/* --- keep the rest of your existing exports below unchanged --- */
