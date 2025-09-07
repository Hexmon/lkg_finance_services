/**
 * Retailer | General module — endpoints
 *
 * Endpoints covered:
 * - GET /secure/retailer/transaction_summary
 * - GET /secure/retailer/getDashboard
 */

import { RETAILER_ENDPOINTS } from "@/config/endpoints";
import {
  TransactionSummaryQuerySchema,
  TransactionSummaryQuery,
  TransactionSummaryResponseSchema,
  TransactionSummaryResponse,
  DashboardDetailsResponseSchema,
  DashboardDetailsResponse,
} from "../domain/types";
import { retailerRequest } from "../../client";

/** Const paths */
const TRANSACTION_SUMMARY_PATH = RETAILER_ENDPOINTS.GENERAL.Transaction_SUMMARY;
const DASHBOARD_DETAILS_PATH = RETAILER_ENDPOINTS.GENERAL.DASHBOARD_DETAILS;

/**
 * GET /secure/retailer/transaction_summary
 */
export async function apiTransactionSummaryList(
  input: TransactionSummaryQuery = {},
  opts?: { signal?: AbortSignal }
): Promise<TransactionSummaryResponse> {
  const params = TransactionSummaryQuerySchema.parse(input);

  const raw = await retailerRequest<TransactionSummaryResponse>({
    method: "GET",
    path: TRANSACTION_SUMMARY_PATH,
    query: params,
    headers: {},
    auth: true,
    apiKey: false,
    signal: opts?.signal ?? null,
  });

  return TransactionSummaryResponseSchema.parse(raw);
}

/**
 * GET /secure/retailer/getDashboard
 */
export async function apiDashboardDetails(
  opts?: { signal?: AbortSignal }
): Promise<DashboardDetailsResponse> {
  const raw = await retailerRequest<DashboardDetailsResponse>({
    method: "GET",
    path: DASHBOARD_DETAILS_PATH,
    headers: {},
    auth: true,
    apiKey: false,
    signal: opts?.signal ?? null,
  });

  return DashboardDetailsResponseSchema.parse(raw);
}
