// src/features/retailer/dmt/fund-transfer/data/hooks.ts
import { useMutation } from '@tanstack/react-query';
import { apiFundTransfer, apiVerifyTransferOtp } from './endpoints';
import type {
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
