import { z } from 'zod';

/* ============================================ */
/*         Wallet: Get Wallet Statement (GET)   */
/* Upstream: /secure/retailer/get-wallet-statement/ */
/* ============================================ */

/** Query schema — balance_id required; rest optional/paginated */
export const WalletStatementQuerySchema = z
    .object({
        balance_id: z.string().uuid({ message: 'balance_id must be a UUID' }),
        per_page: z.number().int().positive().optional(),
        page: z.number().int().positive().optional(),
        order: z.enum(['asc', 'desc']).optional(),
        sort_by: z.string().min(1).optional(),
        user_id: z.string().min(1).optional(),
        txn_type: z.string().min(1).optional(),
        status: z.string().min(1).optional(),
        start_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be YYYY-MM-DD')
            .optional(),
        end_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be YYYY-MM-DD')
            .optional(),
    })
    .strict();

export type WalletStatementQuery = z.infer<typeof WalletStatementQuerySchema>;

/** Transaction row */
export const WalletTransactionSchema = z
    .object({
        transaction_id: z.string().uuid(),
        transaction_type: z.string(), // e.g., WALLET_DEBIT / WALLET_CREDIT
        amount: z.number(),
        last_balance: z.number(),
        current_balance: z.number(),
        timestamp: z.string(), // ISO date-time string (keep as string)
    })
    .passthrough();

export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;

export const WalletStatementResponseSchema = z
    .object({
        message: z.string().optional(),
        balance_id: z.string().uuid(),
        transactions: z.array(WalletTransactionSchema),
        status: z.union([z.number(), z.string().regex(/^\d+$/)]).transform((s) => Number(s)),
    })
    .passthrough();

export type WalletStatementResponse = z.infer<typeof WalletStatementResponseSchema>;

/**
 * Wallet Balance — Response Schema
 * - Normalize `status` to a number (handles "200" | 200)
 * - Allow `balance` as number or numeric string, transform to number
 * - Keep passthrough to tolerate extra upstream fields
 */
export const WalletBalanceResponseSchema = z
  .object({
    message: z.string().optional(),
    balance_id: z.string().uuid(),
    wallet_type: z.enum(["MAIN", "COMMISSION"]).or(z.string()).transform((v) => v as "MAIN" | "COMMISSION"),
    currency: z.string().default("INR"),
    balance: z.union([z.number(), z.string()]).transform((v) => (typeof v === "string" ? Number(v) : v)),
    status: z.union([z.number(), z.string()]).transform((v) => (typeof v === "string" ? Number(v) : v)),
  })
  .passthrough();

export type WalletBalanceResponse = z.infer<typeof WalletBalanceResponseSchema>;

/** No path params required for this API */
export const WalletBalancePathParamsSchema = z.object({}).strict();
export type WalletBalancePathParams = z.infer<typeof WalletBalancePathParamsSchema>;

/** No query params required for this API */
export const WalletBalanceQuerySchema = z.object({}).strict();
export type WalletBalanceQuery = z.infer<typeof WalletBalanceQuerySchema>;

/** No request body for GET */
export const WalletBalanceRequestSchema = z.undefined();
export type WalletBalanceRequest = undefined;

/**
 * Commission Summary — Query Schema
 */
export const CommissionSummaryQuerySchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(100).default(10),
    order: z.enum(["asc", "desc"]).default("desc"),
    sort_by: z.string().default("created_at"),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    user_id: z.string().uuid().optional(),
  })
  .strict();

export type CommissionSummaryQuery = z.infer<typeof CommissionSummaryQuerySchema>;

/**
 * Commission Summary — Response Schema
 * - Keep `data` as unknown[] (will refine later)
 * - Normalize pagination numbers
 */
export const CommissionSummaryResponseSchema = z
  .object({
    total: z.union([z.number(), z.string()]).transform((v) => Number(v)),
    page: z.union([z.number(), z.string()]).transform((v) => Number(v)),
    per_page: z.union([z.number(), z.string()]).transform((v) => Number(v)),
    pages: z.union([z.number(), z.string()]).transform((v) => Number(v)),
    has_next: z.boolean(),
    has_prev: z.boolean(),
    next_page: z.union([z.number(), z.string(), z.null()]).nullable(),
    prev_page: z.union([z.number(), z.string(), z.null()]).nullable(),
    sort_by: z.string().optional(),
    data: z.array(z.unknown()),
  })
  .passthrough();

export type CommissionSummaryResponse = z.infer<typeof CommissionSummaryResponseSchema>;
