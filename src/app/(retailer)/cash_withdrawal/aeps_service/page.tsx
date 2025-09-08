"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Input, Select, Form, Table } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import TransactionHistory from "@/components/cash-withdraw/TransactionHistory";
import NewTransaction from "@/components/cash-withdraw/NewTransaction";


const { Title, Text } = Typography;
const { Option } = Select;

export default function CashWithdrawPage() {
    const [activeTab, setActiveTab] = useState<string | number>("newtransaction");

    const stats = [
        {
            icon: "/heart-line.svg",
            badge: "/fif.svg",
            value: "₹1,25,000",
            label: "Today's Transactions",
        },
        {
            icon: "/circle.svg",
            badge: "/fif.svg",
            value: "99.5%",
            label: "Success Rate",
        },
        {
            icon: "/star.svg",
            badge: "/fif.svg",
            value: "156",
            label: "Commission Earned",
        },
        {
            icon: "/users.svg",
            badge: "/fif.svg",
            value: "89",
            label: "Total Customers",
        },
    ];

    const items: TabItem[] = [
        {
            key: "newtransaction",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "newtransaction"
                            ? "bg-[#3386FF] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/rocket.svg" alt="New" width={16} height={16} />
                    <span>New Transaction</span>
                </div>
            ),
            content: <NewTransaction />,
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
                    <Image src="/line-blk.svg" alt="History" width={16} height={16} />
                    <span>Transaction History</span>
                </div>
            ),
            content: <TransactionHistory />,
        },
    ];



    return (
        <DashboardLayout
            sections={cashWithdrawSidebarConfig}
            activePath="/cash-withdraw"
            pageTitle="Cash Withdrawal"
        >
            <DashboardSectionHeader
                title="AEPS Service"
                subtitle="Aadhar Enabled Payment System"
                titleClassName="text-[20px] font-medium"
            />
            <div className="p-6 min-h-screen w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((item, i) => (
                        <CardLayout
                            key={i}
                            variant="default"
                            elevation={2}
                            rounded="rounded-xl"
                            className="!bg-[#ffffff] text-center relative !w-[240px] !h-[136px] !rounded-[15px]"
                            width="240px"
                            height="136px"
                            body={
                                <div className="flex flex-col items-start justify-start gap-3">
                                    {/* Main Icon */}
                                    <div className="bg-[#3386FF] rounded-[40px] w-[40px] h-[40px] flex items-center justify-center">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            width={30}
                                            height={30}
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Value + Label */}
                                    <Title level={2} className="!mb-0 !font-bold !text-black text-2xl !leading-none">
                                        {item.value}
                                    </Title>
                                    <Text type="secondary" className="text-base !mt-0 !leading-none">{item.label}</Text>

                                    {/* Floating Badge (top-right corner) */}
                                    <div className="absolute top-6 right-3 bg-[#5298FF54] rounded-[5px] px-1 py-[2px]">
                                        <Image
                                            src={item.badge}
                                            alt="badge"
                                            width={32}
                                            height={13}
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            }
                        />
                    ))}
                </div>

                {/* Tabs (New Transaction, Transaction History) */}
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
        </DashboardLayout>
    );
}
