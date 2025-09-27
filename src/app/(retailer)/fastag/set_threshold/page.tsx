"use client";

import React from "react";
import { Card, Typography, Button, Input, message } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function VehicleRegistration() {
    const [messageApi, contextHolder] = message.useMessage();
    const handleSetLimit = () => {
        messageApi.success("Limit has been set successfully!");
    };
    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/setthreshold"
            pageTitle="FASTag"
        >

            {contextHolder}

            {/* Section Header */}
            <DashboardSectionHeader
                title="Set Threshold"
                titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
                arrowClassName="!text-[#2F2F2F]"
            />

            <div className="p-6 min-h-screen w-full">
                {/* Content Card */}
                <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
                    <Card className="rounded-xl shadow-sm bg-[#FFF7EC] h-[74px] flex items-center px-4 mx-auto w-full">
                        <div className="flex items-center justify-between w-full">
                            {/* Left Section */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/car.svg"
                                        alt="Car Icon"
                                        width={18}
                                        height={18}
                                        className="object-contain"
                                    />
                                    <Text className="!text-[15px] font-normal">
                                        Fastag Vehicle Registration
                                    </Text>
                                </div>
                                <Text className="block text-gray-500 text-sm ml-6 font-light text-[12px]">
                                    Select Your Fastag services
                                </Text>
                            </div>

                            {/* Middle Section */}
                            <div className="flex items-center justify-center gap-3 ml-45">
                                <div className="bg-[#EBEBEB] text-black text-sm font-medium px-3 py-1 rounded-[9px] w-[95px] h-[32px] flex items-center justify-center">
                                    ₹ 25,000
                                </div>
                                <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-[9px] flex items-center gap-2 w-fit h-[34px]">
                                    <Image
                                        src="/plus.svg"
                                        alt="plus"
                                        width={15.83}
                                        height={15.83}
                                        className="object-contain"
                                    />
                                    Recharge Wallet
                                </button>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center justify-end gap-2 ml-55">
                                <div className="w-8 h-8 rounded-full bg-[#5298FF54] flex items-center justify-center">
                                    <Image src="/person.svg" alt="User Icon" width={18} height={18} />
                                </div>
                                <div className="text-right flex flex-col items-start">
                                    <Text className="font-medium text-sm">Vijay Singh</Text>
                                    <a
                                        href="tel:9241773811"
                                        className="text-blue-500 text-xs hover:underline"
                                    >
                                        Mobile No.- 9241773811
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>




                    {/* Vehicle No. Input + Search */}
                    <div className="max-w-3xl mx-auto mb-10 mt-5">
                        <div>
                            <Text className="block mb-1 text-black-600 font-medium text-[12px] w-sm">
                                Vehicle Number
                            </Text>
                            <select className="w-sm !h-[42px] rounded-md border border-gray-300 px-2">
                                <option value="DL2CBC4200">DL2CBC4200</option>
                            </select>
                        </div>
                        <div className="mt-5">
                            <Text className="block mb-1 text-black-600 font-medium text-[12px] w-sm">
                                Threshold Limit
                            </Text>
                            <input
                                type="text"
                                className="w-sm !h-[42px] rounded-md border border-gray-300 px-2"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-center mt-8 p-4 gap-6">
                        <Button
                            type="default"
                            className="!bg-[#FFFF] !h-[42px] !rounded-lg !text-[#3386FF] !font-normal hover:!bg-[#E2E8F0] !w-[445px] text-[12px] !border !border-[#3386FF]"
                        >
                            Reset
                        </Button>
                        <Button
                            type="default"
                            className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-normal hover:!bg-[#2c76db] !w-[445px] text-[12px]"
                            onClick={handleSetLimit}
                        >
                            Set Limit
                        </Button>
                    </div>

                </Card>
            </div>
        </DashboardLayout>
    );
}
