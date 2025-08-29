import { z } from 'zod';

/** ---------- Login (API Key) ---------- */
export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/** Backend guarantees a token on success; allow extra fields via passthrough */
export const LoginResponseSchema = z.object({
  token: z.string(),
}).passthrough();
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/** ---------- Change Password (Bearer) ---------- */
export const ChangePasswordRequestSchema = z.object({
  oldpassword: z.string().min(1),
  password: z.string().min(8),
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

/** ---------- Reset Password (initiate; API Key) ---------- */
export const ResetPasswordRequestSchema = z.object({
  user_id: z.string().min(1),
  // Always "password_reset" per spec
  purpose: z.literal('password_reset'),
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const ResetPasswordResponseSchema = z.object({
  message: z.string(),
  ref_id: z.union([z.number(), z.string()]),
  otp_code: z.string().optional(), // UAT-only convenience
  status: z.union([z.string(), z.number()]),
});
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;

/** ---------- Verify OTP + Set New Password (API Key) ---------- */
export const VerifyOtpPasswordRequestSchema = z.object({
  ref_id: z.coerce.string().min(1),
  user_id: z.string().min(1),
  password: z.string().min(8),
  otp: z.string().min(1),
});
export type VerifyOtpPasswordRequest = z.infer<typeof VerifyOtpPasswordRequestSchema>;

export const VerifyOtpPasswordResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
});
export type VerifyOtpPasswordResponse = z.infer<typeof VerifyOtpPasswordResponseSchema>;

/** ---------- Forgot Username: Verify OTP (API Key) ---------- */
export const VerifyOtpUsernameRequestSchema = z.object({
  ref_id: z.coerce.string().min(1),
  type: z.enum(['mobile', 'email', 'both']),
  otp: z.string().min(1),
});
export type VerifyOtpUsernameRequest = z.infer<typeof VerifyOtpUsernameRequestSchema>;

export const VerifyOtpUsernameResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  usernames: z.array(z.string()).optional(),
  data: z
    .object({
      usernames: z.array(z.string()).optional(),
      username: z.string().optional(),
    })
    .optional(),
});
export type VerifyOtpUsernameResponse = z.infer<typeof VerifyOtpUsernameResponseSchema>;

/** ---------- Forgot Username: Initiate (API Key) ---------- */
export const ForgotUsernameInitiateRequestSchema = z.object({
  mobile: z.string().min(6), // backend validates precisely
  // Accept both cases; normalize to "USERNAME_FORGOT"
  purpose: z
    .union([z.literal('USERNAME_FORGOT'), z.literal('username_forgot')])
    .transform(() => 'USERNAME_FORGOT'),
  // Normalize to UPPER (e.g., "retailer" -> "RETAILER")
  user_type: z.string().min(1).transform((v) => v.toUpperCase()),
});
export type ForgotUsernameInitiateRequest = z.infer<typeof ForgotUsernameInitiateRequestSchema>;

export const ForgotUsernameInitiateResponseSchema = z.object({
  message: z.string(),
  ref_id: z.union([z.number(), z.string()]),
  otp_code: z.string().optional(),
  status: z.union([z.string(), z.number()]),
});
export type ForgotUsernameInitiateResponse = z.infer<typeof ForgotUsernameInitiateResponseSchema>;

/** ---------- Email OTP: Generate (Bearer + API Key optional) ---------- */
export const GenerateEmailOtpRequestSchema = z.object({
  email: z.string().email(),
  urn: z.preprocess(
    v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().trim().min(1).optional()
  ),

});
export type GenerateEmailOtpRequest = z.infer<typeof GenerateEmailOtpRequestSchema>;

export const GenerateEmailOtpResponseSchema = z.object({
  message: z.string(),
  ref_id: z.string(), // UAT shows UUID string
  status: z.union([z.number(), z.string()]),
  otp_code: z.string().optional(),
});
export type GenerateEmailOtpResponse = z.infer<typeof GenerateEmailOtpResponseSchema>;

/** ---------- Email OTP: Verify (Bearer + API Key optional) ---------- */
export const VerifyEmailOtpRequestSchema = z.object({
  ref_id: z.coerce.string().min(1),
  otp: z.string().min(1),
});
export type VerifyEmailOtpRequest = z.infer<typeof VerifyEmailOtpRequestSchema>;

export const VerifyEmailOtpResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  urn: z.string().optional(),
});
export type VerifyEmailOtpResponse = z.infer<typeof VerifyEmailOtpResponseSchema>;

