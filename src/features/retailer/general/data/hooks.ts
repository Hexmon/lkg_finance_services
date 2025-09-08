// src/features/retailer/general/data/hooks.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import {
  apiGetRetailerDashboard,
  apiGetTransactionSummary,
} from './endpoints';
import type {
  DashboardDetailsResponse,
  TransactionSummaryQuery,
  TransactionSummaryResponse,
} from '@/features/retailer/general/domain/types';

/**
 * Default dashboard object so UI can destructure without guards.
 * Matches DashboardDetailsResponse shape.
 */
export const DEFAULT_DASHBOARD: DashboardDetailsResponse = {
  quick_links: [],
  user_id: '',
  name: '',
  profile: '',
  username: '',
  balances: {},
  transactions: {
    success_rate: 0,
    success_rate_ratio: 0,
    growth: 0,
    total_transaction: { total_count: 0, ratio: 0, growth: 0 },
    overall_transaction: { total_count: 0, ratio: 0, growth: 0 },
  },
  virtual_account: { vba_account_number: '', vba_ifsc: '' },
  commissions: {
    overall: 0,
    overall_ratio: 0,
    current_month: 0,
    current_month_ratio: 0,
    last_month: 0,
  },
} as const;

/** ---------- Dashboard ---------- */
export function useRetailerDashboardQuery() {
  // v5: set TQueryFnData, TError, TData so `data` resolves to the same type you select
  return useQuery<DashboardDetailsResponse, unknown, DashboardDetailsResponse>({
    queryKey: ['retailer', 'dashboard'] as const,
    queryFn: apiGetRetailerDashboard,
    // Ensure consumers always see a concrete object (not undefined)
    select: (d) => d ?? DEFAULT_DASHBOARD,
    placeholderData: DEFAULT_DASHBOARD,
    staleTime: 60_000,   // 1 min
    gcTime: 5 * 60_000,  // 5 min
    refetchOnWindowFocus: false,
  });
}

/** ---------- Transaction Summary (pagination-friendly) ---------- */
export function useTransactionSummaryQuery(query: TransactionSummaryQuery) {
  // Sensible empty page while fetching/transitioning
  const emptyPage: TransactionSummaryResponse = {
    total: 0,
    page: query.page ?? 1,
    per_page: query.per_page ?? 10,
    pages: 0,
    has_next: false,
    has_prev: false,
    next_page: null,
    prev_page: null,
    sort_by: query.sort_by ?? 'created_at',
    data: [],
  };

  return useQuery<TransactionSummaryResponse, unknown, TransactionSummaryResponse>({
    queryKey: ['retailer', 'transaction-summary', query] as const,
    queryFn: () => apiGetTransactionSummary(query),
    // v5 replacement for keepPreviousData; keeps UI stable across page changes
    placeholderData: (prev) => prev ?? emptyPage,
    select: (d) => d ?? emptyPage,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
