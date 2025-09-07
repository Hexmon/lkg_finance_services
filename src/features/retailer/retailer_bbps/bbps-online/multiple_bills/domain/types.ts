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
  REMITTER_NAME: z.string().optional().nullable(),
  customerPan: z.string().optional().nullable(),
});

export const AddOBBillerResponseSchema = z.object({
  billAmount: z.string(),
  billDate: z.string(),
  billNumber: z.string(),
  billPeriod: z.string(),
  customerName: z.string(),
  dueDate: z.string(),
});

export const AddOnlineBillerRequestSchema = z.object({
  opr_id: z.string(), // UUID
  is_direct: z.boolean(),
  input_json: z.object({
    request_id: z.string(),
    customerInfo: AddOBCustomerInfoSchema,
    billerId: z.string(),
    inputParams: AddOBInputParamsSchema,
    billerResponse: AddOBBillerResponseSchema,
    amountInfo: AddOBAmountInfoSchema,
  }),
});
export type AddOnlineBillerRequest = z.infer<typeof AddOnlineBillerRequestSchema>;

export const AddOnlineBillerResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]).optional(),
    message: z.string().optional(),
    data: z.unknown().optional(),
    biller_batch_id: z.string().optional(),
    requestId: z.string().optional(),
  })
  .passthrough();
export type AddOnlineBillerResponse = z.infer<typeof AddOnlineBillerResponseSchema>;

/** ============== Online Biller List ============== */

export const OnlineBillerListItemSchema = z.object({
  status: z.string(),
  biller_batch_id: z.string(),
  service_id: z.string(),
  user_id: z.string(),
  opr_id: z.string(),
  reqid: z.string(),
  number: z.string(),
  amount: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  retry_count: z.number(),
  is_active: z.boolean(),
  is_offline: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});
export type OnlineBillerListItem = z.infer<typeof OnlineBillerListItemSchema>;

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
