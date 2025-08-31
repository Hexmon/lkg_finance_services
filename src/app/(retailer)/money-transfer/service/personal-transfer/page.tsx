"use client";

import React from "react";
import { Card, Typography, Button, Input, Select } from "antd";
import {
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;
const { Option } = Select;

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

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    <Button className="rounded-md px-6 py-2 shadow-sm bg-blue-600 text-white">
                        New Transfer
                    </Button>
                    <Button className="rounded-md px-6 py-2 shadow-sm">
                        Beneficiaries
                    </Button>
                    <Button className="rounded-md px-6 py-2 shadow-sm">
                        Transactions
                    </Button>
                </div>

                {/* Transfer Form */}
                <Card className="rounded-2xl shadow-md mb-6">
                    <Title level={4} className="mb-4">Transfer</Title>
                    <Text type="secondary">Choose the best option for your transfer</Text>

                    {/* Beneficiary Card */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-3 mt-6 mb-6 bg-[#fefcf7] p-4 rounded-lg shadow-sm w-[345px]">
                            <UserOutlined className="text-2xl text-blue-600" />
                            <div>
                                <Text strong>Rajesh Kumar</Text>
                                <div className="text-xs text-gray-500">SBI</div>
                                <div className="text-sm">Account: *****1234</div>
                                <div className="text-sm">IFSC: SBIFN89</div>
                            </div>
                        </div>
                    </div>



                    {/* Mode of Transfer */}
                    <div className="mb-4">
                        <Text className="block mb-2">Mode of Transfer</Text>
                        <Select placeholder="Select Mode" className="w-full">
                            <Option value="imps">IMPS - Instant (24x7) | Fee ₹5</Option>
                            <Option value="neft">NEFT - Working Hours | Fee ₹2.5</Option>
                            <Option value="rtgs">RTGS - 30 min | Fee ₹25</Option>
                        </Select>
                    </div>

                    {/* Transfer Amount */}
                    <div className="mb-4">
                        <Text className="block mb-2">Transfer Amount</Text>
                        <Input placeholder="Min: ₹100, Max: ₹2,00,000" />
                    </div>

                    {/* Purpose of Transfer */}
                    <div className="mb-6">
                        <Text className="block mb-2">Purpose of Transfer</Text>
                        <Select placeholder="Select Purpose" className="w-full">
                            <Option value="family">Family Support</Option>
                            <Option value="business">Business Payment</Option>
                            <Option value="others">Others</Option>
                        </Select>
                    </div>

                    {/* Submit */}
                    <Button type="primary" className="!bg-blue-600 w-full py-2 text-lg rounded-lg">
                        Transfer Money
                    </Button>
                </Card>
            </div>
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
