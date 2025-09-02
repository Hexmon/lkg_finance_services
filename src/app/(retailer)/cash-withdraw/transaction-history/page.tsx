"use client";

import React from "react";
import { Card, Typography, Button, Input, Select, Form, Table } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";


const { Title, Text } = Typography;
const { Option } = Select;

export default function CashWithdrawPage() {
    const stats = [
        {
            icon: "/line-bar.svg",
            badge: "/fif.svg",
            value: "₹1,25,000",
            label: "Today's Transactions",
        },
        {
            icon: "/round-r.svg",
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
            icon: "/two-person.svg",
            badge: "/fif.svg",
            value: "89",
            label: "Total Customers",
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
            />
            <div className="p-6 min-h-screen w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((item, i) => (
                        <CardLayout
                            key={i}
                            variant="default"
                            elevation={2}
                            rounded="rounded-xl"
                            className="!bg-[#f9f5ec] text-center relative !w-[240px] !h-[136px] !rounded-[15px]"
                            width="240px"
                            height="136px"
                            body={
                                <div className="flex flex-col items-start justify-start gap-3">
                                    {/* Main Icon */}
                                    <Image
                                        src={item.icon}
                                        alt={item.label}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />

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
                <div className="flex gap-[10px] mb-6 relative -left-px">
                    {/* Active Tab */}
                    <Button className="!flex !items-center !w-[283px] !h-[60px] !rounded-[15px] !pt-[17px] !pr-[22px] !pb-[17px] !pl-[22px] !bg-blue-600 !text-white !shadow-sm !opacity-100">
                        <Image
                            src="/rocket.svg"
                            alt="person logo"
                            height={16}
                            width={16}
                        />
                        New Transaction
                    </Button>

                    {/* Inactive Tab */}
                    <Button className="!flex !items-center !w-[283px] !h-[60px] !rounded-[15px] !pt-[17px] !pr-[22px] !pb-[17px] !pl-[22px] !bg-neutral-100 !text-neutral-700 !shadow-sm !opacity-100">
                        <Image
                            src="/line-blk.svg"
                            alt="person logo"
                            height={16}
                            width={16}
                        />
                        Transaction History
                    </Button>
                </div>

                {/* Transaction History */}
                <Card className="rounded-2xl shadow-md">
                    <div className="flex items-center gap-2 !mb-0 ml-8">
                        <Title level={4} className="!mb-0">
                            Transaction History
                        </Title>
                    </div>
                    <div className="!mb-4 ml-8">
                        <Text className="secondary !font-[300]">Recent money transfer transactions</Text>
                    </div>

                    {/* Table Section */}
                    <div className="px-6 pb-6">
                        <Table
                            pagination={false}
                            className="custom-table"
                            columns={[
                                {
                                    title: "Customer",
                                    dataIndex: "customer",
                                    key: "customer",
                                    render: (text: string, record: any) => (
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/transaction-p.svg"
                                                alt="user"
                                                width={38}
                                                height={37}
                                                
                                            />
                                            <div>
                                                <div className="font-medium">{record.name}</div>
                                                <div className="text-xs text-gray-500">{record.txnId}</div>
                                            </div>
                                        </div>
                                    ),
                                },
                                { title: "Service", dataIndex: "service", key: "service", render: (val: string) => <Text className="text-black font-medium">{val}</Text> },
                                { title: "Bank", dataIndex: "bank", key: "bank", render: (val: string) => <Text className="text-black font-medium">{val}</Text> },
                                { title: "Amount", dataIndex: "amount", key: "amount", render: (val: string) => <Text className="text-black font-medium">{val}</Text> },
                                {
                                    title: "Commission",
                                    dataIndex: "commission",
                                    key: "commission",
                                    render: (val: string) => <span className="text-blue-600">{val}</span>,
                                },
                                {
                                    title: "Status",
                                    dataIndex: "status",
                                    key: "status",
                                    render: (val: string) => (
                                        <span className="px-2 py-1 rounded-md bg-green-100 text-green-600 text-xs">
                                            {val}
                                        </span>
                                    ),
                                },
                                { title: "Time", dataIndex: "time", key: "time" },
                                {
                                    title: "Actions",
                                    key: "actions",
                                    render: () => (
                                        <button className="text-gray-600 hover:text-black">
                                            <Image src="/eye.svg" alt="view" width={46} height={40} />
                                        </button>
                                    ),
                                },
                            ]}
                            dataSource={[
                                {
                                    key: "1",
                                    name: "Rajesh Kumar",
                                    txnId: "TXN123456789",
                                    service: "Withdrawal",
                                    bank: "SBI",
                                    amount: "₹5,000",
                                    commission: "₹20",
                                    status: "Success",
                                    time: "2 min ago",
                                },
                                {
                                    key: "2",
                                    name: "Rajesh Kumar",
                                    txnId: "TXN123456789",
                                    service: "Withdrawal",
                                    bank: "SBI",
                                    amount: "₹5,000",
                                    commission: "₹20",
                                    status: "Success",
                                    time: "2 min ago",
                                },
                                {
                                    key: "3",
                                    name: "Rajesh Kumar",
                                    txnId: "TXN123456789",
                                    service: "Withdrawal",
                                    bank: "SBI",
                                    amount: "₹5,000",
                                    commission: "₹20",
                                    status: "Success",
                                    time: "2 min ago",
                                },
                            ]}
                        />
                    </div>
                </Card>

            </div>
        </DashboardLayout>
    );
}
