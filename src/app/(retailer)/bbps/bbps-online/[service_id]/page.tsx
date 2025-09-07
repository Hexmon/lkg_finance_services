// src\app\(retailer)\bbps\bbps-online\[service_id]\page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Button, Input } from "antd";
import {
  LeftOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useBbpsCategoryListQuery } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import { useParams, useRouter } from "next/navigation";
import { useOnlineBillerListQuery, useOnlineBillProceedMutation } from "@/features/retailer/retailer_bbps/bbps-online/multiple_bills";
import { useMessage } from "@/hooks/useMessage";

const { Title, Text } = Typography;

export default function ChooseServicePage() {
  type RouteParams = { service_id: string };
  const { service_id } = useParams<RouteParams>();
  const router = useRouter()
  const { success, error, warning } = useMessage()

  const { data, isLoading: isCatLoading, error: bbpsCatError } = useBbpsCategoryListQuery(
    { service_id, mode: "ONLINE" },
    { query: { enabled: Boolean(service_id) } }
  );

  const { data: catData } = data || {}

  const onlineParams = useMemo(
    () => ({
      service_id,
      per_page: 10,
      page: 1,
      order: "desc" as const,
      sort_by: "created_at",
      status: "INITIATED",
      is_active: true,
      is_direct: false,
    }),
    [service_id]
  );

  const { data: billersResp, isLoading: isBillersLoading, error: billersError } = useOnlineBillerListQuery(onlineParams, { query: { enabled: Boolean(service_id) } });

  const {
    mutateAsync: proceed,
    data: proceedData,
    isPending: isProceeding,
    error: proceedError,
  } = useOnlineBillProceedMutation({
    onSuccess: (resp) => {
      success(resp?.message ?? "Request submitted successfully");
      // Optionally navigate / refetch online billers, etc.
      // router.push(`/bbps/bbps-online/confirmation/${service_id}`);
    },
    onError: (err) => {
      error(err.message || "Failed to proceed");
    },
  });

  const handleProceed = async () => {
    // Choose which online batch to proceed.
    // Here we pick the *first* returned online biller and use its biller_batch_id as the batch_id payload.
    // If your API requires a different id, adjust mapping here.
    const firstOnline = billersResp?.data?.[0];
    const batchId = firstOnline?.biller_batch_id;

    if (!batchId) {
      warning("No online biller found to proceed.");
      return;
    }
    if (!service_id) {
      error("Missing service_id");
      return;
    }

    try {
      await proceed({ service_id, batch_id: batchId });
      // proceedData will have the latest successful response after this resolves
    } catch {
      // onError already handled by the mutation config
    }
  };

  const [billers, setBillers] = useState([
    {
      id: "21081904512",
      name: "Jaipur Vidyut Vitran Nigam (JVVNL)",
      icon: <ThunderboltOutlined className="text-yellow-500" />,
      amount: 2450,
    },
    {
      id: "DTV987654321",
      name: "Airtel Digital TV",
      icon: <AppstoreOutlined className="text-purple-500" />,
      amount: 399,
    },
  ]);

  const totalAmount = billers.reduce((sum, b) => sum + b.amount, 0);

  const removeBiller = (id: string) => {
    setBillers(billers.filter((b) => b.id !== id));
  };

  // const { removeBiller, data, isLoading, error } = useRemoveOnlineBiller();
  // await removeBiller({ biller_batch_id });

  return (
    <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} isLoading={isBillersLoading && isCatLoading} pageTitle="Bill Payment">
      <div className="p-6 min-h-screen w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <LeftOutlined />
            <div>
              <Title level={3} className="!mb-0">Choose Service</Title>
              <Text type="secondary">Online Bill Payment</Text>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="!rounded-xl !px-4 !py-2 shadow-sm">
              View Transaction History
            </Button>
            <Image src="/logo.svg" alt="logo" width={120} height={120} />
          </div>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Search for bill payment services..."
          className="rounded-xl shadow-sm mb-6"
        />

        <Card className="rounded-2xl shadow-md w-full mb-6">
          <Text strong className="block mb-3">Available Services</Text>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(catData ?? []).map((data) => {
              const { bbps_category_id, biller_category } = data || {}
              return (
                <div key={bbps_category_id} onClick={() => { router.push(`/bbps/bbps-online/${service_id}/bbps-customer-dtls/${bbps_category_id}`) }}>
                  <Card
                    className="cursor-pointer rounded-xl text-center py-6 bg-[#faf5e9] hover:border-blue-400 hover:shadow-md transition"
                  >
                    {/* <div className="text-2xl mb-2">{service.icon}</div> */}
                    <Text className="text-[10px]">{biller_category}</Text>
                  </Card>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Manage Billers */}
        <Card className="rounded-2xl shadow-md w-full mb-6">
          <Text strong className="block mb-3">Manage Billers</Text>
          <div className="flex flex-col gap-4">
            {billers.map((biller) => (
              <div
                key={biller.id}
                className="flex justify-between items-center bg-[#faf5e9] rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{biller.icon}</div>
                  <div>
                    <Text strong>{biller.name}</Text>
                    <div className="text-xs text-gray-500">{biller.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Text strong>₹{biller.amount}</Text>
                  <DeleteOutlined
                    onClick={() => removeBiller(biller.id)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-4 px-2">
            <Text strong>Total Amount</Text>
            <Text strong>₹{totalAmount}.00</Text>
          </div>
        </Card>

        {/* Proceed Button */}
        <Button
          type="primary"
          block
          className="!bg-blue-600 !border-blue-600 !text-white rounded-xl py-5 text-lg shadow-md"
          disabled={billers.length === 0 || isProceeding}
          loading={isProceeding}
          onClick={handleProceed}
        >
          Proceed to Pay
        </Button>
        {proceedError && (
          <div className="mt-3 text-red-500 text-sm">
            {(proceedError as Error)?.message || "Failed to proceed"}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
