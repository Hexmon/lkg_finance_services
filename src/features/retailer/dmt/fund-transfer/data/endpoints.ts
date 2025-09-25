// src/features/retailer/dmt/fund-transfer/data/endpoints.ts
import { getJSON, postJSON } from '@/lib/api/client';
import {
  BankInfoQuery,
  BankInfoQuerySchema,
  BankInfoResponse,
  BankInfoResponseSchema,
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

const BANK_INFO_PATH = '/retailer/dmt/fund-transfer/bank-list';

function buildQuery(path: string, query?: BankInfoQuery) {
  if (!query) return path;
  const qs = new URLSearchParams();
  if (query.service_id) qs.set('service_id', query.service_id);
  if (query.bank_name) qs.set('bank_name', query.bank_name);
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

export async function apiGetBankInfo(
  query: BankInfoQuery
): Promise<BankInfoResponse> {
  const q = BankInfoQuerySchema.parse(query);
  const path = buildQuery(BANK_INFO_PATH, q);

  const res = await getJSON<unknown>(path, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return BankInfoResponseSchema.parse(res);
}