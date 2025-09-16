/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/app/api/_lib/auth-cookies';
import { retailerFetch } from '@/app/api/_lib/http-retailer';
import {
    WalletStatementQuerySchema,
    WalletStatementResponseSchema,
    type WalletStatementResponse,
} from '@/features/retailer/wallet/domain/types';

export const dynamic = 'force-dynamic';

/**
 * BFF: GET /api/v1/retailer/wallet/get-wallet-statement
 * Proxies upstream:
 *   GET https://retailer-uat.bhugtan.in/secure/retailer/get-wallet-statement/
 *      ?balance_id=...&per_page=...&page=...&order=...&sort_by=...&user_id=...&txn_type=...&status=...&start_date=...&end_date=...
 */
export async function GET(req: NextRequest) {
    // ---- Auth (HttpOnly cookie -> Bearer) ----
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ---- Parse + validate query ----
    const sp = req.nextUrl.searchParams;
    const parsed = WalletStatementQuerySchema.safeParse({
        balance_id: sp.get('balance_id') ?? undefined, // required
        per_page: sp.get('per_page') ? Number(sp.get('per_page')) : undefined,
        page: sp.get('page') ? Number(sp.get('page')) : undefined,
        order: sp.get('order') ?? undefined,         // asc|desc
        sort_by: sp.get('sort_by') ?? undefined,     // e.g., created_at
        user_id: sp.get('user_id') ?? undefined,
        txn_type: sp.get('txn_type') ?? undefined,   // e.g., FUND_REQUEST
        status: sp.get('status') ?? undefined,       // e.g., PENDING
        start_date: sp.get('start_date') ?? undefined, // YYYY-MM-DD
        end_date: sp.get('end_date') ?? undefined,     // YYYY-MM-DD
    });

    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Invalid query', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    const query = parsed.data;

    // ---- Proxy upstream ----
    try {
        const raw = await retailerFetch<unknown>(
            '/secure/retailer/get-wallet-statement/',
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                // Upstream expects all as query params
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                query: query as any,
            }
        );

        const data: WalletStatementResponse = WalletStatementResponseSchema.parse(raw);
        return NextResponse.json<WalletStatementResponse>(data, { status: 200 });
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? 'Wallet statement failed' } },
            { status }
        );
    }
}
