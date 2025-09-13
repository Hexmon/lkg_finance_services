"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function FastTagCustomerRegistrationPage() {
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

            <div className="p-6 min-h-screen w-full ">
                {/* Content Card */}
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full ">
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

                    {/* Stepper */}
                    <div className="flex items-center mb-16 justify-center">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <Image
                                src="/verified-b.svg"
                                alt="otp verification"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <span className="text-sm mt-2">OTP Verification</span>
                        </div>

                        {/* Line */}
                        <Image
                            src="/str-line.svg"
                            alt="line"
                            width={60}
                            height={2}
                            className="object-contain self-center mb-6.5"
                        />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center">
                                2
                            </div>
                            <span className="text-sm mt-2">Customer Registration</span>
                        </div>

                        {/* Line */}
                        <Image
                            src="/str-line.svg"
                            alt="line"
                            width={60}
                            height={2}
                            className="object-contain self-center mb-6.5"
                        />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                                3
                            </div>
                            <span className="text-sm mt-2">KYC Upload</span>
                        </div>
                    </div>

                    {/* Step 2 - Customer Registration */}
                    <div className="mb-6">
                        <Text className="font-medium block mb-6 ml-10.5">
                            Step 2 : Customer Registration
                        </Text>

                        <div className="space-y-4 max-w-3xl mx-auto">
                            {/* Full Name */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Full Name</Text>
                                <Input
                                    placeholder="Enter Full Name"
                                    className="!h-[42px] rounded-md"
                                />
                            </div>

                            {/* Email Address */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Email Address</Text>
                                <Input
                                    placeholder="Enter Email Address"
                                    className="!h-[42px] rounded-md"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Address</Text>
                                <Input
                                    placeholder="Enter Address"
                                    className="!h-[42px] rounded-md"
                                />
                            </div>
                        </div>  

                        <div className="flex justify-center mt-8">
                            <Button
                                type="default"
                                className="!bg-[#5298FF54] !h-[42px] !rounded-lg !text-[#3386FF] !font-medium hover:!bg-[#E2E8F0] !w-[445px]"
                            >
                                Continue to KYC
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}