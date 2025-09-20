"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Form, Input, Button, Table, Upload, Select, Radio } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import TransactionsTableFundReq from "@/components/money-transfer/FundRequest";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { useCompanyBankAccounts } from "@/features/retailer/fund_request/data/hooks";

const { Text } = Typography;
const { Option } = Select;

export default function FundRequestPage() {
    const [form] = Form.useForm();
    const [balance, setBalance] = useState<string>("₹25,000");

    const handleSubmit = (values: string) => {
        console.log("Fund Request values:", values);
    };

    const transactionData = [
        {
            key: "1",
            date: "24 Aug 25, 14:30PM",
            description: "Fund Added by UPI",
            type: "Credited",
            amount: "₹5,000",
            balance: "₹10,000",
            status: "Completed",
        },
        {
            key: "2",
            date: "24 Aug 25, 14:30PM",
            description: "Fund Added by UPI",
            type: "Debited",
            amount: "₹1,245",
            balance: "₹16,000",
            status: "Failed",
        },
    ];

    const columns = [
        {
            title: "Date & Time",
            dataIndex: "date",
            key: "date",
            render: (text: string) => <Text className="text-[#9A9595] text-[14px]">{text}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text: string) => <Text className="text-[#232323] text-[14px]">{text}</Text>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (text: string) => (
                <Text className={`text-${text === "Credited" ? "#0BA82F" : "#FF4D4F"} font-semibold text-[12px]`}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text: string) => <Text className="text-[#232323] text-[14px]">{text}</Text>,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            render: (text: string) => <Text className="text-[#232323] text-[14px]">{text}</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => (
                <Text
                    className={`${text === "Completed" ? "text-[#0BA82F] bg-[#0BA82F36]" : "text-[#FF4D4F] bg-[#FF4D436]"
                        } font-medium px-2 py-1 rounded-2xl text-[12px]`}
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "Help",
            key: "help",
            render: () => (
                <Button type="link" className="text-[#3386FF] text-[14px]">
                    ?
                </Button>
            ),
        },
    ];

    // 🔹 Fetch company bank accounts
    const { data: bankResp, isLoading: banksLoading } = useCompanyBankAccounts();

    // 🔹 Pick first active or first account
    const account = useMemo(() => {
        const list = bankResp?.data ?? [];
        return list.find((a: { is_active: any; }) => a.is_active) ?? list[0];
    }, [bankResp]);

    // 🔹 Safely map fields to UI (placeholders keep UI stable)
    const holderName = account?.account_holder_name ?? "—";
    const bankName = account?.bank_name ?? "—";
    const branchName = account?.branch_name ?? account?.ifsc_details?.branch ?? "—";
    const ifsc = account?.ifsc_code ?? account?.ifsc_details?.ifsc ?? "—";
    const maskedAcc = account?.last4 ? `•••• ${account.last4}` : "—";

    return (
        <DashboardLayout activePath="/wallet" sections={moneyTransferSidebarConfig} pageTitle="Fund Request">
            <DashboardSectionHeader title="" />
            <div className="p-6 space-y-6">
                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Fund Request Form */}
                    <Card className="!shadow-md !rounded-2xl !p-6 !space-y-4">
                        <div className="!flex !justify-end !gap-3 !mb-3 ">
                            <Upload>
                                <Button className="!bg-[#3386FF] !w-[129px] !h-[35px] !text-white !rounded-xl !text-[12px] !font-medium">
                                    Upload Receipt
                                </Button>
                            </Upload>
                            <Button className="!bg-[#3386FF] !w-[129px] !h-[35px] !text-white !rounded-xl !text-[12px] !font-medium">
                                Reset
                            </Button>
                        </div>
                        <div className="text-center mb-4">
                            <Text className="!text-[14px] !font-medium">
                                Please upload your transaction supported document.
                            </Text>
                        </div>

                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item name="receiver" className="" rules={[{ message: "Please select a receiver" }]}>
                                <div className="flex items-center gap-6">
                                    <label className="!text-[14px] !font-medium !whitespace-nowrap">Payment Receiver</label>
                                    <Radio.Group className="flex gap-4">
                                        <Radio value="Company" className="!text-[14px] !text-[#787878]">
                                            Company
                                        </Radio>
                                        <Radio value="Distributor" className="!text-[14px] !text-[#787878]">
                                            Distributor
                                        </Radio>
                                    </Radio.Group>
                                </div>
                            </Form.Item>

                            <Form.Item name="depositDate" label="Deposit Date" className="!text-[14px] !font-medium">
                                <Input placeholder="Deposit Date" />
                            </Form.Item>
                            <Form.Item name="paymentMode" label="Payment Mode" className="!text-[14px] !font-medium">
                                <Select>
                                    <Option value="Company">Net Banking Transfer/IMPS/RTGS/NEFT</Option>
                                    <Option value="Distributor">UPI(PhonePay/Google Pay/Paytm)</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="amount" label="Amount" className="!text-[14px] !font-medium">
                                <Input placeholder="Enter Amount" />
                            </Form.Item>
                            <Form.Item name="ref" label="Transaction Ref/UTR" className="!text-[14px] !font-medium">
                                <Input placeholder="Enter Reference No./UTR No." />
                            </Form.Item>
                            <Form.Item name="remark" label="Remark" className="!text-[14px] !font-medium">
                                <Input.TextArea placeholder="Remark (if any)" className="!h-[39px]" rows={3} />
                            </Form.Item>
                            <div className="flex items-center justify-center">
                                <Button type="primary" htmlType="submit" className="!w-[198px] !h-[40px] !rounded-2xl ">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card>

                    {/* Right: Info & Instructions */}
                    <Card className="!shadow-md !rounded-2xl !p-6 !space-y-4">
                        <div className="flex gap-6 mt-8  mb-6 justify-center items-center !w-full">
                            <div className="flex items-start gap-4 shadow-md rounded-2xl p-4 w-full cursor-pointer transition">
                                <div className="flex-1">
                                    <div className="flex justify-start items-start">
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
                                        <div className="flex flex-col ml-3 mr-60">
                                            <Text strong className="text-[15px] font-medium">
                                                {banksLoading ? "Loading…" : holderName}
                                            </Text>
                                            <Text type="secondary" className="text-[14px]">
                                                {banksLoading ? "—" : bankName}
                                            </Text>
                                        </div>

                                        {/* Right Tick */}
                                        <Image src="/tick-blue.svg" alt="tick" width={15} height={15} className="ml-6" />
                                    </div>

                                    {/* Account & IFSC */}
                                    <div className="mt-3 space-y-1">
                                        <div className="flex justify-between">
                                            <Text type="secondary">Name:</Text>
                                            <Text className="font-semibold">{banksLoading ? "—" : holderName}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary">Bank:</Text>
                                            <Text className="font-semibold">{banksLoading ? "—" : bankName}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary"> Bank Account No.:</Text>
                                            <Text strong>{banksLoading ? "—" : maskedAcc}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary">IFSC CODE:</Text>
                                            <Text className="font-semibold">{banksLoading ? "—" : ifsc}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary">Branch Name: </Text>
                                            <Text className="font-semibold">{banksLoading ? "—" : branchName}</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="!rounded-2xl !shadow-md !col-span-2 !h-[510pxs]">
                            <Text className="!text-[15px] !font-medium !text-[#3386FF] !block !mb-2">
                                General Instructions
                            </Text>
                            <p className="!space-y-2 !text-[12px] !text-[#7E7A7A] !font-medium">
                                How to add wallet balance in LKG
                            </p>
                            <ul className="!list-disc !ml-6 !space-y-2 !text-[12px] !text-[#7E7A7A] !font-medium">
                                <li>
                                    Load balance (PG) will update your wallet limit instantly once the transaction is successfull.
                                </li>
                                <li>
                                    The receiver will manually verify the fund request, which may take a few minutes during working days.
                                </li>
                                <li>For MDR charges kindly check the following details.</li>
                                <li>
                                    Please do not close the window, refresh the page, press stop or the back button while the transaction is being processed.
                                </li>
                            </ul>
                            <Text className="!text-[15px] !font-medium !text-[#232323] !block !mb-2 !mt-2">Please Note: </Text>
                            <p className="!text-[12px] !text-[#7E7A7A] !font-medium">
                                This service adds money to the wallet via NEFT/IMPS/RTGS/UPI/Direct Bank Deposit option and is subject
                                to verification by LKG. It may take several minutes.
                            </p>
                        </Card>
                    </Card>
                </div>

                {/* Transactions Table */}
                <TransactionsTableFundReq />
            </div>
        </DashboardLayout>
    );
}
