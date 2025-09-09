"use client";

import React from "react";
import { Card, Typography } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { useServiceSubscriptionListQuery } from "@/features/retailer/services";

const { Title, Text } = Typography;

export default function MoneyTransferServicePage() {
    const { data: { data: servieData, status } = {}, isLoading, error } = useServiceSubscriptionListQuery({ service_name: 'DMT' });
console.log({servieData});

    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/money_transfer" pageTitle="Money Transfer" isLoading={isLoading}>
            <DashboardSectionHeader
                title="Money Transfer Service"
                titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
                arrowClassName="!text-[#3386FF]"
            />
            <div className="p-6 min-h-screen w-full">

                <div className="flex">
                    <Card className="rounded-2xl shadow-md text-center w-[400px]">
                        <div className="flex flex-col items-center justify-center">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <span role="img" aria-label="file">📄</span>
                            </div>
                            <Title level={4}>DMT</Title>
                            <Text type="secondary" className="block">
                                Pay bills manually by entering customer details and bill information
                            </Text>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
