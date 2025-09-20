/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/app/api/_lib/auth-cookies";
import { retailerFetch } from "@/app/api/_lib/http-retailer";
import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import { CompanyBankAccountsResponse, CompanyBankAccountsResponseSchema } from "@/features/retailer/fund_request/domain/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/retailer/company-bank-accounts
 * -> GET /secure/retailer/company_bank_accounts
 */
export async function GET(_req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const upstream = await retailerFetch<unknown>(
      RETAILER_ENDPOINTS.FUND_REQUEST.COMPANY_BANK_ACCOUNTS,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data: CompanyBankAccountsResponse = CompanyBankAccountsResponseSchema.parse(upstream);
    return NextResponse.json<CompanyBankAccountsResponse>(data, { status: 200 });
  } catch (err: any) {
    const status = err?.status ?? err?.data?.status ?? 502;
    return NextResponse.json(
      err?.data ?? { status, error: { message: err?.message ?? "Failed to fetch company bank accounts" } },
      { status }
    );
  }
}
