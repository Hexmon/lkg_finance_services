import { z } from 'zod';

/* ============================= */
/*       Verify IFSC (POST)      */
/* ============================= */

/** Request: require a valid IFSC format (e.g., HDFC0000001). */
export const VerifyIfscRequestSchema = z.object({
  ifsc_code: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC (e.g., HDFC0000001)'),
});
export type VerifyIfscRequest = z.infer<typeof VerifyIfscRequestSchema>;

/**
 * Provider's response sample (kept flexible):
 * {
 *   "success": true,
 *   "status_code": 200,
 *   "data": {
 *     "verification_id": "test_verification_id",
 *     "reference_id": "1653",
 *     "status": "VALID",
 *     "bank": "Bank Name",
 *     "ifsc": "HDFC0000001",
 *     "neft": "Live",
 *     "imps": "Live",
 *     "rtgs": "Live",
 *     "upi": "Live",
 *     "ft": "Live",
 *     "card": "Live",
 *     "micr": 560751026,
 *     "nbin": 1234,
 *     "address": "...",
 *     "city": "BANGALORE",
 *     "state": "KARNATAKA",
 *     "branch": "BANGALORE - ...",
 *     "ifsc_subcode": "HDFC0",
 *     "category": "DIRECT_MEMBER",
 *     "swift_code": "HDFCINBB"
 *   }
 * }
 */

// Allow strings like "Live" / "Not Live" / etc.
const liveFlagSchema = z.string();

// Keep numeric-ish fields permissive; some providers send strings.
const numberLike = z.union([z.number(), z.string()]).optional();

export const VerifyIfscDataSchema = z
  .object({
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
    micr: numberLike, // may be number or string
    nbin: numberLike,
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    branch: z.string().optional(),
    ifsc_subcode: z.string().optional(),
    category: z.string().optional(),
    swift_code: z.string().optional(),
  })
  .passthrough(); // accept any extra fields the provider might add

export const VerifyIfscResponseSchema = z
  .object({
    success: z.boolean(),
    status_code: z.number(),
    data: VerifyIfscDataSchema,
  })
  .passthrough();

export type VerifyIfscData = z.infer<typeof VerifyIfscDataSchema>;
export type VerifyIfscResponse = z.infer<typeof VerifyIfscResponseSchema>;
