import { authRequest } from '@/features/auth/data/client';
import {
  AccountUpgradeRequest,
  AccountUpgradeRequestSchema,
  AccountUpgradeResponse,
  AccountUpgradeResponseSchema,
  RequestLogResponse,
  RequestLogResponseSchema,
} from '../domain/types';

const ACCOUNT_UPGRADE_PATH =
  process.env.NEXT_PUBLIC_ACCOUNT_UPGRADE_PATH || '/secure/account-upgrade';

const REQUEST_LOG_PATH =
  process.env.NEXT_PUBLIC_REQUEST_LOG_PATH || '/secure/request_log';

/** POST /secure/account-upgrade (Bearer; API Key optional) */
export async function apiAccountUpgrade(
  payload: AccountUpgradeRequest
): Promise<AccountUpgradeResponse> {
  const body = AccountUpgradeRequestSchema.parse(payload);
  const data = await authRequest<AccountUpgradeResponse>(
    ACCOUNT_UPGRADE_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return AccountUpgradeResponseSchema.parse(data);
}

/** GET /secure/request_log/:user_id/:request_id (Bearer; API Key optional) */
export async function apiGetRequestLog(
  userId: string,
  requestId: string
): Promise<RequestLogResponse> {
  const url = `${REQUEST_LOG_PATH}/${encodeURIComponent(userId)}/${encodeURIComponent(requestId)}`;
  const data = await authRequest<RequestLogResponse>(
    url,
    'GET',
    undefined,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: true }
  );
  return RequestLogResponseSchema.parse(data);
}
