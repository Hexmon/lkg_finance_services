"use client";

import React, { useState } from "react";
import { Typography, DatePicker } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import WalletStatement from "@/components/report_analysis/WalletStatement";
import ReportTransactionHistory from "@/components/report_analysis/ReportTransactionHistory";
import CommissionSummary from "@/components/report_analysis/CommissionSummary";
import Feature from "@/components/report_analysis/Feature";
import { useRetailerDashboardQuery } from "@/features/retailer/general";
import ReportTable from "@/components/report_analysis/ReportTable";

const { Text } = Typography;

export default function ReportAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<string | number>("wallet");

    const { data: { balances: { MAIN } = {}, transactions: { success_rate, total_transaction: { growth, total_count } = {} } = {}, commissions: { overall, overall_ratio } = {} } = {}, isLoading, error } = useRetailerDashboardQuery()

    const items: TabItem[] = [
        {
            key: "walletstatement",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "walletstatement"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/credit-card.svg" alt="New" width={16} height={16} />
                    <span>Wallet Statement</span>
                </div>
            ),
            content: <WalletStatement />,
        },
        {
            key: "transactionhistory",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transactionhistory"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/transaction-bill.svg" alt="History" width={16} height={16} />
                    <span>Transaction History</span>
                </div>
            ),
            content: <ReportTransactionHistory />,
        },
        {
            key: "commissionsummary",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "commissionsummary"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/line-blk.svg" alt="History" width={16} height={16} />
                    <span>Commission Summary</span>
                </div>
            ),
            content: <CommissionSummary />,
        },
    ];

    return (
        <DashboardLayout activePath="/reports" pageTitle="Report & Analysis" sections={moneyTransferSidebarConfig}>
            <DashboardSectionHeader
                title="Report & Analytics"
                subtitle="Financial reports and transaction analytics"
                titleClassName="text-[25px] font-medium"
                subtitleClassName="text-[14px]"
            />

            <Feature balanceGrowth={3.2} commission={overall ?? 0} commissionGrowth={overall_ratio ?? 0} currentBalance={MAIN} successRate={success_rate ?? 0} successRateGrowth={growth ?? 0} totalTransaction={total_count ?? 0} totalTransactionGrowth={growth ?? 0} />

            <ReportTable />

            <SmartTabs
                items={items}
                activeKey={activeTab}
                onChange={setActiveTab}
                keepAlive
                fitted={false}
                durationMs={260}
                easing="cubic-bezier(.22,1,.36,1)"
            />

        </DashboardLayout>
    );
}
