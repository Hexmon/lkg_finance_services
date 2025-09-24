import { useMutation } from '@tanstack/react-query';
import { apiAccountUpgrade } from './endpoints';
import { type AccountUpgradeRequest, type AccountUpgradeResponse } from '../domain/types';

export function useAccountUpgrade() {
  const mutation = useMutation<AccountUpgradeResponse, unknown, AccountUpgradeRequest>({
    mutationFn: apiAccountUpgrade,
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
