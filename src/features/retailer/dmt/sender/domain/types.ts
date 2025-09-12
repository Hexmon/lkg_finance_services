// src/features/retailer/dmt/sender/domain/types.ts
import { z } from 'zod';

/** ------------ Check Sender: Request schema ------------ */
export const CheckSenderBodySchema = z
  .object({
    mobile_no: z
      .string()
      .regex(/^\d{10}$/, 'mobile_no must be a 10-digit number'),
    txnType: z.string().min(1).optional(), // Only for BillAvenue
    bankId: z.string().min(1).optional(),  // Only for BillAvenue
    service_id: z.string().uuid(),         // DMT service id
  })
  .strict();

export type CheckSenderBody = z.infer<typeof CheckSenderBodySchema>;

/** ------------ Check Sender: Response schemas (kept reasonably loose) ------------ */
export const BeneficiarySchema = z
  .object({
    beneficiary_id: z.string().uuid(),
    lastfour: z.string().min(1),
    bankname: z.string().min(1),
    b_name: z.string().min(1),
    b_mobile: z.string().min(1),
    status: z.string().min(1),
  })
  .strict();

export type Beneficiary = z.infer<typeof BeneficiarySchema>;

export const SenderSchema = z
  .object({
    sender_id: z.string().uuid(),
    sender_name: z.string().min(1),
    mobile_no: z.string().min(1),
    email_address: z.string().optional(),
    pincode: z.string().optional(),
    beneficiary_count: z.number().optional(),
  })
  .strict();

export type Sender = z.infer<typeof SenderSchema>;

export const CheckSenderResponseSchema = z
  .object({
    message: z.string().optional(),
    sender: SenderSchema.optional(),
    beneficiaries: z.array(BeneficiarySchema).optional(),
  })
  // allow any extra fields provider may send
  .passthrough();

export type CheckSenderResponse = z.infer<typeof CheckSenderResponseSchema>;

/* ========================================================================== */
/*                     Verify OTP & Onboard Sender (POST)                     */
/*    Upstream: /secure/retailer/verify-otp-onboard-sender  (Retailer UAT)    */
/* ========================================================================== */

/**
 * Docs list some fields as required (mobile_no, service_id), but examples omit them.
 * To be resilient:
 *  - ref_id: required
 *  - otp: required
 *  - others: optional
 */
export const VerifyOtpOnboardSenderRequestSchema = z
  .object({
    mobile_no: z.string().min(1).optional(),
    ref_id: z.string().min(1),
    otp: z.string().min(1),
    sender_name: z.string().min(1).optional(),
    email_address: z.string().email().optional(),
    pincode: z.string().min(1).optional(),
    aadharNumber: z.string().min(1).optional(),
    bioPid: z.string().min(1).optional(),
    service_id: z.string().uuid().optional(),
  })
  .strict();

export type VerifyOtpOnboardSenderRequest = z.infer<
  typeof VerifyOtpOnboardSenderRequestSchema
>;

/**
 * Beneficiaries in onboard response: examples show empty array.
 * Keep permissive to avoid breaking on future additions.
 * (Separate from the stricter `BeneficiarySchema` used in Check Sender.)
 */
export const OnboardBeneficiarySchema = z.unknown();
export type OnboardBeneficiary = z.infer<typeof OnboardBeneficiarySchema>;

/**
 * Response uses your existing SenderSchema.
 * Allow passthrough for any extra fields the provider may include.
 */
export const VerifyOtpOnboardSenderResponseSchema = z
  .object({
    message: z.string(),
    sender_id: z.string().uuid(),
    sender: SenderSchema,
    beneficiaries: z.array(OnboardBeneficiarySchema),
    status: z.union([z.number().int(), z.string()]).transform((s) => Number(s)),
  })
  .passthrough();

export type VerifyOtpOnboardSenderResponse = z.infer<
  typeof VerifyOtpOnboardSenderResponseSchema
>;

/* ========================================================================== */
/*                             Add Sender (POST)                               */
/*    Upstream: /secure/retailer/addSender  (Retailer UAT)                     */
/* ========================================================================== */

/** Request schema — based on docs; required/optional as specified. */ // NEW
export const AddSenderRequestSchema = z
  .object({
    mobile_no: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
    service_id: z.string().uuid(),
    sender_name: z.string().min(1),
    pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
    // Optional fields
    txnType: z.string().min(1).optional(),     // BillAvenue only
    bankId: z.string().min(1).optional(),      // BillAvenue only
    email_address: z.string().email().optional(),
    aadharNumber: z.string().min(1).optional(), // ARTL only (per notes)
    bioPid: z.string().optional(),
    address: z.string().optional(),             // UI collects it; upstream may ignore
  })
  .strict();

export type AddSenderRequest = z.infer<typeof AddSenderRequestSchema>; // NEW

/** Response schema — matches your sample exactly, with safe coercions. */ // NEW
export const AddSenderResponseSchema = z
  .object({
    message: z.string(),
    ref_id: z.string().uuid(), // upstream looks like a UUID in your sample
    otp_code: z.string(),       // keep string; do not coerce to number to preserve leading zeros
    status: z.union([z.number().int(), z.string()]).transform((s) => Number(s)),
    aadhaar_required: z.boolean(),
    bio_required: z.boolean(),
  })
  .passthrough();

export type AddSenderResponse = z.infer<typeof AddSenderResponseSchema>; 