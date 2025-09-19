// src/features/wallet/data/hooks.ts
"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
    type WalletStatementQuery,
    type WalletStatementResponse,
    WalletStatementQuerySchema,
} from "@/features/wallet/domain/types";
import { apiGetWalletStatement } from "./endpoints";

export const walletStatementKeys = {
    all: ["wallet", "statement"] as const,
    list: (q: WalletStatementQuery) =>
        [...walletStatementKeys.all, q.per_page, q.page, q.order, q.sort_by] as const,
};

export function useWalletStatement(
    query: Partial<WalletStatementQuery> = {},
    enabled = true
) {
    const normalized = WalletStatementQuerySchema.parse(query);

    return useQuery<WalletStatementResponse>({
        queryKey: walletStatementKeys.list(normalized),
        queryFn: () => apiGetWalletStatement(normalized),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
}
