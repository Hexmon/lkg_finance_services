// src\features\retailer\dmt\beneficiaries\data\hooks.ts
import { useMutation } from '@tanstack/react-query';
import { apiAddBeneficiary, apiVerifyIfsc } from './endpoints';
import type {
    AddBeneficiaryRequest,
    AddBeneficiaryResponse,
    VerifyIfscRequest,
    VerifyIfscResponse,
} from '@/features/retailer/dmt/beneficiaries/domain/types';

export function useVerifyIfsc() {
    const mutation = useMutation<VerifyIfscResponse, unknown, VerifyIfscRequest>({
        mutationFn: apiVerifyIfsc,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        verifyIfsc: mutation.mutate,
        verifyIfscAsync: mutation.mutateAsync,
        reset: mutation.reset,
    };
}

export function useAddBeneficiary() {
  const mutation = useMutation<AddBeneficiaryResponse, unknown, AddBeneficiaryRequest>({
    mutationFn: apiAddBeneficiary,
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    addBeneficiary: mutation.mutate,
    addBeneficiaryAsync: mutation.mutateAsync,
    reset: mutation.reset,
  };
}