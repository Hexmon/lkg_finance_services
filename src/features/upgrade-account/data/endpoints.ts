// src/features/upgrade-account/data/endpoints.ts
import { postJSON } from "@/lib/api/client";
import {
  AccountUpgradeRequestSchema,
  type AccountUpgradeRequest,
  type AccountUpgradeResponse,
} from "@/features/upgrade-account/domain/types";

export async function apiRequestAccountUpgrade(body: AccountUpgradeRequest) {
  const validated = AccountUpgradeRequestSchema.parse(body);
  return await postJSON<AccountUpgradeResponse>("/auth/account-upgrade", validated);
}
