import { useQuery, keepPreviousData, UseQueryResult } from '@tanstack/react-query';
import { apiCommissionSummary, apiGetWalletStatement } from './endpoints';
import {
  CommissionSummaryQuery,
  CommissionSummaryQuerySchema,
  CommissionSummaryResponse,
  type WalletStatementQuery,
  type WalletStatementResponse,
} from '@/features/retailer/wallet/domain/types';

export const walletStatementKeys = {
  all: ['retailer', 'wallet', 'statement'] as const,
  list: (q: WalletStatementQuery) => [...walletStatementKeys.all, q] as const,
};

export function useWalletStatement(query: WalletStatementQuery, enabled = true) {
  return useQuery<WalletStatementResponse>({
    queryKey: walletStatementKeys.list(query),
    queryFn: () => apiGetWalletStatement(query),
    enabled: Boolean(enabled && query?.balance_id),
    placeholderData: keepPreviousData,
  });
}
/**
 * Query Hook: useCommissionSummaryQuery
 * - Enabled only if query is valid
 */
export function useCommissionSummaryQuery(
  query: CommissionSummaryQuery,
  enabled: boolean = true
): UseQueryResult<CommissionSummaryResponse, unknown> {
  CommissionSummaryQuerySchema.parse(query);

  return useQuery({
    queryKey: ["retailer", "wallet", "commission-summary", query],
    queryFn: () => apiCommissionSummary(query),
    enabled: Boolean(enabled),
    placeholderData: keepPreviousData,
  });
}
