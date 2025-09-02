"use client";

import React from "react";
import { Card, Typography, Button, Input, Steps } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text, Title } = Typography;
const { Step } = Steps;

export default function FastTagOnboardingPage() {
    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/onboarding"
            pageTitle="FASTag"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="New Customer Onboarding"
                subtitle="Fastag Recharge"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
                imgSrc="/logo.svg"
                imgClassName="!w-[98px] !h-[36px] !mr-8"
            />

            <div className="p-6 min-h-screen !w-full">
                {/* Content Card */}
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto !w-full">
                    {/* Customer Onboarding Title */}
                    <div className="flex items-center gap-2 mb-2 mt-6 ml-4">
                        <Image
                            src="/car.svg"
                            alt="Car Icon"
                            width={18}
                            height={18}
                            className="object-contain"
                        />
                        <Text className="!text-[16px] font-medium">Customer Onboarding</Text>
                    </div>
                    <Text className="block text-gray-500 mb-6 ml-10.5">
                        Register new customers for FASTag services
                    </Text>

                    <div className="flex items-center mb-20 justify-center">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center !gap-0">
                                1
                            </div>
                            <span className="text-sm mt-2">OTP Verification</span>
                        </div>

                        {/* SVG line */}
                        <Image
                            src="/str-line.svg"
                            alt="line"
                            width={60}
                            height={2}
                            className="object-contain mb-6.5"
                        />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                                2
                            </div>
                            <span className="text-sm mt-2">Customer Registration</span>
                        </div>

                        {/* SVG line */}
                        <Image
                            src="/str-line.svg"
                            alt="line"
                            width={60}
                            height={2}
                            className="object-contain mb-6.5"
                        />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                                3
                            </div>
                            <span className="text-sm mt-2">KYC Upload</span>
                        </div>
                    </div>


                    {/* Step 1 - OTP Verification */}
                    <div className="mb-6">
                        <Text className="font-medium block mb-2 ml-10.5">Step 1 : OTP Verification</Text>
                        <div className="mb-4">
                            <Text className="block mb-1 ml-23">Phone Number</Text>
                            <div className="flex justify-center">
                                <Input
                                    placeholder="Enter 10 digit Number"
                                    maxLength={10}
                                    className="!h-[42px] rounded-md !w-[960px]"
                                />
                            </div>

                        </div>
                        <div className="flex justify-center">
                        <Button
                            type="default"
                            className="!bg-[#5298FF54] !h-[42px] !rounded-lg !text-[#3386FF] !font-medium hover:!bg-[#E2E8F0] !w-[445px]"
                        >
                            Send OTP
                        </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
