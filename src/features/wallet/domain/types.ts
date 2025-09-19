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
