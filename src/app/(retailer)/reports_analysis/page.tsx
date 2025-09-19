// "use client";

// import React, { useState } from "react";
// import { Typography, DatePicker } from "antd";
// import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
// import DashboardLayout from "@/lib/layouts/DashboardLayout";
// import Image from "next/image";
// import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
// import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
// import { CardLayout } from "@/lib/layouts/CardLayout";
// import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
// import WalletStatement, { WalletStatementFilters } from "@/components/report_analysis/WalletStatement";
// import ReportTransactionHistory from "@/components/report_analysis/ReportTransactionHistory";
// import CommissionSummary from "@/components/report_analysis/CommissionSummary";
// import Feature from "@/components/report_analysis/Feature";
// import { useRetailerDashboardQuery } from "@/features/retailer/general";
// import ReportTable from "@/components/report_analysis/ReportTable";

// const { Text } = Typography;

// export default function ReportAnalyticsPage() {
//     const [activeTab, setActiveTab] = useState<string | number>("wallet");
//     const { data: { balances: { MAIN } = {}, transactions: { success_rate, total_transaction: { growth, total_count } = {} } = {}, commissions: { overall, overall_ratio } = {} } = {}, isLoading, error } = useRetailerDashboardQuery()
//     const [filters, setFilters] = useState<WalletStatementFilters>({
//         // subtype: "CR",
//         // statuses: ["SUCCESS"],
//         // walletNames: ["MAIN"],
//         // txnTypes: ["AEPS","COMMISSION"],
//         // search: "credited",
//         // from: new Date("2025-09-19T00:00:00Z"),
//         // to: new Date("2025-09-20T00:00:00Z"),
//     });

//     const [page, setPage] = useState(1);
//     const wsKey = React.useMemo(
//         () => `ws-${page}-${JSON.stringify(filters)}`,
//         [page, filters]
//     );
//     const items: TabItem[] = [
//         {
//             key: "walletstatement",
//             label: (
//                 <div
//                     className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "walletstatement"
//                         ? "bg-[#3386FF] text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                 >
//                     <Image src={activeTab === "walletstatement" ? "/credit-card.svg" : "/credit-card-black.svg"} alt="New" width={16} height={17} />
//                     <span className="ml-2">Wallet Statement</span>
//                 </div>
//             ),
//             content: <WalletStatement
//                 key={wsKey}
//                 page={page}
//                 onPageChange={(p) => setPage(p)}
//                 filters={filters}
//                 perPage={10}
//                 order="desc"
//                 sortBy="created_at"
//             />,
//         },
//         {
//             key: "transactionhistory",
//             label: (
//                 <div
//                     className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transactionhistory"
//                         ? "bg-[#3386FF] text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                 >
//                     <Image src={activeTab === "transactionhistory" ? "/transaction-bill-white.svg" : "/transaction-bill.svg"} alt="History" width={16} height={16} />
//                     <span className="ml-2">Transaction History</span>
//                 </div>
//             ),
//             content: <ReportTransactionHistory />,
//         },
//         {
//             key: "commissionsummary",
//             label: (
//                 <div
//                     className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "commissionsummary"
//                         ? "bg-[#3386FF] text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                 >
//                     <Image src={activeTab === "commissionsummary" ? "/heart-line.svg" : "/line-blk.svg"} alt="History" width={22} height={26} />
//                     <span className="ml-2">Commission Summary</span>
//                 </div>
//             ),
//             content: <CommissionSummary />,
//         },
//     ];

//     return (
//         <DashboardLayout activePath="/reports" pageTitle="Report & Analysis" sections={moneyTransferSidebarConfig}>
//             <DashboardSectionHeader
//                 title="Report & Analytics"
//                 subtitle="Financial reports and transaction analytics"
//                 titleClassName="text-[25px] font-medium"
//                 subtitleClassName="text-[14px]"
//             />

//             <Feature balanceGrowth={3.2} commission={overall ?? 0} commissionGrowth={overall_ratio ?? 0} currentBalance={MAIN} successRate={success_rate ?? 0} successRateGrowth={growth ?? 0} totalTransaction={total_count ?? 0} totalTransactionGrowth={growth ?? 0} />

//             <ReportTable />

//             <SmartTabs
//                 items={items}
//                 activeKey={activeTab}
//                 onChange={setActiveTab}
//                 keepAlive
//                 fitted={false}
//                 durationMs={260}
//                 easing="cubic-bezier(.22,1,.36,1)"
//             />

//         </DashboardLayout>
//     );
// }

"use client";

import React, { useMemo, useState } from "react";
import { Typography } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import WalletStatement, { WalletStatementFilters } from "@/components/report_analysis/WalletStatement";
import ReportTransactionHistory from "@/components/report_analysis/ReportTransactionHistory";
import CommissionSummary from "@/components/report_analysis/CommissionSummary";
import Feature from "@/components/report_analysis/Feature";
import { useRetailerDashboardQuery } from "@/features/retailer/general";
import ReportTable from "@/components/report_analysis/ReportTable";

const { Text } = Typography;

export default function ReportAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<string | number>("wallet");
    const {
        data: {
            balances: { MAIN } = {},
            transactions: {
                success_rate,
                total_transaction: { growth, total_count } = {},
            } = {},
            commissions: { overall, overall_ratio } = {},
        } = {},
        isLoading,
        error,
    } = useRetailerDashboardQuery();

    /** parent-managed filters (no UI changes here) */
    const [filters, setFilters] = useState<WalletStatementFilters>({
        // subtype: "CR",
        // statuses: ["SUCCESS"],
        // walletNames: ["MAIN"],
        // txnTypes: ["AEPS","COMMISSION"],
        // search: "credited",
        // from: new Date("2025-09-19T00:00:00Z"),
        // to: new Date("2025-09-20T00:00:00Z"),
    });

    /** parent-managed pagination */
    const [page, setPage] = useState(1);

    /** if you later wire a filter UI, call this helper to apply + reset page */
    const applyFilters = (next: WalletStatementFilters) => {
        setFilters(next);
        setPage(1);
    };

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
                    // 🔸 no key that depends on filters; avoids remount issues
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    filters={filters}
                    perPage={10}
                    order="desc"
                    sortBy="created_at"
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
                    <Image
                        src={activeTab === "commissionsummary" ? "/heart-line.svg" : "/line-blk.svg"}
                        alt="History"
                        width={22}
                        height={26}
                    />
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
