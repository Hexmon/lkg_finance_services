"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import {
    UserOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;

export default function MoneyTransferPage() {
    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
            <DashboardSectionHeader
                title="Money Transfer Service"
                subtitle="Send Money Instantly Across India"
                titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
                arrowClassName="!text-[#3386FF]"
            />
            <div className="p-6 min-h-screen w-full">


                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="rounded-xl shadow-md text-center">
                        <Text type="secondary">Today's Transfer</Text>
                        <Title level={3}>₹2,45,000</Title>
                    </Card>
                    <Card className="rounded-xl shadow-md text-center">
                        <Text type="secondary">Success Rate</Text>
                        <Title level={3}>99.5%</Title>
                    </Card>
                    <Card className="rounded-xl shadow-md text-center">
                        <Text type="secondary">Total Beneficiaries</Text>
                        <Title level={3}>156</Title>
                    </Card>
                    <Card className="rounded-xl shadow-md text-center">
                        <Text type="secondary">Commission Earned</Text>
                        <Title level={3}>₹1,240</Title>
                    </Card>
                </div>

                {/* Tabs (New Transfer, Beneficiaries, Transactions) */}
                <div className="flex gap-3 mb-6">
                    <Button className="rounded-md px-6 py-2 shadow-sm">New Transfer</Button>
                    <Button className="rounded-md px-6 py-2 shadow-sm bg-blue-600 text-white">
                        Beneficiaries
                    </Button>
                    <Button className="rounded-md px-6 py-2 shadow-sm">Transactions</Button>
                </div>

                {/* Beneficiary Management */}
                <Card className="rounded-2xl shadow-md mb-6">
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
                    </div>

                    {/* Beneficiary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </Card>
            </div>
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
