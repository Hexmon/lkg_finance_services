// src/features/address/data/hooks.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type GetAddressesQuery,
    GetAddressesQuerySchema,
    type GetAddressesResponse,
    type AddAddressRequest,
    type AddAddressResponse,
    type PatchAddressLandmarkBody,
    type UpdateAddressResponse,
} from "@/features/address/domain/types";
import {
    apiAddAddress,
    apiGetAddresses,
    apiPatchAddressLandmark,
} from "./endpoints";

export const addressKeys = {
    all: ["address"] as const,
    list: (q: GetAddressesQuery) => [...addressKeys.all, "list", q.user_id ?? "me"] as const,
};

export function useAddresses(query: Partial<GetAddressesQuery> = {}, enabled = true) {
    const normalized = GetAddressesQuerySchema.parse(query);
    return useQuery<GetAddressesResponse>({
        queryKey: addressKeys.list(normalized),
        queryFn: () => apiGetAddresses(normalized),
        enabled,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
    });
}

export function useAddAddress() {
    const qc = useQueryClient();
    return useMutation<AddAddressResponse, unknown, AddAddressRequest>({
        mutationFn: (body) => apiAddAddress(body),
        onSuccess: (_data, variables) => {
            const key = variables.user_id || "me";
            qc.invalidateQueries({ queryKey: [...addressKeys.all, "list", key] });
        },
    });
}

export function usePatchAddressLandmark(userId?: string) {
    const qc = useQueryClient();
    return useMutation<UpdateAddressResponse, unknown, PatchAddressLandmarkBody>({
        mutationFn: (body) => apiPatchAddressLandmark(body),
        onSuccess: () => {
            // Refresh all address lists (or scope by user if provided)
            if (userId) {
                qc.invalidateQueries({ queryKey: [...addressKeys.all, "list", userId] });
            } else {
                qc.invalidateQueries({ queryKey: addressKeys.all });
            }
        },
    });
}
