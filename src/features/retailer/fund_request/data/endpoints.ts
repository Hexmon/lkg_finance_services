import { getJSON } from "@/lib/api/client";
import {
  CompanyBankAccountsResponseSchema,
  type CompanyBankAccountsResponse,
} from "../domain/types";

// BFF path
const p = {
  companyBankAccounts: "/retailer/fund-request/company-bank-accounts",
};

export async function apiGetCompanyBankAccounts(): Promise<CompanyBankAccountsResponse> {
  const data = await getJSON<unknown>(p.companyBankAccounts, {
    redirectOn401: true,
    redirectPath: "/signin",
  });
  return CompanyBankAccountsResponseSchema.parse(data);
}
