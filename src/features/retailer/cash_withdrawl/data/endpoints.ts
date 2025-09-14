import { postJSON } from '@/lib/api/client';
import {
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
