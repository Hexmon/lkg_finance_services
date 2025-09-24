import { useMutation } from '@tanstack/react-query';
import { apiRequestAccountUpgrade } from './endpoints';
import { type AccountUpgradeRequest, type AccountUpgradeResponse } from '../domain/types';

export function useAccountUpgrade() {
  const mutation = useMutation<AccountUpgradeResponse, unknown, AccountUpgradeRequest>({
    mutationFn: apiRequestAccountUpgrade,
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    accountUpgrade: mutation.mutate,
    accountUpgradeAsync: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
