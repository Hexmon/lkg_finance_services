"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;
import Image from "next/image";

export default function FastTagPage() {
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
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[28px]"
                arrowClassName="!text-[#2F2F2F]"
                imgSrc="logo.svg"
            />

            <div className="p-6 min-h-screen !w-full !h-[429px]">
                {/* Info Box */}
                <Card className="rounded-xl shadow-sm bg-[#1D1D1D] p-6 mx-auto !w-full !h-[429px]">
                    <div className="flex items-center gap-2 mb-0">
                        <Image
                            src="/car.svg"
                            alt="Car Image"
                            width={16}
                            height={16}
                            className="object-contain"
                        />
                        <Text className="!text-[15px] font-medium !font-poppins mb-0.5">
                            Select FASTag Provider
                        </Text>
                    </div>

                    <Text className="block text-gray-500 mb-6 !mt-0 !ml-5">
                        Keep your FASTag recharged for seamless toll payments. Low balance
                        alerts are sent when balance falls below ₹100.
                    </Text>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-6 mt-25">
                        <Button
                            type="default"
                            className="!bg-[#5298FF54] !h-[39px] !rounded-lg !text-[#3386FF] !text-[12px] !font-medium hover:!bg-[#E2E8F0]"
                            block
                        >
                            New Customer Onboarding
                        </Button>
                        <Button
                            type="default"
                            className="!bg-[#5298FF54] !h-[39px] !rounded-lg !text-[#3386FF] !text-[12px] !font-medium hover:!bg-[#E2E8F0]"
                            block
                        >
                            Continue With Fastag Recharge
                        </Button>
                        <Button
                            type="default"
                            className="!bg-[#5298FF54] !h-[39px] !rounded-lg !text-[#3386FF] !text-[12px] !font-medium hover:!bg-[#E2E8F0]"
                            block
                        >
                            Tag Replacement
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
