"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Input, Modal } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import FastagTransactionHistory from "@/components/fastag/FastagTransactionHistory";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function VehicleRegistration() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = () => {
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/subscribed"
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
                    <div>
                        <div className="max-w-3xl mx-auto mb-10">
                            <Text className="block mb-2 !font-medium !text-[13px]">
                                Customer Mobile Number
                            </Text>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Customer Mobile Number"
                                    className="flex-1 h-[45px] px-4 rounded-xl border border-gray-300 text-sm focus:outline-none bg-[#FCFCFC]"
                                />
                                <button className="bg-[#3386FF] text-white px-6 rounded-xl text-sm hover:bg-blue-600"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="max-w-3xl mx-auto mb-10">
                            <Text className="block mb-2 !font-medium !text-[13px]">
                                OTP
                            </Text>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Customer Mobile Number"
                                    className="flex-1 h-[45px] px-4 rounded-xl border border-gray-300 text-sm focus:outline-none bg-[#FCFCFC]"
                                />
                                <button className="bg-[#3386FF] text-white px-6 rounded-xl text-sm hover:bg-blue-600"
                                onClick={()=>router.push("/fastag/dashboard")}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <FastagTransactionHistory />
                    </div>
                </Card>
            </div>
            {/*  Customer Not Found Modal */}
            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                centered
                className="customer-error-modal"
            >
                <div className="flex flex-col items-center text-center p-6">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 rounded-full bg-[#F9071854] flex items-center justify-center mb-4">
                        <span className="text-red-500 text-3xl">!</span>
                    </div>

                    {/* Error Message */}
                    <Text className="!text-red-500 !text-[20px] !font-medium !mb-4 ">
                        Customer Account Does not exist
                    </Text>

                    {/* Register Button */}
                    <button
                        className="bg-[#3386FF] text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 w-[334px]"
                        onClick={() => router.push("/fastag/otp_verification")}
                    >
                        Register Now
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    );
}