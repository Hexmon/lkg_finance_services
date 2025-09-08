"use client";

import React, { useState } from "react";
import { Card, Typography, Select, Input, Button } from "antd";
import { LeftOutlined, WifiOutlined } from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { useBbpsBillerListQuery } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

export default function BroadbandPrepaidPage() {
  const [biller, setBiller] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState("");
  const { service_id, bbps_category_id } = useParams() as { service_id: string; bbps_category_id: string };

  const {
    data: billerData,
    isLoading,
    isError,
    error,
  } = useBbpsBillerListQuery({ service_id, bbps_category_id, is_offline: false, mode: "ONLINE" });

  return (
    <DashboardLayout activePath="/bill_payment" sections={billPaymentSidebarConfig} pageTitle="Bill Payment" isLoading={isLoading}>
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title={<h1 className="!text-black !font-semibold !text-[20px]">Broadband Postpaid</h1>}
            subtitle={<span className="text-[#1D1D1D] font-light text-[12px]">Recharge</span>}
            showBack
          />
          <Image
            src="/logo.svg"
            alt="logo"
            width={100}
            height={100}
            className="p-1"
          />
        </div>

        {/* Full Width Card */}
        <Card className="rounded-2xl shadow-md w-full">
          {/* Section Title */}
          <div className="flex items-center gap-2 mb-4">
            <WifiOutlined className="text-blue-500 text-lg" />
            <Title level={5} className="!mb-0">
              Select Broadband Biller
            </Title>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Biller Dropdown */}
            <div>
              <Text strong>Biller *</Text>
              <Select
                placeholder="Choose Your Biller"
                value={biller}
                onChange={setBiller}
                className="w-full mt-1"
              >
                <Select.Option value="airtel">Airtel</Select.Option>
                <Select.Option value="jio">Jio</Select.Option>
                <Select.Option value="bsnl">BSNL</Select.Option>
              </Select>
            </div>

            {/* Customer ID Input */}
            <div>
              <Text strong>Customer ID / Phone Number</Text>
              <Input
                placeholder="Enter your Customer ID or Phone Number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Fetch Bill Button */}
            <Button
              type="primary"
              block
              disabled={!biller || !customerId}
              style={{
                backgroundColor: "#BBD3EB",
                borderColor: "#BBD3EB",
                borderRadius: "8px",
              }}
            >
              Fetch Bill Details
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
