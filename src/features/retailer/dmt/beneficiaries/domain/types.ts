import { z } from 'zod';

/* ============================= */
/*       Verify IFSC (POST)      */
/* ============================= */

export const VerifyIfscRequestSchema = z.object({
  ifsc_code: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC (e.g., HDFC0000001)'),
});
export type VerifyIfscRequest = z.infer<typeof VerifyIfscRequestSchema>;

// Allow strings like "Live" / "Not Live" / etc.
const liveFlagSchema = z.string();
// Numeric-ish fields may come as numbers or strings
const numberLike = z.union([z.number(), z.string()]).optional();

export const VerifyIfscDataSchema = z.object({
  verification_id: z.string().optional(),
  reference_id: z.string().optional(),
  status: z.string().optional(), // e.g., VALID / INVALID
  bank: z.string().optional(),
  ifsc: z.string().optional(),
  neft: liveFlagSchema.optional(),
  imps: liveFlagSchema.optional(),
  rtgs: liveFlagSchema.optional(),
  upi: liveFlagSchema.optional(),
  ft: liveFlagSchema.optional(),
  card: liveFlagSchema.optional(),
  micr: numberLike,
  nbin: numberLike,
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  branch: z.string().optional(),
  ifsc_subcode: z.string().optional(),
  category: z.string().optional(),
  swift_code: z.string().optional(),
}).passthrough();

/** Upstream shape A (matches the sample provided) */
const VerifyIfscEnvelopeA = z.object({
  success: z.boolean(),
  status_code: z.number(),
  data: VerifyIfscDataSchema,
}).passthrough();

/** Upstream shape B (some retailer endpoints return { status, data }) */
const VerifyIfscEnvelopeB = z.object({
  status: z.union([z.number(), z.string().regex(/^\d+$/)]),
  data: VerifyIfscDataSchema,
}).passthrough();

/** Accept either envelope and normalize to: { success: boolean, status_code: number, data } */
export const VerifyIfscResponseSchema = z
  .union([VerifyIfscEnvelopeA, VerifyIfscEnvelopeB])
  .transform((res) => {
    const status_code: number =
      'status_code' in res
        ? Number((res as any).status_code)
        : Number((res as any).status);

    const success: boolean =
      'success' in res
        ? Boolean((res as any).success)
        : status_code >= 200 && status_code < 400;

    return {
      success,
      status_code,
      data: (res as any).data,
    };
  });


export type VerifyIfscData = z.infer<typeof VerifyIfscDataSchema>;
export type VerifyIfscResponse = z.infer<typeof VerifyIfscResponseSchema>;

/* ======================================== */
/*     Add Beneficiary (no penny drop)      */
/* Upstream: /secure/retailer/add_beneficiary */
/* ======================================== */

const Mobile10 = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number');
const IFSC = z
  .string()
  .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter valid IFSC (e.g., HDFC0000001)');
const YnFlag = z.enum(['Y', 'N']);

export const AddBeneficiaryRequestSchema = z
  .object({
    sender_id: z.string().min(1, 'sender_id is required'),
    bank_id: z.string().min(1).optional(), // Paypoint only (optional)
    b_mobile: Mobile10,
    b_name: z.string().min(1),
    bank_code: z.string().min(1).optional(), // Bill Avenue only (optional)
    b_account_number: z.string().min(1),
    ifsc_code: IFSC,
    address: z.string().min(1),
    lat: z.string().optional(), // Paypoint only (optional)
    lng: z.string().optional(), // Paypoint only (optional)
    bankname: z.string().min(1),
    service_id: z.string().uuid({ message: 'service_id must be a UUID' }),
    account_verification: YnFlag, // "Y" | "N"
  })
  .strict();

export type AddBeneficiaryRequest = z.infer<
  typeof AddBeneficiaryRequestSchema
>;

/** Example response:
 * {
 *   "message": "Beneficiary added successfully",
 *   "beneficiary_id": "c562fdd8-aa9d-4579-b442-aec6257b01ca",
 *   "status": 201
 * }
 */
export const AddBeneficiaryResponseSchema = z
  .object({
    message: z.string().optional(),
    beneficiary_id: z.string().uuid().optional(),
    status: z
      .union([z.number().int(), z.string().regex(/^\d+$/)])
      .transform((s) => Number(s)),
  })
  .passthrough();

export type AddBeneficiaryResponse = z.infer<
  typeof AddBeneficiaryResponseSchema
>;
