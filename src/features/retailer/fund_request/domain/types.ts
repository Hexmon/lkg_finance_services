import { z } from "zod";

export const IfscDetailsSchema = z.object({
  bank: z.string(),
  city: z.string(),
  ifsc: z.string(),
  micr: z.number().int().nullable().optional(),
  nbin: z.number().int().nullable().optional(),
  state: z.string(),
  branch: z.string(),
  address: z.string(),
  category: z.string(),
  swift_code: z.string().nullable().optional(),
  ifsc_subcode: z.string().nullable().optional(),
});

export type IfscDetails = z.infer<typeof IfscDetailsSchema>;

export const CompanyBankAccountSchema = z
  .object({
    user_id: z.string().uuid(),
    account_type: z.string(),              // e.g., "SAVINGS"
    user_type: z.string(),                // e.g., "SUPER_ADMIN"
    bank_name: z.string(),
    branch_name: z.string(),
    last4: z.string(),
    account_id: z.string().uuid(),
    company_id: z.string().uuid(),
    account_holder_name: z.string(),
    ifsc_code: z.string(),
    utr: z.string().nullable().optional(),
    city: z.string(),
    ifsc_details: IfscDetailsSchema.optional(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
  })
  .strict();

export type CompanyBankAccount = z.infer<typeof CompanyBankAccountSchema>;

export const CompanyBankAccountsResponseSchema = z
  .object({
    status: z.union([z.number().int(), z.string()]),
    data: z.array(CompanyBankAccountSchema),
  })
  .strict();

export type CompanyBankAccountsResponse = z.infer<typeof CompanyBankAccountsResponseSchema>;
