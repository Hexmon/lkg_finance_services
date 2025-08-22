'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiAddAddress,
  apiGetAddresses,
  apiUpdateAddress,
  apiDeleteAddress,
} from './endpoints';
import type {
  AddAddressRequest,
  AddressRecord,
  GetAddressesResponse,
  UpdateAddressBody,
  UpdateAddressResponse,
  DeleteAddressResponse,
} from '../domain/types';

const QK = {
  list: (userId?: string) => ['address', 'list', userId ?? 'me'] as const,
};

/** List addresses (optionally by userId) */
export function useAddressesQuery(userId?: string, enabled = true) {
  return useQuery<GetAddressesResponse>({
    queryKey: QK.list(userId),
    queryFn: () => apiGetAddresses(userId),
    enabled,
    retry: 1,
  });
}

/** Create address */
export function useAddAddressMutation(userId?: string) {
  const qc = useQueryClient();
  return useMutation<AddressRecord, unknown, AddAddressRequest>({
    mutationFn: (payload) => apiAddAddress(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.list(userId) });
    },
  });
}

/** Update address by id */
export function useUpdateAddressMutation(userId?: string) {
  const qc = useQueryClient();
  return useMutation<UpdateAddressResponse, unknown, { addressId: number | string; body: UpdateAddressBody }>({
    mutationFn: ({ addressId, body }) => apiUpdateAddress(addressId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.list(userId) });
    },
  });
}

/** Delete address by id */
export function useDeleteAddressMutation(userId?: string) {
  const qc = useQueryClient();
  return useMutation<DeleteAddressResponse, unknown, { addressId: number | string }>({
    mutationFn: ({ addressId }) => apiDeleteAddress(addressId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.list(userId) });
    },
  });
}
