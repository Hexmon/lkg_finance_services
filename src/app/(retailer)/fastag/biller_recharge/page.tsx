"use client";

import React from "react";
import { Card, Typography, Button, Input, Select } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

export default function FastTagRechargePage() {
    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/onboarding"
            pageTitle="FASTag"
        >
            {/* Section Header */}
            <DashboardSectionHeader
                title="FASTag"
                subtitle="Recharge"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
                imgSrc="/logo.svg"
                imgClassName="!w-[98px] !h-[36px] !mr-8"
            />

            {/* Page Content */}
            <div className="p-6 w-full h-full">
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full max-w-[1600px]">
                    {/* Title */}
                    <div className="flex items-center gap-2 mb-4 mt-6 ml-4">
                        <Image
                            src="/car.svg"
                            alt="Car Icon"
                            width={18}
                            height={18}
                            className="object-contain"
                        />
                        <Text className="!text-[18px] font-normal">Select Fastag Biller</Text>
                    </div>

                    {/* Form */}
                    <div className="space-y-8 max-w-[1050px] mx-auto mt-8">
                        {/* Biller Dropdown */}
                        <div>
                            <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                                Biller <span className="text-black-500">*</span>
                            </Text>
                            <Select
                                placeholder="Choose Your Biller"
                                className="!w-full !h-[42px] rounded-md bg-[#F5F5F5]"
                            >
                                <Option value="axisbank">Axis Bank</Option>
                                <Option value="hdfc">HDFC Bank</Option>
                                <Option value="icici">ICICI Bank</Option>
                            </Select>
                        </div>

                        {/* Vehicle Number */}
                        <div>
                            <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                                Vehicle Number <span className="text-black-500">*</span>
                            </Text>
                            <Input
                                placeholder="Enter your Vehicle Number (e.g. DL01AB1234)"
                                className="!h-[42px] rounded-md bg-[#F5F5F5] border-none"
                            />
                            <Text className="!text-xs !text-[#9A9595] !font-medium !text-[10px]">
                                Enter your vehicle registration number without spaces
                            </Text>
                        </div>

                        {/* Chassis Number */}
                        <div>
                            <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                                Last 4 digits of Chassis Number <span className="text-black-500">*</span>
                            </Text>
                            <Input
                                placeholder="Enter Last 4 digits of Chassis Number"
                                className="!h-[42px] rounded-md bg-[#F5F5F5] border-none"
                            />
                            <Text className="!text-xs !text-[#9A9595] !font-medium !text-[10px]">
                                Required by some banks for verification
                            </Text>
                        </div>
                        <div>
                            <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                                Recharge Amount <span className="text-black-500">*</span>
                            </Text>
                            <Input
                                placeholder="&#8377; 799"
                                className="!h-[42px] rounded-md bg-[#F5F5F5] border-none"
                            />
                        </div>
                    </div>


                    {/* Button */}
                    <div className="flex justify-center mt-12">
                        <Button
                            type="default"
                            className="!bg-[#5298FF54] !text-[#FFFFFF] !rounded-lg !h-[42px] !font-medium !w-[1050px] hover:!bg-[#E2E8F0]"
                        >
                            Proceed to Pay
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}