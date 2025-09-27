/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button, Typography } from "antd";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function FastagServicePage() {
    const router = useRouter();

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag"
            pageTitle="FASTag"
        >
            <div className="w-full">
                {/* Section Header */}
                <DashboardSectionHeader
                    title="Fastag"
                    titleClassName="!text-[#3386FF] !font-semibold !text-[22px]"
                    arrowClassName="!text-[#3386FF]"
                />

                {/* Service Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <div
                        className="cursor-pointer w-full"
                        onClick={() => {
                            // Navigate to Fastag details page
                            router.push(`/fastag/subscribed`);
                        }}
                    >
                        <CardLayout
                            as="section"
                            size="lg"
                            elevation={2}
                            hoverable
                            rounded="rounded-2xl"
                            className="rounded-2xl mx-auto !w-[500px]"
                            header={
                                <div className="flex justify-end">
                                    <span className="!bg-[#0BA82F] !rounded-md !text-white px-4 py-1">
                                        Active
                                    </span>
                                </div>
                            }
                            body={
                                <div className="relative w-full flex flex-col items-center text-center space-y-3 py-6">
                                    {/* Icon */}
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                                        <Image
                                            src="/car.svg"
                                            alt="fastag"
                                            width={40}
                                            height={40}
                                            className="mx-auto"
                                        />
                                    </div>

                                    {/* Title */}
                                    <Title level={4} className="!mb-0 text-[#000000]">
                                        Fastag
                                    </Title>

                                    {/* Description */}
                                    <Text className="!font-medium !text-[14px] !leading-[141%] !text-[#787878]">
                                        Subscribe to fastag for Fast, Simple, Unlimited Travel.
                                    </Text>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
