// src\features\retailer\retailer_bbps\bbps-online\multiple_bills\domain\types.ts
import { z } from "zod";

/** ============== Add Online Biller ============== */

export const AddOBAmountTagsSchema = z.object({
  amountTag: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
});

export const AddOBAmountInfoSchema = z.object({
  amount: z.string(),
  currency: z.string(), // ISO 4217 numeric, e.g., "356"
  custConvFee: z.string(),
  amountTags: AddOBAmountTagsSchema.optional().nullable(),
  CCF1: z.string().optional().nullable(),
});

export const AddOBInputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

export const AddOBInputParamsSchema = z.object({
  input: z.union([AddOBInputParamSchema, z.array(AddOBInputParamSchema)]),
});

export const AddOBCustomerInfoSchema = z.object({
  customerMobile: z.string(),
  customerAdhaar: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerPan: z.string().optional().nullable(),
}).passthrough();

export const AddOBBillerResponseSchema = z.object({
  billAmount: z.string(),
  billDate: z.string().optional(),
  billNumber: z.string(),
  billPeriod: z.string().optional(),
  customerName: z.string(),
  dueDate: z.string().optional(),
});

export const AddOBAdditionalInfoItemSchema = z.object({
  infoName: z.string(),
  infoValue: z.string().optional().nullable(),
});

export const AddOBAdditionalInfoSchema = z
  .union([
    // Preferred: { info: [{ infoName, infoValue }...] }
    z
      .object({
        info: z.array(AddOBAdditionalInfoItemSchema).default([]),
      })
      .passthrough(),
    // Fallback: any KV bag/object if provider changes shape
    z.record(z.string(), z.unknown())
  ])
  .optional()
  .default({});

export const AddOnlineBillerRequestSchema = z.object({
  is_direct: z.boolean().default(false),
  input_json: z.object({
    request_id: z.string(),
    customerInfo: AddOBCustomerInfoSchema,
    billerId: z.string(),
    inputParams: AddOBInputParamsSchema,
    billerResponse: AddOBBillerResponseSchema,
    amountInfo: AddOBAmountInfoSchema,
    additionalInfo: AddOBAdditionalInfoSchema,
  }),
});
export type AddOnlineBillerRequest = z.infer<typeof AddOnlineBillerRequestSchema>;

export const AddOnlineBillerBffRequestSchema = AddOnlineBillerRequestSchema.extend({
  service_id: z.string().uuid(),
}).strict();

export type AddOnlineBillerBffRequest = z.infer<typeof AddOnlineBillerBffRequestSchema>;

export const AddOnlineBillerResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).optional(),
    message: z.string().optional(),
    data: z.unknown().optional(),
    // data: z.unknown().optional(),
    biller_batch_id: z.string().optional(),
    requestId: z.string().optional(),
  })
  .passthrough();
export type AddOnlineBillerResponse = z.infer<typeof AddOnlineBillerResponseSchema>;

/** ============== Online Biller List ============== */
/** ---- charges object ---- */
const ChargesSchema = z.object({
  // backend sometimes includes this, sometimes not
  CCF1: z.number().optional().nullable(),
  gst_amount: z.number(),
  net_amount: z.number(),
  txn_amount: z.number(),
  gst_percent: z.number(),
  base_charges: z.number(),       // <-- rename from `charges` to `base_charges`
  charges_incl: z.number(),
  bbps_category_id: z.string().nullable().optional(),
  is_gst_inclusive: z.boolean(),
}).passthrough();

/** ---- inputParams: allow object OR array ---- */
const InputParamSchema = z.object({
  paramName: z.string(),
  paramValue: z.string(),
});

const InputParamsSchema = z.object({
  input: z.union([InputParamSchema, z.array(InputParamSchema)]),
}).passthrough();

/** ---- amountInfo (unchanged) ---- */
const AmountTagsSchema = z.object({
  value: z.string().optional().nullable(),
  amountTag: z.string().optional().nullable(),
}).passthrough();

const AmountInfoSchema = z.object({
  CCF1: z.string().optional().nullable(),
  amount: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  currency: z.string(),
  amountTags: AmountTagsSchema.optional(),
  custConvFee: z.union([z.string(), z.number()]).transform((v) => Number(v)),
}).passthrough();

