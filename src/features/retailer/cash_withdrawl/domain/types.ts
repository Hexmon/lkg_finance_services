import { z } from 'zod';

/* ===================================================== */
/*        AEPS: Check Service Authentication (POST)       */
/* Upstream: /secure/paypoint/aeps/check_authentication   */
/* ===================================================== */

/**
 * Docs say both fields required, but examples often omit service_id.
 * Be resilient: require user_id; allow optional service_id.
 */
export const AEPSCheckAuthRequestSchema = z
  .object({
    user_id: z.string().min(1, 'user_id is required'),
    service_id: z.string().uuid().optional(),
  })
  .strict();

export type AEPSCheckAuthRequest = z.infer<typeof AEPSCheckAuthRequestSchema>;

/** Coercions/helpers for provider variability */
const boolLike = z.union([z.boolean(), z.string(), z.number()]).transform((v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  const s = v.toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
});

const numberLike = z.union([z.number(), z.string()]).transform((v) => {
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : (undefined as unknown as number);
});

/**
 * Minimal sample:
 * {
 *   "ResponseStatus": "true",
 *   "ResponseDescription": "Success."
 * }
 *
 * Docs mention these useful fields for activation logic:
 * - Operator
 * - agentid
 * - isapproved
 * - comments
 * Keep schema permissive and normalize common types.
 */
export const AEPSCheckAuthResponseSchema = z
  .object({
    // Normalize "true"/"false"/1/0 to boolean
    ResponseStatus: z.union([z.boolean(), z.string(), z.number()]).transform((v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'number') return v !== 0;
      const s = v.toLowerCase();
      return s === 'true' || s === '1' || s === 'yes';
    }),
    ResponseDescription: z.string().optional(),

    // Often present in richer responses
    Operator: z.string().optional(),
    agentid: z.union([z.string(), z.number()]).optional(),
    isapproved: boolLike.optional(),
    comments: z.string().optional(),
  })
  .passthrough();

export type AEPSCheckAuthResponse = z.infer<typeof AEPSCheckAuthResponseSchema>;

/* =============================================== */
/*     AEPS: Two-Factor Authentication (POST)      */
/* Upstream: /secure/paypoint/aeps/two_factor_authentication */
/* =============================================== */

/** lat~lng like "12.252~45.521" (allow +/- and decimals) */
const latLngTilde = z
  .string()
  .regex(
    /^-?\d+(\.\d+)?~-?\d+(\.\d+)?$/,
    'latlng must be "lat~lng" (e.g., "12.252~45.521")'
  );

/** base64-ish check (loose on padding) */
const base64Loose = z
  .string()
  .regex(/^[A-Za-z0-9+/=]+$/, 'biometric_data must be base64 string');

/**
 * Docs say user_id & service_id are required; example sometimes omits service_id.
 * Be resilient: require user_id; keep service_id optional UUID.
 */
export const AEPSTwoFactorAuthRequestSchema = z
  .object({
    user_id: z.string().min(1, 'user_id is required'),
    service_id: z.string().uuid().optional(),
    aadhaar_number: z
      .string()
      .regex(/^\d{12}$/, 'aadhaar_number must be 12 digits'),
    latlng: latLngTilde,
    biometric_data: base64Loose,
  })
  .strict();

export type AEPSTwoFactorAuthRequest = z.infer<typeof AEPSTwoFactorAuthRequestSchema>;

/**
 * Minimal sample from docs:
 * {
 *   "ResponseStatus": "true",
 *   "ResponseDescription": "Authentication Success"
 * }
 * Keep permissive for any extra fields.
 */
export const AEPSTwoFactorAuthResponseSchema = z
  .object({
    ResponseStatus: boolLike,
    ResponseDescription: z.string().optional(),
  })
  .passthrough();

export type AEPSTwoFactorAuthResponse = z.infer<typeof AEPSTwoFactorAuthResponseSchema>;

/* ========================================= */
/*            AEPS: Transaction (POST)       */
/* Upstream: /secure/paypoint/aeps/aeps_transaction */
/* ========================================= */

const indianMobile10 = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'cust_mobile must be 10-digit Indian number');

