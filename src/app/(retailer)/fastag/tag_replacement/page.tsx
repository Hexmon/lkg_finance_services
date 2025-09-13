"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text, Title } = Typography;

export default function FastTagReplacementPage() {
    return (
        <DashboardLayout
            sections={billPaymentSidebarConfig}
            activePath="/fastag/replacement"
            pageTitle="FASTag Recharge"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="Tag Replacement"
                subtitle="Replace expired, stolen, or damaged FASTag"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
                imgSrc="/logo.svg"
                imgClassName="!w-[120px] !h-[36px] !mr-8"
                showBack
            />

            {/* Page Content */}
            <div className="p-6 min-h-screen w-full">
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <Image
                            src="/car.svg"
                            alt="Tag Icon"
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                        <Text className="!text-[16px] font-medium">Tag Replacement</Text>
                    </div>
                    <Text className="block text-gray-500 mb-6 ml-6">
                        Replace expired, stolen, or damaged FASTag
                    </Text>

                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-10 mb-12">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center text-sm font-medium">
                                1
                            </div>
                            <span className="text-sm mt-2">Select Tag</span>
                        </div>

                        {/* Line */}
                        <div className="w-16 h-[2px] bg-gray-300" />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
                                2
                            </div>
                            <span className="text-sm mt-2">Identify Issue</span>
                        </div>

                        {/* Line */}
                        <div className="w-16 h-[2px] bg-gray-300" />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
                                3
                            </div>
                            <span className="text-sm mt-2">Replacement</span>
                        </div>
                    </div>

                    {/* Step Section */}
                    <div className="flex justify-center items-center">
                        <Card className="w-full max-w-[1050px] mx-auto rounded-[15px] bg-[#FFF7EC] shadow-sm p-8">
                            <Text className="font-medium block mb-6 text-[15px]">
                                Step 1 : Select Tag
                            </Text>

                            <Text className="block text-gray-500 mb-4">
                                Select a tag to replace
                            </Text>

                            {/* Tag Cards */}
                            <div className="space-y-4">
                                {/* Active Tag */}
                                <div className="flex justify-between items-center bg-[#E7F0FF] p-4 rounded-lg shadow-sm">
                                    <div>
                                        <div className="text-[#3386FF] font-semibold">FT001234</div>
                                        <div className="text-gray-500 text-sm">
                                            DL01AB1234 • ICIC Bank
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[#3386FF] font-semibold">₹450</span>
                                        <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full mt-1">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                {/* Expired Tag 1 */}
                                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <div className="font-medium">FT001234</div>
                                        <div className="text-gray-500 text-sm">
                                            DL01AB1234 • ICIC Bank
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium">₹450</span>
                                        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full mt-1">
                                            Expired
                                        </span>
                                    </div>
                                </div>

                                {/* Expired Tag 2 */}
                                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div>
                                        <div className="font-medium">FT001234</div>
                                        <div className="text-gray-500 text-sm">
                                            DL01AB1234 • ICIC Bank
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium">₹450</span>
                                        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full mt-1">
                                            Expired
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="flex justify-center mt-8">
                                <Button
                                    type="default"
                                    className="!bg-[#5298FF54] !text-[#3386FF] !rounded-lg !h-[42px] !font-medium !w-[445px] hover:!bg-[#b4cef4]"
                                >
                                    Send OTP
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
