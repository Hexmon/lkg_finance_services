/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { retailerFetch } from "@/app/api/_lib/http-retailer";
import {
    CommissionSummaryQuerySchema,
    CommissionSummaryResponseSchema,
} from "@/features/retailer/wallet/domain/types";

export const dynamic = "force-dynamic";

/**
 * BFF: GET /api/v1/retailer/wallet/commission-summary
 * Upstream (Retailer): GET /secure/retailer/commission-summary
 */
export async function GET(req: NextRequest) {
    try {
        const jar = await cookies();
        const token = jar.get(AUTH_COOKIE_NAME)?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rawQuery = Object.fromEntries(req.nextUrl.searchParams.entries());
        const query = CommissionSummaryQuerySchema.parse(rawQuery);

        const json = await retailerFetch<unknown>("/secure/retailer/commission-summary", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            query,
        });

        const parsed = CommissionSummaryResponseSchema.parse(json);
        return NextResponse.json(parsed, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(err?.data ?? { error: err?.message ?? "Bad Gateway" }, { status: err?.status ?? 502 });
    }
}
