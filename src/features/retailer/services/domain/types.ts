/**
 * src\features\retailer\services\domain\types.ts
 * Zod schemas & types for Retailer Service APIs
 *
 * Endpoints covered:
 * - GET    /secure/retailer/service-list
 * - GET    /secure/retailer/service-subscription-list
 * - GET    /secure/retailer/subscriptions
 * - POST   /secure/retailer/subscribe
 * - POST   /secure/retailer/service-charges
 */

import { z } from "zod";

/** Common */
export const StatusCodeSchema = z.union([
  z.number(),
  // Some providers return numeric status as a string (e.g., "200", "201")
  z.string().regex(/^\d+$/),
]);

/** =========================
 *  Service List
 *  GET /secure/retailer/service-list
 *  ========================= */
export const ServiceListQuerySchema = z
  .object({
    category: z.string().min(1).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    per_page: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
  })
  .strict();

export type ServiceListQuery = z.infer<typeof ServiceListQuerySchema>;

export const ServiceRecordSchema = z
  .object({
    master_id: z.string().uuid(),
    label: z.string().min(1),
    service_id: z.string().uuid(),
  })
  .strict();

export type ServiceRecord = z.infer<typeof ServiceRecordSchema>;

export const ServiceListResponseSchema = z
  .object({
    status: StatusCodeSchema,
    data: z.array(ServiceRecordSchema),
  })
  .strict();

export type ServiceListResponse = z.infer<typeof ServiceListResponseSchema>;

/** =========================
 *  Service Subscription List (by service name)
 *  GET /secure/retailer/service-subscription-list
 *  ========================= */
export const ServiceSubscriptionListQuerySchema = z
  .object({
    service_name: z.string().min(1),
  })
  .strict();

export type ServiceSubscriptionListQuery = z.infer<typeof ServiceSubscriptionListQuerySchema>;

export const ActivationChargesSchema = z
  .object({
    service_id: z.string().uuid(),
    user_id: z.string().min(1),
    role: z.string().min(1),
    txn_amount: z.number(),
    net_amount: z.number(),
    is_gst_inclusive: z.boolean(),
    gst_amount: z.number(),
    gst_percent: z.number(),
    base_charges: z.number(),
    charges_incl: z.number(),
  })
  .strict();

export type ActivationCharges = z.infer<typeof ActivationChargesSchema>;

export const ServiceSubscriptionRecordSchema = z
  .object({
    service_id: z.string().uuid(),
    service_name: z.string().min(1),
    api_partner: z.string().min(1),
    is_subscribed: z.boolean(),
    is_blocked: z.boolean(),
    // Optional block per spec (not in sample payload, but may be present)
    activation_charges: ActivationChargesSchema.optional(),
  })
  .strict();

export type ServiceSubscriptionRecord = z.infer<
  typeof ServiceSubscriptionRecordSchema
>;

export const ServiceSubscriptionListResponseSchema = z
  .object({
    status: StatusCodeSchema,
    data: z.array(ServiceSubscriptionRecordSchema),
  })
  .strict();

export type ServiceSubscriptionListResponse = z.infer<typeof ServiceSubscriptionListResponseSchema>;

/** =========================
 *  Subscriptions (paginated list of retailer subscriptions)
 *  GET /secure/retailer/subscriptions
 *  ========================= */
export const SubscriptionsListQuerySchema = z
  .object({
    per_page: z.number().int().positive().optional(),
    page: z.number().int().positive().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    sort_by: z.string().min(1).optional(), // e.g., "created_at"
    service_id: z.string().uuid().optional(),
    status: z.enum(["ACTIVE", "EXPIRED", "PENDING"]).optional(),
  })
  .strict();

export type SubscriptionsListQuery = z.infer<
  typeof SubscriptionsListQuerySchema
>;

