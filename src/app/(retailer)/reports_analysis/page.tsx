"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ReportTable, { ReportTableFiltersPayload } from "@/components/report_analysis/ReportTable";
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

    // ---- central filters for WalletStatement (driven by ReportTable) ----
    const [filters, setFilters] = useState<WalletStatementFilters>({});

    // parent-managed pagination (only when no filters)
    const [page, setPage] = useState(1);
    const perPage = 10;
    const order: "asc" | "desc" = "desc";
    const sortBy = "created_at";

    // ReportTable -> translate into WalletStatement filters
    // MEMOIZED + equality guard to avoid render loops and unnecessary updates
    const handleReportFilters = useCallback((payload: ReportTableFiltersPayload) => {
        const next: WalletStatementFilters = {};

        // date range
        if (payload.from) next.from = payload.from;
        if (payload.to) next.to = payload.to;

        // service -> txnTypes
        if (payload.service && payload.service !== "ALL") {
            next.txnTypes = [payload.service]; // API expects txn_type like "DMT" | "BBPS" | "AEPS" | "RECHARGE"
        }

        // status -> statuses
        if (payload.status && payload.status !== "ALL") {
            next.statuses = [payload.status]; // API expects txn_status "SUCCESS" | "PENDING" | "FAILED"
        }

        // Only update when values actually change
        setFilters((prev) => {
            const prevJson = JSON.stringify(prev ?? {});
            const nextJson = JSON.stringify(next);
            return prevJson === nextJson ? prev : next;
        });
    }, []);

    // any filter active?
    function normalizeForHasFilters(f: WalletStatementFilters) {
        const statuses = Array.isArray(f.statuses) ? f.statuses : [];
        const walletNames = Array.isArray(f.walletNames) ? f.walletNames : [];
        const txnTypes = Array.isArray(f.txnTypes) ? f.txnTypes : [];
        const search = (f.search ?? "").trim();
        return {
            subtype: f.subtype ?? null,
            statuses: statuses.length,
            walletNames: walletNames.length,
            txnTypes: txnTypes.length,
            searchLen: search.length,
            hasFrom: !!f.from,
            hasTo: !!f.to,
        };
    }

    const hasFilters = useMemo(() => {
        const n = normalizeForHasFilters(filters);
        return Boolean(
            n.subtype ||
            n.statuses ||
            n.walletNames ||
            n.txnTypes ||
            n.searchLen ||
            n.hasFrom ||
            n.hasTo
        );
    }, [filters]);

    // reset server page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    // big page when filtering (client-side slice), otherwise normal server paging
    const effectivePerPage = hasFilters ? 1000 : perPage; // tune to API limit
    const effectivePage = hasFilters ? 1 : page;

    const { data: walletPage, isLoading: walletLoading } = useWalletStatement(
        { per_page: effectivePerPage, page: effectivePage, order, sort_by: sortBy },
        true
    );

    // child page control: only when NOT filtering
    const childPage = hasFilters ? 1 : page;
    const handleChildPageChange = (p: number, _ps?: number) => {
        if (!hasFilters) setPage(p);
    };

    const items: TabItem[] = [
        {
            key: "walletstatement",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "walletstatement" ? "bg-[#3386FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image
                        src={activeTab === "walletstatement" ? "/credit-card.svg" : "/credit-card-black.svg"}
                        alt="New" width={16} height={17}
                    />
                    <span className="ml-2">Wallet Statement</span>
                </div>
            ),
            content: (
                <>
                    {/* keep the filters UI exactly as-is, but now it drives WalletStatement */}
                    <ReportTable onFiltersChange={handleReportFilters} />

                    <WalletStatement
                        apiPage={walletPage?.data ?? []}
                        loading={walletLoading}
                        filters={filters}
                        page={childPage}
                        onPageChange={handleChildPageChange}
                        perPage={perPage}
                        order={order}
                        sortBy={sortBy}
                    />
                </>
            ),
        },
        {
            key: "transactionhistory",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transactionhistory" ? "bg-[#3386FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image
                        src={activeTab === "transactionhistory" ? "/transaction-bill-white.svg" : "/transaction-bill.svg"}
                        alt="History" width={16} height={16}
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
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "commissionsummary" ? "bg-[#3386FF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
