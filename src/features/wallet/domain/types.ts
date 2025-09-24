// src/features/wallet/domain/types.ts
import { z } from "zod";

/** ---------- Query (UI -> BFF) ---------- */
export const WalletStatementQuerySchema = z.object({
  per_page: z.coerce.number().int().min(1).default(10),
  page: z.coerce.number().int().min(1).default(1),
  order: z.enum(["asc", "desc"]).default("desc"),
  sort_by: z.string().default("created_at"),
});

export type WalletStatementQuery = z.infer<typeof WalletStatementQuerySchema>;

/** ---------- Upstream item ---------- */
export const WalletStatementItemSchema = z.object({
  registered_name: z.string(),
  wallet_name: z.string(),
  wallet_description: z.string(),
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  txn_id: z.string(),
  balance_id: z.string().uuid(),
  wallet_id: z.string().uuid(),
  balance: z.number(),
  subtype: z.enum(["CR", "DR"]),
  txn_type: z.string(),           // e.g. "AEPS" | "DMT" | "COMMISSION"
  txn_status: z.string(),         // e.g. "SUCCESS"
  remark: z.string(),
  last_balance: z.number(),
  current_balance: z.number(),
  created_at: z.string(),         // ISO
});

/** ---------- Upstream response ---------- */
export const WalletStatementResponseSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  per_page: z.number().int(),
  pages: z.number().int(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
  next_page: z.number().int().nullable(),
  prev_page: z.number().int().nullable(),
  sort_by: z.string(),
  data: z.array(WalletStatementItemSchema),
});

export type WalletStatementItem = z.infer<typeof WalletStatementItemSchema>;
export type WalletStatementResponse = z.infer<typeof WalletStatementResponseSchema>;

// payout 
// Request: accept number or string, normalize to string; mode strict to IMPS/NEFT (uppercase)
export const PayoutRequestSchema = z.object({
  account_id: z.string().min(1),
  mode: z.enum(['IMPS', 'NEFT']).transform((v) => v.toUpperCase() as 'IMPS' | 'NEFT'),
  amount: z.union([z.string(), z.number()]).transform((v) => String(v)),
});
export type PayoutRequest = z.infer<typeof PayoutRequestSchema>;

// Response "data" (based on your sample)
export const PayoutBeneficiaryInstrumentDetailsSchema = z
  .object({
    bank_account_number: z.string(),
    bank_ifsc: z.string(),
  })
  .passthrough();

export const PayoutBeneficiaryDetailsSchema = z
  .object({
    beneficiary_id: z.string(),
    beneficiary_instrument_details: PayoutBeneficiaryInstrumentDetailsSchema,
  })
  .passthrough();

export const PayoutDataSchema = z
  .object({
    added_on: z.string(),
    beneficiary_details: PayoutBeneficiaryDetailsSchema,
    cf_transfer_id: z.string(),
    fundsource_id: z.string(),
    status: z.string(),
    status_code: z.string(),
    status_description: z.string(),
    transfer_amount: z.number(),
    transfer_id: z.string(),
    transfer_mode: z.string(),
    transfer_service_charge: z.number(),
    transfer_service_tax: z.number(),
    transfer_utr: z.string(),
    updated_on: z.string(),
  })
  .passthrough();

export const PayoutResponseSchema = z
  .object({
    status: z.union([z.string(), z.number()]),
    message: z.string().optional(),
    data: PayoutDataSchema,
  })
  .passthrough();

export type PayoutData = z.infer<typeof PayoutDataSchema>;
export type PayoutResponse = z.infer<typeof PayoutResponseSchema>;
