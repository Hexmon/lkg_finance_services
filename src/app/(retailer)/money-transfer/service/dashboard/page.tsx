"use client";

import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
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
import Beneficiaries from "@/components/money-transfer/Beneficiary";
import NewTransfer from "@/components/money-transfer/NewTransfer";
import Transaction from "@/components/money-transfer/Transaction";

const { Title, Text } = Typography;

export default function MoneyTransferPage() {
    const tabItems: TabItem[] = [
        {
            key: "transfer",
            label: (
                <div className="flex items-center justify-center gap-2">
                    <Image src="/rocket-black.svg" width={24} height={24} alt="Send" className="bg-"/>
                    <span className="font-medium text-black">New Transfer</span>
                </div>
            ),
            content: <NewTransfer/>,
        },
        {
            key: "beneficiaries",
            label: (
                <div className="flex items-center justify-center gap-2 bg-blue-500 rounded-[10px]">
                    <Image src="/beneficiary.svg" width={24} height={24} alt="Beneficiaries" />
                    <span className="font-medium text-black">Beneficiaries</span>
                </div>
            ),
            content: <Beneficiaries/>,
        },
        {
            key: "transactions",
            label: (
                <div className="flex items-center justify-center gap-2">
                    <Image src="/line-blk.svg" width={24} height={24} alt="Transactions" />
                    <span className="font-medium text-black">Transactions</span>
                </div>
            ),
            content: <Transaction/>,
        },
    ];

    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
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
            <div className="!min-h-screen !w-full !mt-4">

                {/* Tabs (New Transfer, Beneficiaries, Transactions) */}
                <div className="!rounded-[20px] !bg-white !px-2 !py-1 !w-full">
                    <SmartTabs
                        items={tabItems}
                        fitted={true}
                        keepAlive={true}
                        durationMs={260}
                        easing="cubic-bezier(.22,1,.36,1)"
                        className="bg-white p-1 rounded-[15px] w-full"
                        tablistClassName="flex gap-0"
                        panelsClassName="mt-6"
                    />

                </div>


                {/* Beneficiary Management */}
                {/* <Card className="rounded-2xl shadow-md mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <Title level={4} className="!mb-0">
                                Beneficiary Management
                            </Title>
                            <Text type="secondary">
                                Manage your saved beneficiaries
                            </Text>
                        </div>
                        <Button type="primary" className="!bg-blue-600">
                            + Add Beneficiary
                        </Button>
                    </div>

                    <div className="bg-[#fefcf7] p-4 rounded-xl flex justify-between items-center mb-6">
                        <div>
                            <Title level={5} className="!mb-1">
                                Amit Kumar’s Saved Accounts
                            </Title>
                            <Text type="secondary">
                                Senders Mobile No. 7032531753
                            </Text>
                        </div>
                        <div className="flex gap-8 items-center">
                            <div>
                                <Text type="secondary">Beneficiary</Text>
                                <Title level={4}>2</Title>
                            </div>
                            <div>
                                <Text type="secondary">Total Limit</Text>
                                <Title level={4}>25,000</Title>
                            </div>
                            <div>
                                <Text type="secondary">Remaining Limit</Text>
                                <Title level={4}>25,000</Title>
                            </div>
                            <Button className="!bg-blue-600 text-white">Change Sender</Button>
                        </div>
                    </div> */}

                    {/* Beneficiary Cards */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: "Rajesh Kumar", bank: "SBI", account: "1234" },
                            { name: "Priya Sharma", bank: "HDFC", account: "1235" },
                            { name: "Amit Singh", bank: "ICICI", account: "1236" },
                            { name: "Neha Gupta", bank: "Axis", account: "1238" },
                            { name: "Rajesh Kumar", bank: "SBI", account: "1239" },
                        ].map((b, idx) => (
                            <Card key={idx} className="rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <UserOutlined className="text-2xl text-blue-600" />
                                    <div>
                                        <Text strong>{b.name}</Text>
                                        <div className="text-xs text-gray-500">{b.bank}</div>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <Text type="secondary">Account: </Text> *****{b.account}
                                </div>
                                <div className="mb-4">
                                    <Text type="secondary">Mobile: </Text> +91 254•••••
                                </div>
                                <Button type="primary" className="!bg-blue-600 w-full">
                                    Send
                                </Button>
                            </Card>
                        ))}
                    </div>
                </Card> */}
            </div>
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
