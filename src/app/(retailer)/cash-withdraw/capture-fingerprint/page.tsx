"use client";

import React from "react";
import { Card, Typography, Button, Input, Select, Form } from "antd";
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



                {/* AEPS Services */}
                <Card className="rounded-2xl !shadow-md !mb-6 !h-[250px]">
                    <Title level={4} className="!mb-3">Select AEPS Service</Title>
                    <Text className="secondary !mt-0" >Choose the service you want to provide.</Text>
                    <div className="flex justify-center items-center gap-2">

                        <Image
                            src="/cash-withdraw.svg"
                            alt="person logo"
                            height={137}
                            width={139}
                            className="object-cover rounded-xl"
                        />
                        <Image
                            src="/balance-en.svg"
                            alt="person logo"
                            height={137}
                            width={139}
                            className="object-cover rounded-xl"
                        />
                        <Image
                            src="/mini-stmt.svg"
                            alt="person logo"
                            height={137}
                            width={139}
                            className="object-cover rounded-xl"
                        />
                    </div>
                </Card>

                {/* Transaction Form */}
                <Card className="rounded-2xl shadow-md">
                    <div className="flex items-center gap-2 !mb-0">
                        <Image
                            src="/shield-blk.svg"
                            alt="person logo"
                            height={28}
                            width={26}
                            className="object-cover rounded-xl"
                        />
                        <Title level={4} className="!mb-0">
                            AEPS Transaction Details
                        </Title>

                    </div>
                    <div className="!mb-4 ml-8">
                        <Text className="secondary" >Fill in the customer and transaction</Text>
                    </div>


                    <Form layout="vertical" className="!ml-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Form.Item label="Customer Name *">
                                <Input placeholder="Enter Customer Name" />
                            </Form.Item>

                            <Form.Item label="Choose Bank *">
                                <Select placeholder="Choose Bank" className="w-full">
                                    <Option value="sbi">SBI</Option>
                                    <Option value="hdfc">HDFC</Option>
                                    <Option value="icici">ICICI</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Aadhaar Number *">
                                <Input placeholder="Enter Aadhaar Number" />
                            </Form.Item>

                            <Form.Item label="Mobile Number *">
                                <Input placeholder="+91 ••••••••••" />
                            </Form.Item>

                            <Form.Item label="Amount *">
                                <Input placeholder="Enter Amount" />
                            </Form.Item>
                        </div>
                    </Form>


                    {/* Fingerprint Scanner */}
                    <div className="text-center my-6 flex flex-col justify-center items-center">
                        <Image
                            src="/biometric.svg"
                            alt="Biometric Verification"
                            width={100}   // same as h-12
                            height={100}  // same as w-12
                            className="object-contain "
                        />
                        <div className="!mb-2 !text-black !font-poppins !text-[15px] font-[450]">Capture Fingerprint</div>
                        <Text className="secondary !mt-0 !mb-5 !text-[10px] font-semibold !text-[#9A9595]">Ask customer to place finger on the scanner</Text>
                        <Button type="primary" className="!bg-blue-600 !rounded-lg px-10 py-2 !w-[219px] !h-[38]">
                            <Image
                            src="/scanner-w.svg"
                            alt="Biometric Verification"
                            width={15}   // same as h-12
                            height={15}  // same as w-12
                            className="object-contain "
                        />
                            Scan Now
                        </Button>
                    </div>

                    <Button
                        disabled
                        block
                        className="!bg-[#5298FF54] !text-[#FFFFFF] !rounded-lg py-2 mt-4 "
                    >
                        Process AEPS Transaction
                    </Button>
                </Card>
            </div>
        </DashboardLayout>
    );
}
