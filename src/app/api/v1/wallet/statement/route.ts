// src/app/api/v1/wallet/statement/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { retailerFetch } from "@/app/api/_lib/http-retailer";
import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import {
    WalletStatementQuerySchema,
    WalletStatementResponseSchema,
    type WalletStatementResponse,
} from "@/features/wallet/domain/types";

/**
 * BFF -> Upstream:
 * GET /secure/retailer/get-wallet-statement
 * Forwards JWT from HttpOnly cookie as Bearer Authorization
 * Forwards pagination/sort query params
 */
export async function GET(req: NextRequest) {
    try {
        // read jwt from HttpOnly cookie
        const jar = await cookies();
        const jwt = jar.get(AUTH_COOKIE_NAME)?.value;
        if (!jwt) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // parse & normalize query
        const url = new URL(req.url);
        const raw = Object.fromEntries(url.searchParams.entries());
        const parsed = WalletStatementQuerySchema.parse(raw);

        // call upstream
        const data = await retailerFetch<WalletStatementResponse>(
            "/secure/retailer/get-wallet-statement",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json",
                },
                query: {
                    order: parsed.order,
                    sort_by: parsed.sort_by,
                    per_page: parsed.per_page,
                    page: parsed.page,
                },
            }
        );

        // validate upstream (defensive)
        const safe = WalletStatementResponseSchema.parse(data);
        return NextResponse.json(safe, { status: 200 });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Failed to fetch wallet statement";
        const status = (err as any)?.status ?? 500;
        return NextResponse.json({ message }, { status });
    }
}
