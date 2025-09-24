/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Typography, Button } from "antd";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useServiceSubscribe, useServiceSubscriptionListQuery } from "@/features/retailer/services";
import { useMessage } from "@/hooks/useMessage";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function BillPaymentServicePage() {
  const messageApi = useMessage();
  const router = useRouter();

  const {
    data: servieData = { data: [], status: "" },
    isLoading,
    error,
  } = useServiceSubscriptionListQuery({ service_name: "BBPS" });

  const {
    subscribeAsync,
    isLoading: subscribeLoading,
    error: subscribeError,
    data: subscribeData,
  } = useServiceSubscribe();

  const { data: [OFFLINE, ONLINE] = [] } = servieData || {};
  const { service_id: offline_service_id, is_blocked: offline_is_blocked, is_subscribed: offline_is_subscribed } = OFFLINE || {};
  const { service_id: online_service_id, is_blocked: online_is_blocked, is_subscribed: online_is_subscribed } = ONLINE || {};

  useEffect(() => {
    if (error) {
      const err = (error as any)?.message || "Failed to load bill payment services. Please try again.";
      messageApi.error(err);
    }
  }, [error, messageApi]);

  // Show subscribe errors (if any)
  useEffect(() => {
    if (subscribeError) {
      const err = (subscribeError as any)?.message || "Subscription failed. Please try again.";
      messageApi.error(err);
    }
  }, [subscribeError, messageApi]);

  // Optional: toast on successful subscribe
  useEffect(() => {
    if (subscribeData?.data?.status === "ACTIVE") {
      messageApi.success(`Subscribed to ${subscribeData.data.name} via ${subscribeData.data.api_partner}`);
    }
  }, [subscribeData, messageApi]);

  // Generic subscribe handler for both cards (prevents navigation on button click)
  const handleSubscribeFor = async (e: React.MouseEvent, serviceId?: string) => {
    e.stopPropagation();
    if (!serviceId) {
      messageApi.error("Invalid service. Please refresh and try again.");
      return;
    }
    try {
      await subscribeAsync({ service_id: serviceId, status: "ACTIVE" });
    } catch (err: any) {
      // error toast handled by subscribeError effect as well; this is a guard
      messageApi.error(err?.message ?? "Subscription failed.");
    }
  };

  const cardData = [
    {
      id: offline_service_id ?? "0",
      icon: "/bill.svg",
      title: "Offline Bill Payment",
      subtitle: "Pay bills manually by entering customer details and bill information",
      isBlocked: offline_is_blocked ?? false,
      isSubscribe: offline_is_subscribed ?? false,
      redirect: 'bill_payment/bbps-offline'
    },
    {
      id: online_service_id ?? "1",
      icon: "/a.svg",
      title: "Online Bill Payment",
      subtitle: "Pay bills online with automatic bill fetch and payment processing",
      isBlocked: online_is_blocked ?? false,
      isSubscribe: online_is_subscribed ?? false,
      redirect: 'bill_payment/bbps-online'
    },
  ];

  return (
    <DashboardLayout
      activePath="/bill_payment"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
      isLoading={isLoading || subscribeLoading}
    >
      <DashboardSectionHeader
        title={<span className="!text-[#3386FF] !font-semibold !text-[32px]">Bill Payment Service</span>}
        subtitle={null}
        showBack
        arrowClassName="!text-[#3386FF]"
      // dropdownItems={[
      //   { key: "bill", label: "Bill Payment Service", path: "/bill-payment" },
      //   { key: "complain", label: "Register Complain", path: "/bill_payment/raise-complaint" },
      //   { key: "status", label: "Transaction Status", path: "/bill_payment/transaction-status" },
      // ]}
      // dropdownSelectedKey="bill"
      // onDropdownSelect={(key) => console.log("selected:", key)}
      // dropdownTriggerClassName="text-blue-500"
      // dropdownClassName="!min-w-[220px]"
      />
      <div className="p-8 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {(cardData ?? []).map((data) => {
            const { icon, id, isSubscribe, subtitle, title, isBlocked, redirect } = data || {};
            return (
              <div
                key={id}
                className="cursor-pointer"
                onClick={() => {
                  if (isSubscribe || isBlocked) {
                    router.push(`/${redirect}/${id}`);
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
                    isSubscribe && (
                      <div className="flex justify-end">
                        <span className="!bg-[#0BA82F] !rounded-md !text-white px-4 py-1">Active</span>
                      </div>
                    )
                  }
                  footer={
                    !isSubscribe && (
                      <div className="flex justify-center">
                        <Button
                          onClick={(e) => handleSubscribeFor(e, id)}
                          loading={subscribeLoading}
                          type="primary"
                          className="!text-white !bg-[#0BA82F] w-[70%]"
                          size="middle"
                          disabled={!!isBlocked}
                        >
                          Subscribe
                        </Button>
                      </div>
                    )
                  }
                  body={
                    <div className="relative w-full flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                        <Image src={icon} alt={title} width={48} height={48} className="mx-auto p-2" />
                      </div>
                      <Title level={4} className="!mb-0">
                        {title}
                      </Title>
                      <Text className="font-[500] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center !text-gray-500">
                        {subtitle}
                      </Text>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
