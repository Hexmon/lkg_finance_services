import { useMutation } from '@tanstack/react-query';
import { apiVerifyIfsc } from './endpoints';
import type {
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
