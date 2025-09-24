// src/features/wallet/data/endpoints.ts
import { getJSON, postJSON } from "@/lib/api/client";
import {
    PayoutRequest,
    PayoutRequestSchema,
    PayoutResponse,
    PayoutResponseSchema,
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

/**
 * Browser -> BFF:
 * POST /api/v1/wallet/payout
 * Body: { account_id, mode: "IMPS" | "NEFT", amount: string|number }
 */
export async function apiCreatePayout(payload: PayoutRequest): Promise<PayoutResponse> {
  const body = PayoutRequestSchema.parse(payload);
  const res = await postJSON<unknown>(`/wallet/payout`, body, {
    redirectOn401: true,
    redirectPath: "/signin",
  });
  return PayoutResponseSchema.parse(res);
}