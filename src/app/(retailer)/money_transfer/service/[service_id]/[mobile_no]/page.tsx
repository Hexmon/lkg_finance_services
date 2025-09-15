"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { getUiSenderAndBeneficiaries, getWalletStats } from "@/config/app.config";
import Image from "next/image";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import NewTransfer from "@/components/money-transfer/NewTransfer";
import Transaction from "@/components/money-transfer/Transaction";
import { DEFAULT_DASHBOARD, useRetailerDashboardQuery, useTransactionSummaryQuery } from "@/features/retailer/general";
import BeneficiariesTab from "@/components/money-transfer/BeneficiariesTab";
import { useParams } from "next/navigation";
import { useCheckSender } from "@/features/retailer/dmt/sender";
import { useMessage } from "@/hooks/useMessage";

export default function MoneyTransferPage() {
    const [activeTab, setActiveTab] = useState<string | number>("beneficiaries");
    const { error, info, success } = useMessage()
    type RouteParams = { service_id: string, mobile_no: string };
    const { service_id, mobile_no } = useParams<RouteParams>();

    const { data: { commissions: { overall } = {}, transactions: { success_rate_ratio = 0, total_transaction: { total_count: totalTxnCount = 0 } = {} } = {} } = DEFAULT_DASHBOARD ?? {}, isLoading: dashbaordLoading, error: dashboardError } = useRetailerDashboardQuery();

    const { data: { data: transactionData } = {}, isLoading: transactionLoading, error: transactionError } = useTransactionSummaryQuery({ page: 1, per_page: 5, order: "desc" })

    const { checkSenderAsync, data: { beneficiaries, sender } = {}, error: checkSenderRegError, isLoading: checkSenderRegLoading } = useCheckSender();

    const walletStats = useMemo(
        () =>
            getWalletStats({
                totalTxnCount,
                successRateRatio: success_rate_ratio,      // already in % per your destructure
                totalBeneficiaries: null,                  // TODO: wire from API when available
                commissionOverall: overall ?? 0, // note: API field name 'overal' as you wrote
            }),
        [totalTxnCount, success_rate_ratio, overall]
    );

    const handleFetchSender = async () => {
        try {
            if ((service_id ?? "").length === 0) {
                error('Missing Service Id!! Retry after selectin DMT servie')
                return;
            } else {
                await checkSenderAsync({ mobile_no, service_id });
            }
        } catch (err: any) {
            error(err?.message ?? "Something went wrong while checking sender.");
        }
    };

    useEffect(() => {
        handleFetchSender()
    }, [])

    const { uiSender, uiBeneficiaries } = getUiSenderAndBeneficiaries(
        sender,
        beneficiaries,
        mobile_no
    );

    const items: TabItem[] = [
        {
            key: "newtransfer",
            label: (
                <div
                    className={`flex space-x-3 items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "newtransfer"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/rocket.svg" alt="New" width={16} height={16} />
                    <span>New Transfer</span>
                </div>
            ),
            content: <NewTransfer />,
        },
        {
            key: "beneficiaries",
            label: (
                <div
                    className={`flex space-x-3 items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "beneficiaries"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/beneficiary.svg" alt="New" width={16} height={16} />
                    <span>Beneficiaries</span>
                </div>
            ),
            content: <BeneficiariesTab service_id={service_id} beneficiaries={uiBeneficiaries} sender={uiSender} />,
            // content: <BeneficiariesTab service_id={service_id} beneficiaries={beneficiaries ?? []} sender={sender} />,
        },
        {
            key: "transaction",
            label: (
                <div
                    className={`flex space-x-3 items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transaction"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-[#232323] hover:bg-gray-200"
                        }`}
                >
                    <Image src="/heart-line.svg" alt="History" className={activeTab === 'transaction' ? 'text-black' : 'text-[#232323]'} width={16} height={16} />
                    <span>Transaction</span>
                </div>
            ),
            content: <Transaction transactionData={transactionData || []} isLoading={transactionLoading} />,
        },
    ];
    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/money_transfer" pageTitle="Money Transfer" isLoading={dashbaordLoading || transactionLoading || checkSenderRegLoading}>
            {/* <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/money_transfer" error={[transactionError, dashboardError, checkSenderRegError]} pageTitle="Money Transfer" isLoading={dashbaordLoading || transactionLoading || checkSenderRegLoading}> */}
            <CardLayout
                width="w-full"
                header={
                    <DashboardSectionHeader
                        title="Money Transfer Service"
                        subtitle="Send Money Instantly Across India"
                        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
                        subtitleClassName="!font-medium !text-[14px]"
                        arrowClassName="!text-[#3386FF]"
                    />
                }
                body={
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {walletStats.map((stat) => (
                            <CardLayout
                                key={stat.label}
                                className="!min-h-[120px] !p-4 bg-[#FFF7EC] rounded-xl shadow-sm"
                                header={
                                    <div className="flex justify-between items-start w-full">
                                        {/* Icon Left */}
                                        <div className="bg-blue-500 p-2 rounded-full w-10 h-10 flex items-center justify-center">
                                            <Image
                                                src={stat.icon}
                                                alt={stat.label}
                                                width={22}
                                                height={22}
                                            />
                                        </div>

                                        {/* Growth Tag */}
                                        <div className="bg-[#E7EEFF] px-2 py-[2px] text-[10px] text-[#3386FF] font-semibold rounded-full mt-1">
                                            +15%
                                        </div>
                                    </div>
                                }
                                body={
                                    <div>
                                        <p className="text-[32px] font-semibold text-black mt-2">
                                            {stat.amount}
                                        </p>
                                        <p className="text-[#787878] text-[14px] font-medium mt-1">
                                            {stat.label}
                                        </p>
                                    </div>
                                }
                            />
                        ))}
                    </div>

                }
            />
            <div className="p-6 w-full">

                <SmartTabs
                    items={items}
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    keepAlive
                    fitted={false}
                    durationMs={260}
                    easing="cubic-bezier(.22,1,.36,1)"
                />
            </div>
            {/* <div className="bg-transparent"></div> */}
        </DashboardLayout>
    );
}
