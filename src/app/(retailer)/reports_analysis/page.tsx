"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Typography } from "antd";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import WalletStatement, { WalletStatementFilters } from "@/components/report_analysis/WalletStatement";
import ReportTransactionHistory from "@/components/report_analysis/ReportTransactionHistory";
import CommissionSummary from "@/components/report_analysis/CommissionSummary";
import Feature from "@/components/report_analysis/Feature";
import ReportTable from "@/components/report_analysis/ReportTable";
import { useRetailerDashboardQuery } from "@/features/retailer/general";
import { useWalletStatement } from "@/features/wallet/data/hooks";

const { Text } = Typography;

export default function ReportAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<string | number>("walletstatement");

    const {
        data: {
            balances: { MAIN } = {},
            transactions: {
                success_rate,
                total_transaction: { growth, total_count } = {},
            } = {},
            commissions: { overall, overall_ratio } = {},
        } = {},
    } = useRetailerDashboardQuery();

    /** parent-managed filters (you can wire a UI later) */
    const [filters, setFilters] = useState<WalletStatementFilters>({});

    /** parent-managed pagination for server paging (used only when no filters) */
    const [page, setPage] = useState(1);
    const perPage = 10;
    const order: "asc" | "desc" = "desc";
    const sortBy = "created_at";

    /** Any filter active? (when true, fetch a big page 1 so client-side filters work across full set) */
    const hasFilters = useMemo(() => {
        return Boolean(
            (filters.subtype && String(filters.subtype).length > 0) ||
            (filters.statuses && filters.statuses.length > 0) ||
            (filters.walletNames && filters.walletNames.length > 0) ||
            (filters.txnTypes && filters.txnTypes.length > 0) ||
            (filters.search && filters.search.trim().length > 0) ||
            filters.from ||
            filters.to
        );
    }, [filters]);

    /** keep server page in sync when filters change (no UI change) */
    useEffect(() => {
        setPage(1);
    }, [filters]);

    /** When filters are on, request a large page from the server to cover most/all rows */
    const effectivePerPage = hasFilters ? 1000 : perPage; // adjust cap based on your API limits
    const effectivePage = hasFilters ? 1 : page;

    /** fetch server page **in parent** (big slice when filtering, normal paging otherwise) */
    const { data: walletPage, isLoading: walletLoading } = useWalletStatement(
        {
            per_page: effectivePerPage,
            page: effectivePage,
            order,
            sort_by: sortBy,
        },
        true
    );

    /** Pass page control to child only when NOT filtering; otherwise keep child on page 1 for clarity */
    const childPage = hasFilters ? 1 : page;
    const handleChildPageChange = (p: number) => {
        if (!hasFilters) setPage(p);
        // when filtering, we keep page at 1 and let child paginate client-side on the big dataset
    };

    /** tab items (child gets the fetched page + loading via props) */
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
                    <Image
                        src={activeTab === "walletstatement" ? "/credit-card.svg" : "/credit-card-black.svg"}
                        alt="New"
                        width={16}
                        height={17}
                    />
                    <span className="ml-2">Wallet Statement</span>
                </div>
            ),
            content: (
                <WalletStatement
                    /** server page (may be large) + loading now come from parent */
                    apiPage={walletPage?.data ?? []}
                    loading={walletLoading}
                    /** client filters still applied in child */
                    filters={filters}
                    /** child pagination:
                     * - when filters OFF: child mirrors server paging
                     * - when filters ON: child stays at page 1 and paginates client-side over large apiPage
                     */
                    page={childPage}
                    onPageChange={(p) => handleChildPageChange(p)}
                    /** optional (display-only in child) */
                    perPage={perPage}
                    order={order}
                    sortBy={sortBy}
                />
            ),
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
                    <Image
                        src={activeTab === "transactionhistory" ? "/transaction-bill-white.svg" : "/transaction-bill.svg"}
                        alt="History"
                        width={16}
                        height={16}
                    />
                    <span className="ml-2">Transaction History</span>
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
                    <Image src={activeTab === "commissionsummary" ? "/heart-line.svg" : "/line-blk.svg"} alt="History" width={22} height={26} />
                    <span className="ml-2">Commission Summary</span>
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

            <Feature
                balanceGrowth={3.2}
                commission={overall ?? 0}
                commissionGrowth={overall_ratio ?? 0}
                currentBalance={MAIN}
                successRate={success_rate ?? 0}
                successRateGrowth={growth ?? 0}
                totalTransaction={total_count ?? 0}
                totalTransactionGrowth={growth ?? 0}
            />

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
