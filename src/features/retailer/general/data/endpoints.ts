/**
 * Retailer | General module — endpoints
 *
 * Endpoints covered:
 * - GET /secure/retailer/transaction_summary
 * - GET /secure/retailer/getDashboard
 */
import {
  TransactionSummaryQuerySchema,
  TransactionSummaryQuery,
  TransactionSummaryResponseSchema,
  TransactionSummaryResponse,
  DashboardDetailsResponseSchema,
  DashboardDetailsResponse,
} from "../domain/types";
import { getJSON } from "@/lib/api/client";

const p = {
  dashboard: '/retailer/dashboard/get-dashboard',
  transactionSummary: '/retailer/dashboard/transaction-summary',
} as const;

export async function apiGetTransactionSummary(
  query?: TransactionSummaryQuery
): Promise<TransactionSummaryResponse> {
  const q = query ? TransactionSummaryQuerySchema.parse(query) : undefined;

  const sp = new URLSearchParams();
  if (q?.page !== undefined) sp.set('page', String(q.page));
  if (q?.per_page !== undefined) sp.set('per_page', String(q.per_page));
  if (q?.order !== undefined) sp.set('order', q.order);
  if (q?.sort_by !== undefined) sp.set('sort_by', q.sort_by);

  const path = sp.toString()
    ? `${p.transactionSummary}?${sp.toString()}`
    : p.transactionSummary;

  const data = await getJSON<unknown>(path, { redirectOn401: true, redirectPath: '/signin' });
  return TransactionSummaryResponseSchema.parse(data);
}

export async function apiGetRetailerDashboard(): Promise<DashboardDetailsResponse> {
  const data = await getJSON<unknown>(p.dashboard, { redirectOn401: true, redirectPath: '/signin' });
  return DashboardDetailsResponseSchema.parse(data);
}