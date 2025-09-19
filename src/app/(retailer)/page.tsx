/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { DashboardDetailsResponse, DEFAULT_DASHBOARD, useRetailerDashboardQuery, useTransactionSummaryQuery } from "@/features/retailer/general";
import Profile from "@/components/dashboard/Profile";
import Feature from "@/components/dashboard/Feature";
import Services from "@/components/dashboard/Services";
import WalletOverview from "@/components/dashboard/WalletOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  const { data: { quick_links, balances: { MAIN, AEPS } = {}, commissions, name, profile, transactions: { success_rate = 0, growth, overall_transaction, success_rate_ratio = 0, total_transaction: { ratio: totalTxnRatio = 0, total_count: totalTxnCount = 0 } = {} } = {}, user_id, username, virtual_account, customers: {total_users_count} = {} } = DEFAULT_DASHBOARD ?? {}, isFetching, isPending, isPlaceholderData, error: dashboardError } = useRetailerDashboardQuery();

  const { data: { data: transactionData } = {}, isLoading: transactionLoading, error: transactionError } = useTransactionSummaryQuery({ page: 1, per_page: 5, order: "desc" })

  // const error = dashboardError ?? transactionError;
  const totalBalance = (MAIN ?? "") + (AEPS ?? "")
  const showLoading = isPending || (isFetching && isPlaceholderData);

  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/"
      pageTitle="Dashboards"
      isLoading={showLoading || transactionLoading}
      error={[dashboardError]}
    // error={[dashboardError, transactionError, anotherError].filter(Boolean)}
    //  error={dashboardError}
    >
      <Profile totalBalance={totalBalance} username={name || username} virtual_account={virtual_account} />

      <Feature commissions={commissions} success_rate={success_rate} success_rate_ratio={success_rate_ratio} totalTxnCount={totalTxnCount} totalTxnRatio={totalTxnRatio} total_users_count={total_users_count ?? 0} />

      <Services quick_link={quick_links} />

      {/* Wallet Overview & Recent Activity */}
      <div className="flex flex-col md:flex-row gap-6 mt-4 w-full">
        <WalletOverview balances={{ MAIN, AEPS }} commissions={commissions} />
        <RecentActivity transactionData={transactionData ?? []} />
      </div>

      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