/** ---------- Generic Mobile OTP: Send (API Key) ---------- */
export const SendOtpRequestSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  purpose: z.string().min(1).transform((v) => v.toUpperCase()),
  user_type: z.string().min(1).transform((v) => v.toUpperCase()),
});
export type SendOtpRequest = z.infer<typeof SendOtpRequestSchema>;

export const SendOtpResponseSchema = z.object({
  message: z.string(),
  ref_id: z.union([z.string(), z.number()]),
  status: z.union([z.number(), z.string()]),
  otp_code: z.string().optional(),
});
export type SendOtpResponse = z.infer<typeof SendOtpResponseSchema>;

/** ---------- Aadhaar OTP: Generate (API Key) ---------- */
export const AadhaarOtpGenerateRequestSchema = z.object({
  urn: z.string().min(1),
  aadhaar_number: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
});
export type AadhaarOtpGenerateRequest = z.infer<typeof AadhaarOtpGenerateRequestSchema>;

export const AadhaarOtpGenerateResponseSchema = z.object({
  ref_id: z.union([z.string(), z.number()]),
  status: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional().nullable(),
});
export type AadhaarOtpGenerateResponse = z.infer<typeof AadhaarOtpGenerateResponseSchema>;

/** ---------- Aadhaar OTP: Verify (API Key) ---------- */
export const AadhaarOtpVerifyRequestSchema = z.object({
  urn: z.string(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  ref_id: z.coerce.string().min(1),
});
export type AadhaarOtpVerifyRequest = z.infer<typeof AadhaarOtpVerifyRequestSchema>;

export const AadhaarOtpVerifyResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  urn: z.string().optional(),
  purpose: z.string().optional(),
});
export type AadhaarOtpVerifyResponse = z.infer<typeof AadhaarOtpVerifyResponseSchema>;

/** ---------- PAN Verify (API Key) ---------- */
export const PanVerifyRequestSchema = z.object({
  urn: z.string().min(1),
  // PAN: 5 letters, 4 digits, 1 letter; normalize to UPPER
  pan_number: z
    .string()
    .min(10)
    .transform((v) => v.toUpperCase())
    .refine((v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), {
      message: 'PAN must match pattern AAAAA9999A',
    }),
});
export type PanVerifyRequest = z.infer<typeof PanVerifyRequestSchema>;

export const PanPreviewDataSchema = z
  .object({
    urn: z.string().optional(),
    name_on_aadhaar: z.string().optional(),
    registered_name: z.string().optional(),
    type: z.string().optional(),
    address: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    name_match_score: z.number().optional(),
  })
  .passthrough();

export const PanVerifyResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  preview_data: PanPreviewDataSchema.optional(),
});
export type PanVerifyResponse = z.infer<typeof PanVerifyResponseSchema>;

/** ---------- Registration (Bearer) ---------- */
export const RegisterRequestSchema = z.object({
  urn: z.string().min(1),
  accepted_terms: z.literal(true),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = z.object({
  message: z.string(),
  user_id: z.string(),
  username: z.string(),
}).passthrough();
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

/** ---------- Device Verification: Send OTP (Bearer) ---------- */
export const SendDeviceOtpRequestSchema = z.object({
  user_id: z.string().min(1),
  // Accept both cases; normalize to BACKEND-expected upper
  purpose: z
    .union([z.literal('DEVICE_VERIFICATION'), z.literal('device_verification')])
    .transform(() => 'DEVICE_VERIFICATION'),
});
export type SendDeviceOtpRequest = z.infer<typeof SendDeviceOtpRequestSchema>;

export const SendDeviceOtpResponseSchema = z.object({
  message: z.string(),
  ref_id: z.union([z.number(), z.string()]),
  otp_code: z.string().optional(),
  status: z.union([z.string(), z.number()]),
});
export type SendDeviceOtpResponse = z.infer<typeof SendDeviceOtpResponseSchema>;

/** ---------- Account OTP: Verify (API Key) ---------- */
export const VerifyAccountOtpRequestSchema = z.object({
  ref_id: z.coerce.string().min(1),
  user_id: z.string().min(1),
  otp: z.string().min(1),
  // Docs mention password in some flows; keep it optional for compatibility
  password: z.string().min(1).optional(),
});
export type VerifyAccountOtpRequest = z.infer<typeof VerifyAccountOtpRequestSchema>;

export const VerifyAccountOtpResponseSchema = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  // Optional extras that backend may include
  purpose: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
});
export type VerifyAccountOtpResponse = z.infer<typeof VerifyAccountOtpResponseSchema>;
