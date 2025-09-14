import { useMutation } from '@tanstack/react-query';
import { apiAepsCheckAuthentication, apiAepsTransaction, apiAepsTwoFactorAuthentication } from './endpoints';
import type {
    AEPSCheckAuthRequest,
    AEPSCheckAuthResponse,
    AEPSTransactionRequest,
    AEPSTransactionResponse,
    AEPSTwoFactorAuthRequest,
    AEPSTwoFactorAuthResponse,
} from '@/features/retailer/cash_withdrawl/domain/types';

export function useAepsCheckAuthentication() {
    const mutation = useMutation<AEPSCheckAuthResponse, unknown, AEPSCheckAuthRequest>({
        mutationFn: apiAepsCheckAuthentication,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        aepsCheckAuthentication: mutation.mutate,
        aepsCheckAuthenticationAsync: mutation.mutateAsync,
        reset: mutation.reset,
    };
}

export function useAepsTwoFactorAuthentication() {
    const mutation = useMutation<AEPSTwoFactorAuthResponse, unknown, AEPSTwoFactorAuthRequest>({
        mutationFn: apiAepsTwoFactorAuthentication,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        aepsTwoFactorAuthenticate: mutation.mutate,
        aepsTwoFactorAuthenticateAsync: mutation.mutateAsync,
        reset: mutation.reset,
    };
}

export function useAepsTransaction() {
  const mutation = useMutation<AEPSTransactionResponse, unknown, AEPSTransactionRequest>({
    mutationFn: apiAepsTransaction,
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    aepsTransaction: mutation.mutate,
    aepsTransactionAsync: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
