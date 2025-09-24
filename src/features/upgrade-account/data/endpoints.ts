import { patchJSON } from '@/lib/api/client';
import {
  AccountUpgradeRequestSchema,
  AccountUpgradeResponseSchema,
  type AccountUpgradeRequest,
  type AccountUpgradeResponse,
} from '../domain/types';

const ACCOUNT_UPGRADE_PATH = '/auth/account-upgrade';

export async function apiAccountUpgrade(
  body: AccountUpgradeRequest
): Promise<AccountUpgradeResponse> {
  const payload = AccountUpgradeRequestSchema.parse(body);

  const res = await patchJSON<unknown>(ACCOUNT_UPGRADE_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AccountUpgradeResponseSchema.parse(res);
}