const aadhaar12 = z
  .string()
  .regex(/^\d{12}$/, 'aadhaar_number must be 12 digits');

/**
 * Provider accepts either:
 * - transaction_type: "CASH_WITHDRAWAL" | "BALANCE_ENQUIRY" | "MINI_STATEMENT"
 *   OR
 * - request_type: "W" | "B" | "M"  (as seen in examples)
 *
 * We accept both, but require at least one, and normalize rules with refinement.
 */
const TransactionTypeEnum = z.enum(['CASH_WITHDRAWAL', 'BALANCE_ENQUIRY', 'MINI_STATEMENT']);
const RequestTypeEnum = z.enum(['W', 'B', 'M']);

export const AEPSTransactionRequestSchema = z
  .object({
    user_id: z.string().min(1, 'user_id is required'),
    // Docs say required but examples omit; keep optional for resiliency
    service_id: z.string().uuid().optional(),

    // Bank identifier variants
    iin: z.string().regex(/^\d{6}$/, 'iin must be 6 digits').optional(),
    bank_id: z.string().min(1).optional(), // accept as-is if provider uses this key

    // Transaction type variants
    transaction_type: TransactionTypeEnum.optional(),
    request_type: RequestTypeEnum.optional(),

    aadhaar_number: aadhaar12,
    biometric_data: base64Loose,
    cust_mobile: indianMobile10.optional(),
    amount: z.number().positive().optional(), // required only for withdrawal
    latlng: latLngTilde,
  })
  .strict()
  .refine(
    (o) => !!(o.transaction_type || o.request_type),
    { path: ['transaction_type'], message: 'transaction_type or request_type is required' }
  )
  .refine(
    (o) => {
      // If any form means withdrawal, ensure amount present
      const isWithdrawal =
        o.request_type === 'W' || o.transaction_type === 'CASH_WITHDRAWAL';
      return !isWithdrawal || typeof o.amount === 'number';
    },
    { path: ['amount'], message: 'amount is required for cash withdrawal' }
  );

export type AEPSTransactionRequest = z.infer<typeof AEPSTransactionRequestSchema>;

/** Minimal example response; keep permissive for provider extras */
export const AEPSTransactionResponseSchema = z
  .object({
    message: z.string().optional(),
    transaction_id: z.string().optional(),
    status: z.union([z.number().int(), z.string()]).transform((s) => Number(s)).optional(),
  })
  .passthrough();

export type AEPSTransactionResponse = z.infer<typeof AEPSTransactionResponseSchema>;

/* ========================================= */
/*            AEPS: Bank List (GET)          */
/* Upstream: /secure/paypoint/aeps/banklist  */
/* ========================================= */

/** Query schema: service_id required */
export const AEPSBankListQuerySchema = z
  .object({
    service_id: z.string().uuid({ message: 'service_id must be a UUID' }),
  })
  .strict();

export type AEPSBankListQuery = z.infer<typeof AEPSBankListQuerySchema>;

/**
 * Sample entries include keys with spaces & dots (e.g., "Sr. No.", "Bank Code").
 * We keep those keys verbatim to match the provider and avoid lossy mapping.
 */
export const AEPSBankListItemSchema = z
  .object({
    'Sr. No.': numberLike.optional(),
    'Bank Code': z.string().optional(),
    'Bank Name': z.string().optional(),
    MICR: numberLike.optional(),
    IFSC: z.string().optional(),
    IIN: numberLike.optional(),
    'ACH CR': z.string().optional(), // "Yes" / "No"
    'ACH DR': z.string().optional(),
    APBS: z.string().optional(),
    DSA: z.string().optional(),
    'Bank Type': z.string().optional(), // "Direct" / "Indirect"
  })
  .passthrough();

export type AEPSBankListItem = z.infer<typeof AEPSBankListItemSchema>;

export const AEPSBankListResponseSchema = z
  .object({
    status: z.union([z.number().int(), z.string().regex(/^\d+$/)]).transform((s) => Number(s)),
    bankList: z.array(AEPSBankListItemSchema),
  })
  .passthrough();

export type AEPSBankListResponse = z.infer<typeof AEPSBankListResponseSchema>;
