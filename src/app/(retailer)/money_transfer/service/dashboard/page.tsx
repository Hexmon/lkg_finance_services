"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Select, Input } from "antd";
import {
    UserOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { walletStats } from "@/config/app.config";
import Image from "next/image";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import NewTransfer from "@/components/money-transfer/NewTransfer";
import Transaction from "@/components/money-transfer/Transaction";

const { Title, Text } = Typography;

export default function MoneyTransferPage() {
    const [activeTab, setActiveTab] = useState<string | number>("newtransfer");
    const items: TabItem[] = [
        {
            key: "newtransfer",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "newtransfer"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/rocket.svg" alt="New" width={16} height={16}/>
                    <span>New Transfer</span>
                </div>
            ),
            content: <NewTransfer/>,
        },
        {
            key: "transaction",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transaction"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/heart-line.svg" alt="History" width={16} height={16} />
                    <span>Transaction</span>
                </div>
            ),
            content: <Transaction />,
        },
    ];
    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/money_transfer_dashboard" pageTitle="Dashboards">
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
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
