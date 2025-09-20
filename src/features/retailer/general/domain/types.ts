/**
 * Retailer | General module — domain/types
 *
 * Endpoints covered:
 * - GET /secure/retailer/transaction_summary
 * - GET /secure/retailer/getDashboard
 *
 * Notes:
 * - Dashboard: we strongly type known fields, but keep `.passthrough()` at the top
 *   level to tolerate provider-specific extras.
 */

import { z } from "zod";

/** ---------- JSON helpers (recursive, no any) ---------- */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[];

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonSchema),
    z.record(z.string(), JsonSchema),
  ])
);

/** ---------- NumberLike (accepts numbers or numeric strings) ---------- */
export const NumberLike = z.union([
  z.number(),
  z.string().transform((s) => Number(s)).pipe(z.number()),
]);

/** ---------- Normalizers for quirky upstream values ---------- */
// Treat "None" or undefined as null
const noneToNull = (v: unknown) => (v === "None" || v === undefined ? null : v);

// UUID | null, but also accept "None" (→ null)
const uuidOrNullFromNone = z.preprocess(
  noneToNull,
  z.union([z.string().uuid(), z.null()])
);

// string | number | null, but also accept "None" (→ null)
const strNumOrNullFromNone = z.preprocess(
  noneToNull,
  z.union([z.string(), z.number(), z.null()])
);

/** =====================================================================
 *  Transaction Summary
 * ====================================================================*/

/** Query params */
export const TransactionSummaryQuerySchema = z
  .object({
    page: z.number().int().positive().optional(),      // default 1
    per_page: z.number().int().positive().optional(),  // default 10
    order: z.enum(["asc", "desc"]).optional(),         // default desc
    sort_by: z.string().min(1).optional(),             // default created_at
  })
  .strict();

export type TransactionSummaryQuery = z.infer<
  typeof TransactionSummaryQuerySchema
>;

/** Nested charge summary (when present) */
export const TxnChargeSummarySchema = z
  .object({
    service_id: z.string().uuid(),
    charge_id: z.string().uuid().nullable(),

    // CHANGED: accept "None" → null, or a UUID
    bbps_category_id: uuidOrNullFromNone,

    user_id: z.string().uuid(),

    // CHANGED: accept string | number | null and normalize "None" → null
    reference_id: strNumOrNullFromNone,

    role: z.string().min(1),
    category: z.string(), // may be empty string
    txn_amount: z.number(),
    net_amount: z.number(),
    is_gst_inclusive: z.boolean(),

    // NEW: tolerate upstream extras
    daily_limit: z.number().optional(),
    montly_limit: z.number().optional(), // keep API's typo to match payload

    gst_amount: z.number(),
    gst_percent: z.number(),
    base_charges: z.number(),
    charges_incl: z.number(),
  })
  .strict();

export type TxnChargeSummary = z.infer<typeof TxnChargeSummarySchema>;

/** Revenue breakdown item (when present) */
export const TxnRevenueItemSchema = z
  .object({
    user_id: z.string().uuid(),
    service_id: z.string().uuid(),

    // CHANGED: normalize "None" → null
    reference_id: strNumOrNullFromNone,

    role: z.string().min(1),
    admin_revenue: z.number(),
    tds_collected: z.number(),
    gst_collected: z.number(),

    // CHANGED: optional because it may be absent
    txn_id: z.string().min(1).optional(),
  })
  .strict();

export type TxnRevenueItem = z.infer<typeof TxnRevenueItemSchema>;

