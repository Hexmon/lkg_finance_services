/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

/* --------------------------------- regex --------------------------------- */
const MOBILE_REGEX = /^\d{10}$/;
// PAN: 5 letters + 4 digits + 1 letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
// Aadhaar: 12 digits
const AADHAAR_REGEX = /^\d{12}$/;
// A simple human name guard (optional; loosen/tighten as you need)
const NAME_REGEX = /^[A-Za-z][A-Za-z0-9\s'.-]{1,99}$/;

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
  icon: z.string(),
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

const ParamInfoSchema = z.object({
  paramName: z.string(),
});

const BillerAdditionalInfoSchema = z.object({
  paramInfo: z.array(ParamInfoSchema).optional(),
}).partial();

export const BillerSchema = z.object({
  inputParams: z.array(BillerInputParamSchema).optional(),
  opr_id: z.string(),
  bbps_category_id: z.string(),
  service_id: z.string(),

  biller_id: z.string(),
  billerId: z.string().optional(),

  is_active: z.boolean(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),

  max: z.union([z.string(), z.number()]).nullable().optional(),
  min: z.union([z.string(), z.number()]).nullable().optional(),

  billerName: z.string().optional(),
  billerAliasName: z.string().nullable().optional(),
  billerDescription: z.string().nullable().optional(),
  biller_status: z.string().nullable().optional(), // legacy
  billerStatus: z.string().nullable().optional(),

  billerAdhoc: z.boolean().nullable().optional(),
  billerTimeout: z.union([z.string(), z.number(), z.null()]).optional(),
  supportDeemed: z.boolean().nullable().optional(),
  billerCategory: z.string().nullable().optional(),
  billerCoverage: z.string().nullable().optional(),
  billerResponseType: z.string().nullable().optional(),
  billerAmountOptions: z.string().nullable().optional(),
  planMdmRequirement: z.string().nullable().optional(),
  planAdditionalInfo: z.unknown().nullable().optional(),

  billerAdditionalInfo: BillerAdditionalInfoSchema.nullable().optional(),
  billerPlanResponseParams: z.unknown().nullable().optional(),
  billerAdditionalInfoPayment: z.unknown().nullable().optional(),

  supportPendingStatus: z.boolean().nullable().optional(),
  support_pending_status: z.boolean().nullable().optional(), // legacy
  billerFetchRequiremet: z.string().nullable().optional(),   // note: typo in API
  billerPaymentExactness: z.string().nullable().optional(),
  billerSupportBillValidation: z.string().nullable().optional(),
  rechargeAmountInValidationRequest: z.string().nullable().optional(),

  interchangeFeeCCF1: z.unknown().nullable().optional(),
  interchange_feeCCF1: z.unknown().nullable().optional(),
});

export const BillerListResponseSchema = z.object({
  data: z.array(BillerSchema),
  status: z.union([z.number(), z.string()]),
});

export type BillerInputParam = z.infer<typeof BillerInputParamSchema>;
export type Biller = z.infer<typeof BillerSchema>;
export type BillerListResponse = z.infer<typeof BillerListResponseSchema>;

/** ------------ Bill Fetch (SUCCESS NORMALIZATION ONLY) ------------ */
/** ---------- Request ---------- */
export const BillFetchInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

const BillFetchInputContainerSchema = z.object({
  input: z.union([BillFetchInputParamSchema, z.array(BillFetchInputParamSchema)]),
});

const CustomerInfoIn = z.object({
  customerMobile: z.string().regex(MOBILE_REGEX, "Invalid mobile number"),
  customerEmail: z.string().email().optional(),
  // PAN or Aadhaar (both optional) — accept either
  customerPan: z
    .string()
    .regex(PAN_REGEX, "Invalid PAN (e.g., ABCDE1234F)")
    .or(z.string().regex(AADHAAR_REGEX, "Invalid Aadhaar (12 digits)"))
    .optional(),
  // Accept either key on input...
  remitterName: z.string().trim().min(1, "Invalid name").max(100).regex(NAME_REGEX, "Invalid name").optional(),
  customerName: z.string().trim().min(1, "Invalid name").max(100).regex(NAME_REGEX, "Invalid name").optional(),
}).strip();

const CustomerInfoSchema = CustomerInfoIn.transform((v) => {
  const name = v.customerName ?? v.remitterName;
  return {
    customerMobile: v.customerMobile,
    ...(v.customerEmail ? { customerEmail: v.customerEmail } : {}),
    ...(v.customerPan ? { customerPan: v.customerPan } : {}),
    ...(name ? { customerName: name } : {}), // ✅ only canonical key
  };
});

export const BillFetchRequestSchema = z.object({
  customerInfo: CustomerInfoSchema,
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

export const BillFetchResponseSchema = z
  .union([
    BillFetchSuccessSchema,
    BillFetchWrappedWithKeySchema,
    BillFetchWrappedBareSchema,
    BillFetchBareTopSchema,
  ])
  .transform((val) => {
    if ("billFetchResponse" in val) return val;
    if ("data" in val && (val as any).data) {
      const d = (val as any).data;
      if ("billFetchResponse" in d) return { billFetchResponse: d.billFetchResponse };
      if ("responseCode" in d && "billerResponse" in d) return { billFetchResponse: d };
    }
    if ("responseCode" in val && "billerResponse" in (val as any)) {
      return { billFetchResponse: val as z.infer<typeof BillFetchInnerSuccessSchema> };
    }
    return val as any;
  });

export type BillFetchResponse = z.infer<typeof BillFetchResponseSchema>;

export function isBillFetchSuccessShape(raw: any): boolean {
  if (!raw || typeof raw !== "object") return false;
  if ("billFetchResponse" in raw) return true;
  if (raw?.data && typeof raw.data === "object") {
    const d = raw.data as any;
    if ("billFetchResponse" in d) return true;
    if ("responseCode" in d && "billerResponse" in d) return true;
  }
  if ("responseCode" in raw && "billerResponse" in raw) return true;
  return false;
}

/** ------------ Error Envelope ------------ */
export const ApiErrorEnvelopeSchema = z.object({
  status: z.union([z.number(), z.string()]).optional(),
  message: z.string().optional(),
  error: z.unknown().optional(),
  code: z.string().optional(),
  data: z.unknown().optional(),
});
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

/** ------------ Biller Info (request/response) ------------ */
// (unchanged from your file)

export const BillerInfoRequestSchema = z.object({
  billerId: z.union([z.string(), z.array(z.string()).min(1)]),
});
export type BillerInfoRequest = z.infer<typeof BillerInfoRequestSchema>;

/** ------------ Biller Info (response) ------------ */
const BillerInfoParamInfoSchema = z.object({
  paramName: z.string(),
  dataType: z.string(),
  isOptional: z.string(), // "true"/"false"
  minLength: z.string(),
  maxLength: z.string(),
  regEx: z.string(),
  visibility: z.string(), // "true"/"false"
});

const BillerInfoInputParamsSchema = z.object({
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
  billerAdhoc: z.string(),
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

/** ------------ Plan Pull ------------ */
export const PlanParamTagSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

export const PlanAddnlInfoSchema = z.object({
  // Some billers send a single object, others an array, some omit entirely
  paramTag: z.union([PlanParamTagSchema, z.array(PlanParamTagSchema)]).optional(),
});

export const PlanSchema = z.object({
  planId: z.string(),
  billerId: z.string(),
  categoryType: z.string().nullable().optional(),
  categorySubType: z.string().nullable().optional(),
  amountInRupees: z.string(), // keep as string; upstream sends "500.0"
  planDesc: z.string(),
  planAddnlInfo: PlanAddnlInfoSchema.optional(),
  effectiveFrom: z.string(),
  effectiveTo: z.string().nullable(),   // null is valid in examples
  status: z.string(),
});

// Accept both "planDetails" and "plans" variants; allow optional; normalize to planDetails[]
export const PlanPullResponseSchema = z.object({
  status: z.union([z.string(), z.number()]).transform((s) => Number(s)),
  requestId: z.string().optional(),
  data: z.object({
    responseCode: z.string().optional(),
    respReason: z.string().optional(),
    responseReason: z.string().optional(), // some envs send this name
    planDetails: z.array(PlanSchema).optional(),
    plans: z.array(PlanSchema).optional(),
  }).passthrough(),
}).passthrough()
  .transform((v) => {
    const plans = v.data.planDetails ?? v.data.plans ?? [];
    return {
      ...v,
      data: {
        ...v.data,
        // Always expose data.planDetails (downstream can rely on it)
        planDetails: plans,
      },
    };
  });

export type PlanParamTag = z.infer<typeof PlanParamTagSchema>;
export type PlanAddnlInfo = z.infer<typeof PlanAddnlInfoSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type PlanPullResponse = z.infer<typeof PlanPullResponseSchema>;
