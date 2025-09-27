// src/features/retailer/dmt/fund-transfer/data/hooks.ts
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { apiFundTransfer, apiGetBankInfo, apiVerifyTransferOtp } from './endpoints';
import type {
    BankInfoQuery,
    BankInfoResponse,
    FundTransferRequest,
    FundTransferResponse,
    VerifyTransferOtpRequest,
    VerifyTransferOtpResponse,
} from '@/features/retailer/dmt/fund-transfer/domain/types';

export function useVerifyTransferOtp() {
    const mutation = useMutation<VerifyTransferOtpResponse, unknown, VerifyTransferOtpRequest>({
        mutationFn: apiVerifyTransferOtp,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        verifyTransferOtp: mutation.mutate,
        verifyTransferOtpAsync: mutation.mutateAsync,
        reset: mutation.reset,
    };
}

export function useFundTransfer() {
    const mutation = useMutation<FundTransferResponse, unknown, FundTransferRequest>({
        mutationFn: apiFundTransfer,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        fundTransfer: mutation.mutate,
        fundTransferAsync: mutation.mutateAsync,
        reset: mutation.reset,
    };
}

export const bankInfoKeys = {
    all: ['dmt', 'fund-transfer', 'bank-info'] as const,
    list: (q: BankInfoQuery) => [...bankInfoKeys.all, q] as const,
};

export function useBankInfo(query: BankInfoQuery, enabled = true) {
    return useQuery<BankInfoResponse>({
        queryKey: bankInfoKeys.list(query),
        queryFn: () => apiGetBankInfo(query),
        enabled,
        placeholderData: keepPreviousData,
    });
}