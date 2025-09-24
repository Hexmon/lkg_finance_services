"use client";

import React from "react";
import {
    Card,
    Typography,
    Form,
    Input,
    Button,
    Upload,
    Select,
    Radio,
    Carousel,
    Skeleton,
    Empty,
} from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
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

    const handleSubmit = (values: string) => {
        console.log("Fund Request values:", values);
    };

    // 🔹 Fetch company bank accounts
    const { data: bankResp, isLoading: banksLoading } = useCompanyBankAccounts();
    const accounts: any[] = bankResp?.data ?? [];

    // 🔹 Carousel control + indicator
    const carouselRef = React.useRef<CarouselRef>(null);
    const [current, setCurrent] = React.useState(0);

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
                            <Text className="!text-[14px] !font-medium">Please upload your transaction supported document.</Text>
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
                        {/* 🔸 ONLY THIS PORTION SCROLLS (Carousel) */}
                        <div className="flex gap-6 mt-8 mb-4 justify-center items-center w-full">
                            <div className="w-full">
                                {banksLoading ? (
                                    <div className="p-4">
                                        <Skeleton active paragraph={{ rows: 4 }} />
                                    </div>
                                ) : accounts.length === 0 ? (
                                    <Empty description="No bank accounts configured" />
                                ) : (
                                    <>
                                        <Carousel
                                            ref={carouselRef}
                                            dots={false}           // custom dots below
                                            infinite={false}       // clearer for small lists
                                            autoplay={false}
                                            afterChange={(i) => setCurrent(i)}
                                            className="w-full"
                                        >
                                            {accounts.map((acc) => {
                                                const bankName = acc?.bank_name ?? "—";
                                                const branchName = acc?.branch_name ?? acc?.ifsc_details?.branch ?? "—";
                                                const ifsc = acc?.ifsc_code ?? acc?.ifsc_details?.ifsc ?? "—";
                                                const maskedAcc = acc?.last4 ? `•••• ${acc.last4}` : "—";
                                                const holderName = acc?.account_holder_name ?? "—";
                                                const isActive = !!acc?.is_active;

                                                return (
                                                    <div key={acc?.account_id} className="px-1">
                                                        <div className="flex items-start gap-4 shadow-md rounded-2xl p-4 w-full">
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

                                                            {/* Content */}
                                                            <div className="flex-1">
                                                                {/* Header */}
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex flex-col mr-6">
                                                                        <Text strong className="text-[15px] font-medium">
                                                                            {holderName}
                                                                        </Text>
                                                                        <Text type="secondary" className="text-[14px]">
                                                                            {bankName}
                                                                        </Text>
                                                                    </div>
                                                                    {isActive && (
                                                                        <Image
                                                                            src="/tick-blue.svg"
                                                                            alt="active account"
                                                                            width={15}
                                                                            height={15}
                                                                            className="ml-6"
                                                                        />
                                                                    )}
                                                                </div>

                                                                {/* Details (static Name row + dynamic rest) */}
                                                                <div className="mt-3 space-y-1">
                                                                    {/* Static row as requested */}
                                                                    <div className="flex justify-between">
                                                                        <Text type="secondary">Name:</Text>
                                                                        <Text className="font-semibold">
                                                                            {banksLoading ? "—" : "LKG FINTECH PVT LTD (No Cash Deposit)"}
                                                                        </Text>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <Text type="secondary">Bank:</Text>
                                                                        <Text className="font-semibold">{bankName}</Text>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <Text type="secondary"> Bank Account No.:</Text>
                                                                        <Text strong>{maskedAcc}</Text>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <Text type="secondary">IFSC CODE:</Text>
                                                                        <Text className="font-semibold">{ifsc}</Text>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <Text type="secondary">Branch Name: </Text>
                                                                        <Text className="font-semibold">{branchName}</Text>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </Carousel>

                                        {/* 🔹 Custom indicator / controls */}
                                        <div className="mt-3 flex items-center justify-between px-2">
                                            {/* Dots */}
                                            <div className="flex items-center gap-2">
                                                {accounts.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => carouselRef.current?.goTo(i, false)}
                                                        className={`h-2 w-2 rounded-full transition-all ${i === current ? "w-4 h-2 rounded-full bg-[#3386FF]" : "bg-[#D9D9D9]"
                                                            }`}
                                                        aria-label={`Go to slide ${i + 1}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* 1 / n */}
                                            <Text type="secondary" className="text-[12px]">
                                                {current + 1} / {accounts.length}
                                            </Text>

                                            {/* Prev / Next */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="small"
                                                    icon={<LeftOutlined />}
                                                    onClick={() => carouselRef.current?.prev()}
                                                    disabled={current === 0}
                                                />
                                                <Button
                                                    size="small"
                                                    icon={<RightOutlined />}
                                                    onClick={() => carouselRef.current?.next()}
                                                    disabled={current === accounts.length - 1}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
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
                                    Please do not close the window, refresh the page, press stop or the back button while the transaction
                                    is being processed.
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
