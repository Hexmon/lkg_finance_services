// src/features/retailer/dmt/fund-transfer/data/endpoints.ts
import { postJSON } from '@/lib/api/client';
import {
    FundTransferRequest,
    FundTransferRequestSchema,
    FundTransferResponse,
    FundTransferResponseSchema,
    VerifyTransferOtpRequestSchema,
    VerifyTransferOtpResponseSchema,
    type VerifyTransferOtpRequest,
    type VerifyTransferOtpResponse,
} from '@/features/retailer/dmt/fund-transfer/domain/types';

const VERIFY_TRANSFER_OTP_PATH = '/retailer/dmt/fund-transfer/verify-transfer-otp';

export async function apiVerifyTransferOtp(
    body: VerifyTransferOtpRequest
): Promise<VerifyTransferOtpResponse> {
    const payload = VerifyTransferOtpRequestSchema.parse(body);

    const res = await postJSON<unknown>(VERIFY_TRANSFER_OTP_PATH, payload, {
        redirectOn401: true,
        redirectPath: '/signin',
    });

    return VerifyTransferOtpResponseSchema.parse(res);
}

const FUND_TRANSFER_PATH = '/retailer/dmt/fund-transfer/dtm-fund-transfer';

export async function apiFundTransfer(
  body: FundTransferRequest
): Promise<FundTransferResponse> {
  const payload = FundTransferRequestSchema.parse(body);

  const res = await postJSON<unknown>(FUND_TRANSFER_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return FundTransferResponseSchema.parse(res);
}
