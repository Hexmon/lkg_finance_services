"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiGetBankAccounts,
  apiAddBankAccount,
  apiDeleteBankAccount,
} from "./endpoints";
import type {
  GetBankAccountsResponse,
  AddBankAccountRequest,
  AddBankAccountResponse,
  DeleteBankAccountResponse,
} from "../domain/types";

export const bankAccKeys = {
  all: ["retailer", "bank-acc"] as const,
  list: (user_id: string) => [...bankAccKeys.all, "list", user_id] as const,
};

/** List accounts */
export function useBankAccounts(user_id: string, enabled = true) {
  return useQuery<GetBankAccountsResponse>({
    queryKey: bankAccKeys.list(user_id),
    queryFn: () => apiGetBankAccounts(user_id),
    enabled: !!user_id && enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

/** Add account */
export function useAddBankAccount() {
  const qc = useQueryClient();
  return useMutation<AddBankAccountResponse, unknown, AddBankAccountRequest>({
    mutationFn: apiAddBankAccount,
    onSuccess: (data) => {
      const uid = data.data.user_id;
      qc.invalidateQueries({ queryKey: bankAccKeys.list(uid) });
    },
  });
}

/** Delete account */
export function useDeleteBankAccount(user_id: string) {
  const qc = useQueryClient();
  return useMutation<DeleteBankAccountResponse, unknown, { account_id: string }>({
    mutationFn: ({ account_id }) => apiDeleteBankAccount(user_id, account_id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bankAccKeys.list(user_id) });
    },
  });
}
