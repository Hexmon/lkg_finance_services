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

const StatusCodeSchema = z.union([z.number(), z.string().regex(/^\d+$/)]).transform(n => Number(n));
const ynFlag = z.enum(['Y', 'N']);

/** -------- Bank Info (list/search) --------
 * GET /secure/retailer/bank_info?service_id=...&bank_name=Sta
 */
export const BankInfoQuerySchema = z.object({
  service_id: z.string().uuid(),
  bank_name: z.string().min(1).optional(), // prefix search
}).strict();

export type BankInfoQuery = z.infer<typeof BankInfoQuerySchema>;

export const BankRecordSchema = z.object({
  id: z.string().uuid(),
  bank_code: z.string().min(1),
  bank_name: z.string().min(1),
  BankId: z.string().nullable().optional(),
  account_verification_allowed: ynFlag,
  imps_allowed: ynFlag,
  neft_allowed: ynFlag,
}).passthrough();

export type BankRecord = z.infer<typeof BankRecordSchema>;

export const BankInfoResponseSchema = z.object({
  status: StatusCodeSchema,
  banks: z.array(BankRecordSchema),
}).passthrough();

export type BankInfoResponse = z.infer<typeof BankInfoResponseSchema>;
