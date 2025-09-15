import { getJSON, postJSON } from '@/lib/api/client';
import {
  AEPSBankListQuery,
  AEPSBankListQuerySchema,
  AEPSBankListResponse,
  AEPSBankListResponseSchema,
    AEPSCheckAuthRequestSchema,
    AEPSCheckAuthResponseSchema,
    AEPSTransactionRequest,
    AEPSTransactionRequestSchema,
    AEPSTransactionResponse,
    AEPSTransactionResponseSchema,
    AEPSTwoFactorAuthRequest,
    AEPSTwoFactorAuthRequestSchema,
    AEPSTwoFactorAuthResponse,
    AEPSTwoFactorAuthResponseSchema,
    type AEPSCheckAuthRequest,
    type AEPSCheckAuthResponse,
} from '@/features/retailer/cash_withdrawl/domain/types';

const AEPS_CHECK_AUTH_PATH = '/retailer/aeps/check-authentication';

export async function apiAepsCheckAuthentication(
    body: AEPSCheckAuthRequest
): Promise<AEPSCheckAuthResponse> {
    // Validate input at the edge
    const payload = AEPSCheckAuthRequestSchema.parse(body);

    // Call your BFF (App Router route.ts)
    const res = await postJSON<unknown>(AEPS_CHECK_AUTH_PATH, payload, {
        redirectOn401: true,
        redirectPath: '/signin',
    });

    // Validate + type the response
    return AEPSCheckAuthResponseSchema.parse(res);
}

const AEPS_TWO_FACTOR_AUTH_PATH = '/retailer/aeps/two-factor-authentication';

export async function apiAepsTwoFactorAuthentication(
  body: AEPSTwoFactorAuthRequest
): Promise<AEPSTwoFactorAuthResponse> {
  const payload = AEPSTwoFactorAuthRequestSchema.parse(body);

  const res = await postJSON<unknown>(AEPS_TWO_FACTOR_AUTH_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AEPSTwoFactorAuthResponseSchema.parse(res);
}

const AEPS_TRANSACTION_PATH = '/retailer/aeps/aeps-transaction';

export async function apiAepsTransaction(
  body: AEPSTransactionRequest
): Promise<AEPSTransactionResponse> {
  const payload = AEPSTransactionRequestSchema.parse(body);

  const res = await postJSON<unknown>(AEPS_TRANSACTION_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AEPSTransactionResponseSchema.parse(res);
}

const AEPS_BANK_LIST_PATH = '/retailer/aeps/bank-list';

function buildQueryPath(path: string, query: AEPSBankListQuery) {
  const qs = new URLSearchParams();
  qs.set('service_id', query.service_id);
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

export async function apiAepsBankList(
  query: AEPSBankListQuery
): Promise<AEPSBankListResponse> {
  const parsed = AEPSBankListQuerySchema.parse(query);

  const path = buildQueryPath(AEPS_BANK_LIST_PATH, parsed);
  const res = await getJSON<unknown>(path, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AEPSBankListResponseSchema.parse(res);
}