export const SubscriptionItemSchema = z
  .object({
    status: z.enum(["ACTIVE", "EXPIRED", "PENDING"]),
    api_partner: z.string().min(1),
    name: z.string().min(1), // service name (e.g., "BBPS")
    subscription_id: z.string().uuid(),
    service_id: z.string().uuid(),
    user_id: z.string().uuid(),
    transaction_id: z.string().uuid().nullable(),
    subscribed_at: z.string().min(1), // ISO timestamp string
    updated_at: z.string().min(1).nullable(),
  })
  .strict();

export type SubscriptionItem = z.infer<typeof SubscriptionItemSchema>;

export const SubscriptionsListResponseSchema = z
  .object({
    total: z.number().int(),
    page: z.number().int(),
    per_page: z.number().int(),
    pages: z.number().int(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
    next_page: z.number().int().nullable(),
    prev_page: z.number().int().nullable(),
    sort_by: z.string().min(1),
    data: z.array(SubscriptionItemSchema),
  })
  .strict();

export type SubscriptionsListResponse = z.infer<
  typeof SubscriptionsListResponseSchema
>;

/** =========================
 *  Subscribe (create/update retailer subscription)
 *  POST /secure/retailer/subscribe
 *  ========================= */
export const ServiceSubscribeBodySchema = z
  .object({
    service_id: z.string().uuid(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .strict();

export type ServiceSubscribeBody = z.infer<typeof ServiceSubscribeBodySchema>;

export const ServiceSubscribeSuccessDataSchema = z
  .object({
    status: z.enum(["ACTIVE", "EXPIRED", "PENDING"]).or(z.literal("ACTIVE")),
    api_partner: z.string().min(1),
    name: z.string().min(1),
    subscription_id: z.string().uuid(),
    service_id: z.string().uuid(),
    user_id: z.string().uuid(),
    transaction_id: z.string().uuid().nullable(),
    subscribed_at: z.string().min(1),
    updated_at: z.string().min(1).nullable(),
  })
  .strict();

export type ServiceSubscribeSuccessData = z.infer<
  typeof ServiceSubscribeSuccessDataSchema
>;

export const ServiceSubscribeResponseSchema = z
  .object({
    data: ServiceSubscribeSuccessDataSchema,
    // provider returns "201" as a string; accept numeric or string
    status: z.union([z.literal("201"), z.number().int()]),
  })
  .strict();

export type ServiceSubscribeResponse = z.infer<
  typeof ServiceSubscribeResponseSchema
>;

/** =========================
 *  Service Charges (calculation only)
 *  POST /secure/retailer/service-charges
 *  ========================= */
export const ServiceChargesBodySchema = z
  .object({
    service_id: z.string().uuid(),
    reference_id: z.union([z.string(), z.number()]),
    txn_amount: z.number(),
    // optional (occasionally used by provider)
    bbps_category_id: z.string().min(1).optional(),
  })
  .strict();

export type ServiceChargesBody = z.infer<typeof ServiceChargesBodySchema>;

export const ServiceChargesDataSchema = z
  .object({
    service_id: z.string().uuid(),
    charge_id: z.string().uuid(),
    user_id: z.string().uuid(),
    reference_id: z.union([z.string(), z.number()]),
    // sample shows "None" (string) — keep as string
    bbps_category_id: z.string(),
    role: z.string().min(1),

    txn_amount: z.number(),
    gst_percent: z.number(),
    is_gst_inclusive: z.boolean(),

    daily_limit: z.number(),
    // provider typo: "montly_limit"; also allow the corrected "monthly_limit"
    montly_limit: z.number(),
    monthly_limit: z.number().optional(),

    net_amount: z.number(),
    charges: z.number(),
    gst_amount: z.number(),
    charges_incl: z.number(),
  })
  .strict();

export type ServiceChargesData = z.infer<typeof ServiceChargesDataSchema>;

export const ServiceChargesResponseSchema = z
  .object({
    status: StatusCodeSchema, // typically 200
    data: ServiceChargesDataSchema,
  })
  .strict();

export type ServiceChargesResponse = z.infer<typeof ServiceChargesResponseSchema>;
