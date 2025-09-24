import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { retailerFetch } from "@/app/api/_lib/http-retailer";
import { GetBankAccountsResponseSchema, AddBankAccountRequestSchema, AddBankAccountResponseSchema, DeleteBankAccountResponseSchema } from "@/features/retailer/bank_account/domain/types";

/** --------- GET /api/v1/retailer/bank-acc?user_id=:uid ---------- */
export async function GET(req: NextRequest) {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
    const Q = z.object({ user_id: z.string().min(1) });
    const parsed = Q.safeParse(sp);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
    }

    const userId = parsed.data.user_id;

    try {
        const upstream = await retailerFetch(`/secure/retailer/bank_accounts/${encodeURIComponent(userId)}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const safe = GetBankAccountsResponseSchema.parse(upstream);
        return NextResponse.json(safe, { status: 200 });
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? "Get bank accounts failed" } },
            { status }
        );
    }
}

/** --------- POST /api/v1/retailer/bank-acc  ---------- */
export async function POST(req: NextRequest) {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let bodyUnknown: unknown;
    try {
        bodyUnknown = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = AddBankAccountRequestSchema.safeParse(bodyUnknown);
    if (!parsed.success) {
        return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
    }

    try {
        const upstream = await retailerFetch(`/secure/retailer/bank_accounts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: parsed.data,
        });
        const safe = AddBankAccountResponseSchema.parse(upstream);
        return NextResponse.json(safe, { status: 200 });
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? "Add bank account failed" } },
            { status }
        );
    }
}

/** --------- DELETE /api/v1/retailer/bank-acc?user_id=:uid&account_id=:aid ---------- */
export async function DELETE(req: NextRequest) {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
    const Q = z.object({
        user_id: z.string().min(1),
        account_id: z.string().min(1),
    });
    const parsed = Q.safeParse(sp);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
    }

    const { user_id, account_id } = parsed.data;

    try {
        const upstream = await retailerFetch(
            `/secure/retailer/bank_accounts/${encodeURIComponent(user_id)}/${encodeURIComponent(account_id)}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const safe = DeleteBankAccountResponseSchema.parse(upstream);
        return NextResponse.json(safe, { status: 200 });
    } catch (err: any) {
        const status = err?.status ?? err?.data?.status ?? 502;
        return NextResponse.json(
            err?.data ?? { status, error: { message: err?.message ?? "Delete bank account failed" } },
            { status }
        );
    }
}