/** ---- customer/biller response (unchanged) ---- */
const CustomerInfoSchema = z.object({
  customerPan: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerAdhaar: z.string().optional().nullable(),
  customerMobile: z.string(),
}).passthrough();

const BillerResponseSchema = z.object({
  dueDate: z.string().optional(),
  billDate: z.string().optional(),
  billAmount: z.string().optional(),
  billNumber: z.string().optional(),
  billPeriod: z.string().optional(),
  customerName: z.string().optional(),
}).passthrough();

/** ---- input_json: accept requestId OR request_id and normalize ---- */
const InputJsonSchema = z.object({
  billerId: z.string(),
  amountInfo: AmountInfoSchema,
  request_id: z.string().optional(),
  requestId: z.string().optional(),
  inputParams: InputParamsSchema,
  customerInfo: CustomerInfoSchema.optional(),
  billerResponse: BillerResponseSchema.optional(),
})
  .passthrough()
  .transform((v) => ({
    ...v,
    // unify to request_id for consumers
    request_id: v.request_id ?? v.requestId ?? "",
  }));

/** ---- list item ---- */
export const OnlineBillerListItemSchema = z
  .object({
    status: z.string(),
    biller_batch_id: z.string(),
    service_id: z.string(),
    batch_id: z.string(),
    user_id: z.string(),
    opr_id: z.string(),
    input_json: InputJsonSchema,
    charges: ChargesSchema,
    commissions: z.any().nullable(),
    is_active: z.boolean(),
    is_direct: z.boolean(),
    txn_id: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
  })
  .passthrough();

export type OnlineBillerListItem = z.infer<typeof OnlineBillerListItemSchema>;

/** ---- envelope ---- */
export const OnlineBillerListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
  next_page: z.number().nullable(),
  prev_page: z.number().nullable(),
  sort_by: z.string(),
  data: z.array(OnlineBillerListItemSchema),
});

export type OnlineBillerListResponse = z.infer<typeof OnlineBillerListResponseSchema>;

/** ---- Query schema (yours is fine) ---- */
export const OnlineBillerListQuerySchema = z.object({
  per_page: z.number().optional(),
  page: z.number().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  sort_by: z.string().optional(),
  status: z.string().optional(),
  is_active: z.boolean().optional(),
  is_direct: z.boolean().optional(),
});
export type OnlineBillerListQuery = z.infer<typeof OnlineBillerListQuerySchema>;


/** ============== Update Online Biller ============== */

export const UpdateOnlineBillerRequestSchema = z.object({
  is_active: z.boolean(),
  is_direct: z.boolean(),
  input_json: z.object({
    request_id: z.string().optional(),
    customerInfo: AddOBCustomerInfoSchema,
    billerId: z.string(),
    inputParams: AddOBInputParamsSchema,
    billerResponse: AddOBBillerResponseSchema,
    amountInfo: AddOBAmountInfoSchema,
  }),
});
export type UpdateOnlineBillerRequest = z.infer<typeof UpdateOnlineBillerRequestSchema>;

export const UpdateOnlineBillerResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]),
    data: OnlineBillerListItemSchema.optional(),
    message: z.string().optional(),
  })
  .passthrough();
export type UpdateOnlineBillerResponse = z.infer<typeof UpdateOnlineBillerResponseSchema>;

/** ============== Remove Online Biller ============== */

export const RemoveOnlineBillerResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.number(), z.string()]),
});
export type RemoveOnlineBillerResponse = z.infer<typeof RemoveOnlineBillerResponseSchema>;

/** ============== Online Bill Proceed ============== */

export const OnlineBillProceedRequestSchema = z.object({
  batch_id: z.string(),
});
export type OnlineBillProceedRequest = z.infer<typeof OnlineBillProceedRequestSchema>;

export const OnlineBillProceedResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]).optional(),
    message: z.string().optional(),
    requestId: z.string().optional(),
    data: z.unknown().optional(),
  })
  .passthrough();
export type OnlineBillProceedResponse = z.infer<typeof OnlineBillProceedResponseSchema>;