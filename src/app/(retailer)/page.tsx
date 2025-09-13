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
  const { data, isLoading } = useRetailerDashboardQuery();

  const { quick_links, balances: { MAIN, AEPS } = {}, commissions, name, profile, transactions: apiTransactions, user_id, username, virtual_account }: DashboardDetailsResponse = data ?? DEFAULT_DASHBOARD;

  const totalBalance = (MAIN ?? "") + (AEPS ?? "")

  const {
    success_rate = 0,
    success_rate_ratio = 0,
    // growth = 0,
    total_transaction: {
      total_count: totalTxnCount = 0,
      ratio: totalTxnRatio = 0,
      // growth: totalTxnGrowth = 0,
    } = {},
    // overall_transaction: {
    //   total_count: overallTxnCount = 0,
    //   ratio: overallTxnRatio = 0,
    //   growth: overallTxnGrowth = 0,
    // } = {},
  } = apiTransactions || {};

  const { data: { data: transactionData } = {}, isLoading: transactionLoading } = useTransactionSummaryQuery({
    page: 1,
    per_page: 5,
    order: "desc",
  })

  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/"
      pageTitle="Dashboards"
      isLoading={isLoading || transactionLoading}
    >
      <Profile totalBalance={totalBalance} username={name || username} virtual_account={virtual_account} />

      <Feature commissions={commissions} success_rate={success_rate} success_rate_ratio={success_rate_ratio} totalTxnCount={totalTxnCount} totalTxnRatio={totalTxnRatio} />

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
