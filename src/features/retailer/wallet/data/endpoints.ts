// src/features/retailer/wallet/data/endpoints.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getJSON } from "@/lib/api/client";
import {
    CommissionSummaryQuery,
    CommissionSummaryQuerySchema,
    CommissionSummaryResponse,
    CommissionSummaryResponseSchema,
    WalletBalancePathParams,
    WalletBalancePathParamsSchema,
    WalletBalanceQuery,
    WalletBalanceQuerySchema,
    WalletBalanceResponse,
    WalletBalanceResponseSchema,
    WalletStatementQuerySchema,
    WalletStatementResponseSchema,
    type WalletStatementQuery,
    type WalletStatementResponse,
} from "@/features/retailer/wallet/domain/types";

/** -------------------------
 * Helpers
 * ------------------------*/
function qsFromObj(obj: Record<string, unknown>) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null) continue;
        qs.set(k, typeof v === "number" ? String(v) : String(v));
    }
    const s = qs.toString();
    return s ? `?${s}` : "";
}

/** -------------------------
 * Wallet Statement
 * BFF route: /api/v1/retailer/wallet/get-wallet-statement
 * ------------------------*/
const WALLET_STATEMENT_PATH = "/retailer/wallet/get-wallet-statement";

export async function apiGetWalletStatement(
    query: WalletStatementQuery
): Promise<WalletStatementResponse> {
    const parsed = WalletStatementQuerySchema.parse(query);

    const qs = qsFromObj({
        balance_id: parsed.balance_id,
        per_page: parsed.per_page,
        page: parsed.page,
        order: parsed.order,
        sort_by: parsed.sort_by,
        user_id: parsed.user_id,
        txn_type: parsed.txn_type,
        status: parsed.status,
        start_date: parsed.start_date,
        end_date: parsed.end_date,
    });

    const url = `${WALLET_STATEMENT_PATH}${qs}`;

    const json = await getJSON<unknown>(url, {
        redirectOn401: true,
        redirectPath: "/signin",
    });

    return WalletStatementResponseSchema.parse(json);
}

/** -------------------------
 * Wallet Balance
 * BFF route: /api/v1/retailer/wallet/wallet-balance
 * ------------------------*/
export async function apiWalletBalance(
    _params: WalletBalancePathParams = {},
    _query: WalletBalanceQuery = {}
): Promise<WalletBalanceResponse> {
    WalletBalancePathParamsSchema.parse(_params);
    const parsedQuery = WalletBalanceQuerySchema.parse(_query);

    const qs = qsFromObj(parsedQuery as Record<string, unknown>);
    const url = `/retailer/wallet/wallet-balance${qs}`;

    const json = await getJSON<unknown>(url, {
        redirectOn401: true,
        redirectPath: "/signin",
    });

    return WalletBalanceResponseSchema.parse(json);
}

/** -------------------------
 * Commission Summary
 * BFF route: /api/v1/retailer/wallet/commission-summary
 * ------------------------*/
export async function apiCommissionSummary(
    query: CommissionSummaryQuery
): Promise<CommissionSummaryResponse> {
    const parsed = CommissionSummaryQuerySchema.parse(query);

    const qs = qsFromObj({
        page: parsed.page,
        per_page: parsed.per_page,
        order: parsed.order,
        sort_by: parsed.sort_by,
        start_date: parsed.start_date,
        end_date: parsed.end_date,
        user_id: parsed.user_id,
    });

    const url = `/retailer/wallet/commission-summary${qs}`;

    const json = await getJSON<unknown>(url, {
        redirectOn401: true,
        redirectPath: "/signin",
    });

    return CommissionSummaryResponseSchema.parse(json);
}
