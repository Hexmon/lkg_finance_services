// src/features/wallet/data/endpoints.ts
import { getJSON } from "@/lib/api/client";
import {
    WalletStatementQuerySchema,
    type WalletStatementQuery,
    type WalletStatementResponse,
} from "@/features/wallet/domain/types";

function buildQuery(q: WalletStatementQuery) {
    const u = new URLSearchParams();
    u.set("per_page", String(q.per_page));
    u.set("page", String(q.page));
    u.set("order", q.order);
    u.set("sort_by", q.sort_by);
    return u.toString();
}

/**
 * Browser -> BFF:
 * GET /api/v1/wallet/statement?per_page=&page=&order=&sort_by=
 */
export async function apiGetWalletStatement(
    query: Partial<WalletStatementQuery> = {}
): Promise<WalletStatementResponse> {
    const normalized = WalletStatementQuerySchema.parse(query);
    const qs = buildQuery(normalized);
    const path = `/wallet/statement?${qs}`;
    return await getJSON<WalletStatementResponse>(path);
}
