// src/features/retailer/dmt/fund-transfer/domain/types.ts
import { z } from 'zod';

/* ============================================= */
/*      DMT: Verify Fund Transfer OTP (POST)     */
/* Upstream: /secure/retailer/verify-transfer-otp */
/* ============================================= */

/** Request body */
export const VerifyTransferOtpRequestSchema = z
  .object({
    txn_id: z.string().min(1, 'txn_id is required'),
    otp: z.string().min(1, 'otp is required'),
    service_id: z.string().uuid({ message: 'service_id must be a UUID' }),
  })
  .strict();

export type VerifyTransferOtpRequest = z.infer<typeof VerifyTransferOtpRequestSchema>;

/**
 * Response schema — keep fully permissive to avoid parse failures.
 * If later you have a fixed shape (e.g., { status, message }), tighten here.
 */
export const VerifyTransferOtpResponseSchema = z.any();
export type VerifyTransferOtpResponse = z.infer<typeof VerifyTransferOtpResponseSchema>;

/* ===================================== */
/*        DMT: Fund Transfer (POST)      */
/* Upstream: /secure/retailer/fund-transfer */
/* ===================================== */

export const FundTransferRequestSchema = z
  .object({
    sender_id: z.string().min(1, 'sender_id is required'),
    beneficiary_id: z.string().min(1, 'beneficiary_id is required'),
    amount: z.number().positive('amount must be > 0'),
    mode: z.string().min(1).optional(), // required only for Paypoint service, keep optional here
    lat: z.string().optional(),
    lng: z.string().optional(),
    service_id: z.string().uuid({ message: 'service_id must be a UUID' }),
  })
  .strict();

export type FundTransferRequest = z.infer<typeof FundTransferRequestSchema>;

/**
 * Keep response fully permissive so upstream payloads always pass.
 * (If a stable response shape emerges, tighten this later.)
 */
export const FundTransferResponseSchema = z.any();
export type FundTransferResponse = z.infer<typeof FundTransferResponseSchema>;
