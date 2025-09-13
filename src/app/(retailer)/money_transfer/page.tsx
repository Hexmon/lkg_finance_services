/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button, Card, Typography } from "antd";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { useServiceSubscribe, useServiceSubscriptionListQuery } from "@/features/retailer/services";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";
import { useQueryClient } from '@tanstack/react-query';
import { qk } from "@/features/retailer/services";

const { Title, Text } = Typography;

export default function MoneyTransferServicePage() {
    const router = useRouter()
    const { data: { data: cardData, status } = {}, isLoading, error: dmtError } = useServiceSubscriptionListQuery({ service_name: 'DMT' });
    const {
        subscribeAsync,
        isLoading: subscribeLoading,
        error: subscribeError,
        data: subscribeData,
    } = useServiceSubscribe();

    const { error } = useMessage();
    const qc = useQueryClient();

    const handleSubscribeFor = async (e: React.MouseEvent, serviceId?: string) => {
        e.stopPropagation();
        if (!serviceId) {
            error("Invalid service. Please refresh and try again.");
            return;
        }
        try {
            await subscribeAsync({ service_id: serviceId, status: "ACTIVE" });
            await qc.invalidateQueries({
                queryKey: qk.subscriptionList({ service_name: 'DMT' }),
            });
        } catch (err: any) {
            error(err?.message ?? "Subscription failed.");
        }
    };

    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/money_transfer" pageTitle="Money Transfer" isLoading={isLoading || subscribeLoading}>
            <DashboardSectionHeader
                title="Money Transfer Service"
                titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
                arrowClassName="!text-[#3386FF]"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                {(cardData || []).map((data) => {
                    const { api_partner, is_blocked, is_subscribed, service_id, service_name } = data || {};
                    return (
                        <div
                            key={service_id}
                            className="cursor-pointer"
                            onClick={() => {
                                if (is_subscribed || is_blocked) {
                                    router.push(`/money_transfer/service/${service_id}`);
                                }
                            }}
                        >
                            <CardLayout
                                as="section"
                                size="lg"
                                elevation={2}
                                hoverable
                                rounded="rounded-2xl"
                                className="rounded-2xl mx-auto"
                                header={
                                    is_subscribed && (
                                        <div className="flex justify-end">
                                            <span className="!bg-[#0BA82F] !rounded-md !text-white px-4 py-1">Active</span>
                                        </div>
                                    )
                                }
                                footer={
                                    !is_subscribed && (
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={(e) => handleSubscribeFor(e, service_id)}
                                                loading={subscribeLoading}
                                                type="primary"
                                                className="!text-white !bg-[#0BA82F] w-[70%]"
                                                size="middle"
                                                disabled={!!is_blocked}
                                            >
                                                Subscribe
                                            </Button>
                                        </div>
                                    )
                                }
                                body={
                                    <div className="relative w-full flex flex-col items-center text-center space-y-3">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                                            <Image src='/icons/money-transfer.png' alt="money-transfer" width={48} height={48} className="mx-auto p-2" />
                                        </div>
                                        <Title level={4} className="!mb-0">
                                            {service_name}
                                        </Title>
                                        <Text className="font-[500] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center !text-gray-500">
                                            {api_partner}
                                        </Text>
                                    </div>
                                }
                            />
                        </div>
                    );
                })}
            </div>
            <div className="bg-transparent"></div>
        </DashboardLayout>
    );
}
