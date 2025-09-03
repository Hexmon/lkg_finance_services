"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function FastTagCustomerKYCUploadPage() {
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

            {/* Page Content */}
            <div className="p-6 min-h-screen w-full">
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
                    {/* Header: Title + Subtitle */}
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
                    <div className="flex items-center justify-center mb-16">
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
                            <Image
                                src="/verified-b.svg"
                                alt="customer registration"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
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
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center text-sm font-medium">
                                3
                            </div>
                            <span className="text-sm mt-2">KYC Upload</span>
                        </div>
                    </div>

                    <Card
                        className="w-full max-w-[959px] min-w-[1100px] min-h-[339px] relative left-[21px] rounded-[15px] opacity-100 rotate-0 bg-[#FFF7EC] shadow-sm p-6"
                    >
                        {/* Step Title */}
                        <Text className="font-medium block mb-10 text-[15px]">
                            Step 3 : KYC Upload
                        </Text>

                        {/* Upload Box */}
                        <Text className="font-medium block mb-1 ml-35 text-[15px]">Upload KYC Documents</Text>
                        <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full max-w-3xl mx-auto h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                            <Image
                                src="/upload-icon.svg"
                                alt="upload"
                                width={30}
                                height={30}
                                className="mb-2"
                            />
                            <p className="text-center">Upload Aadhaar, PAN, or Driver's License</p>
                            <button className="text-blue-500 mt-1 hover:underline">
                                Choose File
                            </button>
                        </div>

                        {/* Button */}
                        <div className="flex justify-center mt-10">
                            <Button
                                type="default"
                                className="!bg-[#5298FF54] !text-[#3386FF] !rounded-lg !h-[42px] !font-medium !w-[445px] hover:!bg-[#2465c3]"
                            >
                                Complete Registration
                            </Button>
                        </div>
                    </Card> 
                </Card>
            </div>
        </DashboardLayout>
    );
}
