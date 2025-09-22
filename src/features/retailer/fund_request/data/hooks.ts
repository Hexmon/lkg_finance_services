"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetCompanyBankAccounts } from "./endpoints";
import type { CompanyBankAccountsResponse } from "../domain/types";

export function useCompanyBankAccounts() {
  return useQuery<CompanyBankAccountsResponse, unknown, CompanyBankAccountsResponse>({
    queryKey: ["retailer", "company-bank-accounts"] as const,
    queryFn: apiGetCompanyBankAccounts,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
