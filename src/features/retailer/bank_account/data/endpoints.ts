import { GetBankAccountsResponseSchema,
         AddBankAccountRequestSchema,
         AddBankAccountResponseSchema,
         DeleteBankAccountResponseSchema,
         type GetBankAccountsResponse,
         type AddBankAccountRequest,
         type AddBankAccountResponse,
         type DeleteBankAccountResponse } from "../domain/types";
import { getJSON, postJSON } from "@/lib/api/client";

// NOTE: your client helpers normally prefix `/api/v1`. Keep paths consistent with your routes.
const P = {
  base: "/retailer/bank-acc",
} as const;

function toQS(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** GET /api/v1/retailer/bank-acc?user_id=... */
export async function apiGetBankAccounts(user_id: string) {
  const qs = toQS({ user_id });
  const data = await getJSON<GetBankAccountsResponse>(`${P.base}${qs}`);
  return GetBankAccountsResponseSchema.parse(data);
}

/** POST /api/v1/retailer/bank-acc */
export async function apiAddBankAccount(body: AddBankAccountRequest) {
  const validated = AddBankAccountRequestSchema.parse(body);
  const data = await postJSON<AddBankAccountResponse>(P.base, validated);
  return AddBankAccountResponseSchema.parse(data);
}

/** DELETE /api/v1/retailer/bank-acc?user_id=...&account_id=... */
export async function apiDeleteBankAccount(user_id: string, account_id: string) {
  const qs = toQS({ user_id, account_id });
  const res = await fetch(`/api/v1${P.base}${qs}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const status = (json?.status as number) ?? res.status;
    const message = json?.message ?? `Delete failed (${status})`;
    throw Object.assign(new Error(message), { status, data: json });
  }
  return DeleteBankAccountResponseSchema.parse(json as unknown);
}
