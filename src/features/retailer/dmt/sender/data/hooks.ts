'use client';

import { useMutation } from '@tanstack/react-query';
import {
    apiCheckSender,
    apiVerifyOtpOnboardSender,
    apiAddSender,
} from './endpoints';

import type {
    AddSenderRequest,
    AddSenderResponse,
    CheckSenderBody,
    CheckSenderResponse,
    VerifyOtpOnboardSenderRequest,
    VerifyOtpOnboardSenderResponse,
} from '../domain/types';

/**
 * Hook for POST /retailer/dmt/sender/check-sender
 *
 * Usage:
 *   const { checkSender, checkSenderAsync, data, error, isLoading } = useCheckSender();
 */
export function useCheckSender() {
    const mutation = useMutation<CheckSenderResponse, unknown, CheckSenderBody>({
        mutationFn: apiCheckSender,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        checkSender: mutation.mutate,
        checkSenderAsync: mutation.mutateAsync,
    };
}

/**
 * Hook for POST /retailer/dmt/sender/verify-otp-onboard-sender
 *
 * Usage:
 *   const {
 *     verifyOtpOnboardSender,
 *     verifyOtpOnboardSenderAsync,
 *     data,
 *     error,
 *     isLoading,
 *   } = useVerifyOtpOnboardSender();
 */
export function useVerifyOtpOnboardSender() {
    const mutation = useMutation<
        VerifyOtpOnboardSenderResponse,
        unknown,
        VerifyOtpOnboardSenderRequest
    >({
        mutationFn: apiVerifyOtpOnboardSender,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        verifyOtpOnboardSender: mutation.mutate,
        verifyOtpOnboardSenderAsync: mutation.mutateAsync,
    };
}

/**
 * Hook for POST /retailer/dmt/sender/add-sender
 *
 * Usage:
 *   const {
 *     addSender,
 *     addSenderAsync,
 *     data,
 *     error,
 *     isLoading
 *   } = useAddSender();
 *
 * Body example:
 * {
 *   mobile_no: "8275340766",
 *   txnType: "IMPS",        // optional (BillAvenue only)
 *   bankId: "FINO",         // optional (BillAvenue only)
 *   service_id: "2a249a83-d924-4bae-8976-5e12c52dea30",
 *   sender_name: "NIKHIL RAVINDRA BHARAMBE",
 *   aadharNumber: "665658340407", // optional for ARTL
 *   pincode: "412207",
 *   email_address: "suresh.p@tru.biz",
 *   bioPid: ""              // optional
 * }
 */
export function useAddSender() {
    const mutation = useMutation<AddSenderResponse, unknown, AddSenderRequest>({
        mutationFn: apiAddSender,
    });

    return {
        data: mutation.data,
        error: mutation.error,
        isLoading: mutation.isPending,
        addSender: mutation.mutate,
        addSenderAsync: mutation.mutateAsync,
    };
}
