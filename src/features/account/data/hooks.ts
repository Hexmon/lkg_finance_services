'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiAccountUpgrade, apiGetRequestLog } from './endpoints';
import type {
  AccountUpgradeRequest,
  AccountUpgradeResponse,
  RequestLogResponse,
} from '../domain/types';

const QK = {
  requestLog: (userId: string, requestId: string) =>
    ['account', 'request-log', userId, requestId] as const,
};

/** Request an account upgrade */
export function useAccountUpgradeMutation() {
  return useMutation<AccountUpgradeResponse, unknown, AccountUpgradeRequest>({
    mutationFn: (payload) => apiAccountUpgrade(payload),
  });
}

/** Fetch a specific request log (by userId + requestId) */
export function useRequestLogQuery(userId: string, requestId: string, enabled = true) {
  return useQuery<RequestLogResponse>({
    queryKey: QK.requestLog(userId, requestId),
    queryFn: () => apiGetRequestLog(userId, requestId),
    enabled: Boolean(enabled && userId && requestId),
    retry: 1,
  });
}
