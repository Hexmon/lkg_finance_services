"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function Fastag() {
    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag"
            pageTitle="FASTag"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="FASTag"
                subtitle="Electronic Toll Collection"
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
                        <Text className="!text-[16px] font-medium">Select FASTag Provider</Text>
                    </div>
                    <Text className="block text-gray-500 mb-6 ml-10.5">
                        Keep your FASTag recharged for seamless toll payments. Low balance alerts are sent when balance falls below ₹100.
                    </Text>

                    <div className="mb-6">
                        <div className="flex justify-center flex-col gap-8 mt-25">
                            <Button
                                type="default"
                                className="!bg-[#5298FF54] !h-[42px] !rounded-lg !text-[#3386FF] !font-medium hover:!bg-[#E2E8F0] !w-full !text-[12px]"
                            >
                                New Customer Onboarding
                            </Button>
                            <Button
                                type="default"
                                className="!bg-[#5298FF54] !h-[42px] !rounded-lg !text-[#3386FF] !font-medium hover:!bg-[#E2E8F0] !w-full !text-[12px]"
                            >
                                Continue With Fastag Recharge
                            </Button>
                            <Button
                                type="default"
                                className="!bg-[#5298FF54] !h-[42px] !rounded-lg !text-[#3386FF] !font-medium hover:!bg-[#E2E8F0] !w-full !text-[12px]"
                            >
                                Tag Replacement
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}