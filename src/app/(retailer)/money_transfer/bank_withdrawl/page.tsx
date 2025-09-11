"use client";

import React, { useState } from "react";
import { Card, Typography, Form, Input, Button, Table, Select } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Image from "next/image";
import { accounts } from "@/config/app.config";

const { Text } = Typography;
const { Option } = Select;

type FormValues = {
    amount: number;
    transferMode: string;
};

export default function BankWithdrawalPage() {
    const [form] = Form.useForm<FormValues>();

    const handleSubmit = (values: FormValues) => {
        console.log("Submitted:", values);
    };

    const transactionData = [
        {
            key: "1",
            txnId: "TXN123456789",
            date: "24 Aug 25, 14:30PM",
            amount: "₹190",
            category: "WALLET SWAP",
            status: "Success",
        },
    ];

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "txnId",
            key: "txnId",
            render: (txnId: string) => (
                <span className="text-[#232323] font-medium text-[14px]">{txnId}</span>
            ),
        },
        {
            title: "Date & Time",
            dataIndex: "date",
            key: "date",
            render: (date: string) => (
                <span className="text-[#9A9595] font-medium text-[14px]">{date}</span>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: string) => (
                <span className="text-[#232323] font-medium text-[14px]">{amount}</span>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category: string) => (
                <span className="text-[#232323] font-medium text-[14px]">{category}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <span className="text-[#0BA82F] font-medium bg-[#0BA82F36] px-2 py-1 rounded-2xl text-[12px]">
                    {status}
                </span>
            ),
        },
    ];
    const [selectedId, setSelectedId] = useState<number | null>(1);

    return (
        <DashboardLayout
            activePath="/wallet"
            sections={billPaymentSidebarConfig}
            pageTitle="Bank Withdrawal"
        >
            <div className="p-6 min-h-screen !mt-0">
                {/* Bank Withdrawal Form */}
                <Card className="!rounded-2xl !shadow-md !mb-6">
                    <Text className="!text-[15px] !font-medium">Bank Withdrawal</Text>

                    {/* Bank Accounts Section */}
                    <div className="flex gap-6 mt-8 flex-wrap mb-6 justify-center items-center">
                        {accounts.map((acc) => (
                            <div
                                key={acc.id}
                                onClick={() => setSelectedId(acc.id)}
                                className={`flex items-start gap-4 border rounded-2xl p-4 w-[280px] cursor-pointer transition ${selectedId === acc.id ? "border-blue-500 shadow-md" : "border-gray-200"
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        {/* Avatar */}
                                        <div className="bg-[#5298FF54] rounded-full w-[55px] h-[55px] flex items-center justify-center shrink-0">
                                            <Image
                                                src="/person-blue.svg"
                                                alt="person image"
                                                width={28}
                                                height={28}
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Name + Bank */}
                                        <div className="flex flex-col ml-3">
                                            <Text strong className="text-[15px]">
                                                {acc.name}
                                            </Text>
                                            <Text type="secondary" className="text-[14px]">
                                                {acc.bank}
                                            </Text>
                                        </div>

                                        {/* Right Tick */}
                                        <Image
                                            src={selectedId === acc.id ? "/tick-blue.svg" : "/tick-gray.svg"}
                                            alt="tick"
                                            width={15}
                                            height={15}
                                            className="ml-6"
                                        />
                                    </div>

                                    {/* Account & IFSC */}
                                    <div className="mt-3 space-y-1">
                                        <div className="flex justify-between">
                                            <Text type="secondary">Account:</Text>
                                            <Text className="font-semibold">{acc.account}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary">IFSC Code:</Text>
                                            <Text strong>{acc.ifsc}</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transfer Form */}
                    <Form<FormValues>
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="!text-[13px]"
                    >
                        <Form.Item
                            label={
                                <span className="text-[15px] font-semibold leading-8">
                                    Transfer Mode
                                </span>
                            }
                            name="transferMode"
                            rules={[{ required: true, message: "Please select transfer mode" }]}
                        >
                            <Select placeholder="Select Mode" size="large">
                                <Option value="IMPS">IMPS</Option>
                                <Option value="NEFT">NEFT</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[15px] font-semibold leading-8">
                                    Enter Amount *
                                </span>
                            }
                            name="amount"
                            rules={[{ required: true, message: "Please enter amount" }]}
                        >
                            <Input size="large" placeholder="Enter Amount" />
                        </Form.Item>

                        {/* Note */}
                        <Text type="secondary" className="block mb-4 !text-[12px]">
                            <span className="font-semibold text-black mr-1">Please Note:</span>
                            <ul className="list-disc ml-6">
                                <li>
                                    IMPS Service Will Charge for real-time settlement. It will
                                    charge ₹5 for less than 25000 and ₹15 for upto 2lac.
                                </li>
                                <li>NEFT/IMPS Charges Waived.</li>
                            </ul>
                        </Text>

                        {/* Buttons */}
                        <div className="flex gap-4 justify-center items-center">
                            <Button size="large" className="!px-8 !h-[33px] !w-[199px]">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="!bg-[#3386FF] !px-8 !h-[33px] !w-[199px]"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* Transaction History */}
                <Card className="!rounded-2xl !shadow-md">
                    <Text className="!text-[15px] !font-medium mb-4 block">
                        Transfer History
                    </Text>
                    <Table
                        dataSource={transactionData}
                        columns={columns}
                        pagination={false}
                        bordered={false}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
