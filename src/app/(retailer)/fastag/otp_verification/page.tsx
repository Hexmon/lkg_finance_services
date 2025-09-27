"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function FastTagCustomerOtpVerification() {
    const router = useRouter();

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/otpverfication"
            pageTitle="FASTag"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="Fastag"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
            // imgSrc="/logo.svg"
            // imgClassName="!w-[98px] !h-[36px] !mr-8"
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
                        <Text className="!text-[16px] font-medium">OTP Verification</Text>
                    </div>
                    <Text className="block text-gray-500 mb-6 ml-10.5">
                        Register new customers for FASTag services
                    </Text>

                    {/* Stepper */}
                    <div className="flex items-center mb-16 justify-center">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center">
                                1
                            </div>
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
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
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
                            <span className="text-sm mt-2">Vehicle Registration</span>
                        </div>

                        {/* Line */}
                        <Image
                            src="/str-line.svg"
                            alt="line"
                            width={60}
                            height={2}
                            className="object-contain self-center mb-6.5"
                        />

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                                4
                            </div>
                            <span className="text-sm mt-2">KYC Upload</span>
                        </div>
                    </div>

                    {/* Step 2 - Customer Registration */}
                    <div className="mb-6">
                        <Text className="font-medium block mb-6 ml-10.5">
                            Step 1 : OTP Verification
                        </Text>

                        <div className="space-y-4 max-w-5xl mx-auto">
                            {/* Full Name */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Mobile Number</Text>
                                <Input
                                    placeholder="Enter 10 digit Number"
                                    className="!h-[42px] rounded-md"
                                />
                            </div>


                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                type="default"
                                className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-medium hover:!bg-[#E2E8F0] !w-[445px]"
                                onClick={()=> router.push("/fastag/customer_registration")}
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