/** Transaction summary row */
export const TransactionSummaryItemSchema = z
  .object({
    name: z.string().min(1),
    registered_name: z.string().min(1),
    user_type: z.string().min(1),
    api_partner: z.string().min(1).optional(),
    service: z.string().min(1).optional(),

    id: z.string().uuid(),
    txn_id: z.string().min(1),
    service_id: z.string().uuid().nullable(),
    user_id: z.string().uuid(),

    // ✅ Matches API (may be null or absent)
    customer_id: z.string().uuid().nullable().optional(),

    wallet_id: z.string().uuid(),
    txn_type: z.string().min(1),
    txn_status: z.string().min(1),
    txn_reference_id: z.union([z.string(), z.number()]).nullable(),

    txn_amount: z.number(),
    net_amount: z.number(),
    txn_fees: z.number(),
    sender_id: z.string().uuid().nullable(),
    beneficiary_id: z.string().uuid().nullable(),
    txn_tax: z.number(),

    charges: TxnChargeSummarySchema.nullable(),
    commission: z.unknown().nullable(),
    revenue: z.array(TxnRevenueItemSchema).nullable(),

    mode: z.string().min(1),
    txn_subtype: z.string().min(1),
    txn_metadata: z.union([JsonSchema, z.null()]).optional(),

    created_at: z.string().min(1),
    updated_at: z.string().min(1),
  })
  .strict();

export type TransactionSummaryItem = z.infer<
  typeof TransactionSummaryItemSchema
>;

/** Paged response */
export const TransactionSummaryResponseSchema = z
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
    data: z.array(TransactionSummaryItemSchema),
  })
  .strict();

export type TransactionSummaryResponse = z.infer<
  typeof TransactionSummaryResponseSchema
>;

/** =====================================================================
 *  Dashboard Details (strong fields + tolerant to extras)
 * ====================================================================*/

/** Quick Links */
export const QuickLinkMetaSchema = z
  .object({
    id: z.string().uuid(),
    display: z.string(),
    icon: z.string(), // allow URLs or data URIs
    route: z.string(),
    order: z.number().int(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
  })
  .strict();

export const QuickLinkSchema = z
  .object({
    meta: QuickLinkMetaSchema,
    category_id: z.string().uuid(),
    name: z.string(),
    description: z.string(), // may be ""
    created_at: z.string(),
    updated_at: z.string().nullable(),
  })
  .strict();

/** Transactions block */
// Base stats (no last_month_ratio)
const TxnStatsSchema = z
  .object({
    total_count: NumberLike,
    ratio: NumberLike,
    growth: NumberLike,
  })
  .strict();

// Stats that include last_month_ratio (for total_transaction only)
const TxnStatsWithLastMonthRatioSchema = TxnStatsSchema.extend({
  last_month_ratio: NumberLike,
}).strict();

export const TransactionsBlockSchema = z
  .object({
    success_rate: NumberLike,
    success_rate_ratio: NumberLike,
    growth: NumberLike,
    // 🔧 API sends last_month_ratio only here
    total_transaction: TxnStatsWithLastMonthRatioSchema,
    overall_transaction: TxnStatsSchema,
  })
  .strict();

/** Virtual account & Commissions */
export const VirtualAccountSchema = z
  .object({
    vba_account_number: z.string(),
    vba_ifsc: z.string(),
  })
  .strict();

export const CommissionsSchema = z
  .object({
    overall: NumberLike,
    overall_ratio: NumberLike,
    current_month: NumberLike,
    current_month_ratio: NumberLike,
    last_month: NumberLike,
  })
  .strict();

export const CustomersSchema = z
  .object({
    total_users_count: z.number(),
    last_month_count: z.number(),
    last_month_ratio: z.number(),
  })
  .strict();

/** Final dashboard response */
export const DashboardDetailsResponseSchema = z
  .object({
    quick_links: z.array(QuickLinkSchema),
    user_id: z.string().uuid(),
    name: z.string(),
    // 🔧 more tolerant: base64/URL or null/absent
    profile: z.string().min(1).nullable().optional(),
    username: z.string(),
    balances: z.record(z.string(), NumberLike), // dynamic keys: MAIN, AEPS, etc.
    transactions: TransactionsBlockSchema,
    virtual_account: VirtualAccountSchema,
    commissions: CommissionsSchema,
    customers: CustomersSchema,
  })
  .passthrough(); // keep tolerant to extra vendor fields

export type DashboardDetailsResponse = z.infer<
  typeof DashboardDetailsResponseSchema
>;
