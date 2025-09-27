import { z } from "zod";

/** ---------- Shared ---------- */
export const BankIfscDetailsSchema = z.object({
  bank: z.string(),
  city: z.string(),
  ifsc: z.string(),
  micr: z.number(),
  nbin: z.number(),
  state: z.string(),
  branch: z.string(),
  address: z.string(),
  category: z.string(),
  swift_code: z.string(),
  ifsc_subcode: z.string(),
});

export type BankIfscDetails = z.infer<typeof BankIfscDetailsSchema>;

export const BankAccountRecordSchema = z.object({
  user_id: z.string(),
  account_type: z.string(), // e.g., "SAVINGS"
  user_type: z.string(),    // "RETAILER"
  bank_name: z.string(),
  branch_name: z.string(),
  last4: z.string(),
  account_id: z.string(),
  company_id: z.string().nullable(),
  account_holder_name: z.string(),
  ifsc_code: z.string(),
  utr: z.string(),
  city: z.string(),
  ifsc_details: BankIfscDetailsSchema,
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});
export type BankAccountRecord = z.infer<typeof BankAccountRecordSchema>;

/** ---------- GET ---------- */
export const GetBankAccountsResponseSchema = z.object({
  status: z.union([z.number(), z.string()]),
  data: z.array(BankAccountRecordSchema),
});
export type GetBankAccountsResponse = z.infer<typeof GetBankAccountsResponseSchema>;

/** ---------- POST (Create) ---------- */
export const AddBankAccountRequestSchema = z.object({
  account_number: z.string().min(6),
  account_holder_name: z.string().min(1),
  account_type: z.string().min(1), // or z.enum(['SAVINGS','CURRENT']) if desired
  ifsc_code: z.string().min(4),
}).strict();
export type AddBankAccountRequest = z.infer<typeof AddBankAccountRequestSchema>;

export const AddBankAccountResponseSchema = z.object({
  data: BankAccountRecordSchema,
  status: z.union([z.number(), z.string()]),
});
export type AddBankAccountResponse = z.infer<typeof AddBankAccountResponseSchema>;

/** ---------- DELETE ---------- */
export const DeleteBankAccountResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.number(), z.string()]),
});
export type DeleteBankAccountResponse = z.infer<typeof DeleteBankAccountResponseSchema>;
