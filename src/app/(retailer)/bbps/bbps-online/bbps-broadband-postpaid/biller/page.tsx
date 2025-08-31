"use client";

import React, { useState } from "react";
import { Card, Typography, Select, Input, Button } from "antd";
import { LeftOutlined, WifiOutlined } from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;

export default function BroadbandPrepaidPage() {
  const [biller, setBiller] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState("");

  return (
      <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        {/* Header with Back + Title + Logo */}
        <div className="flex justify-between items-center mb-2">
          {/* Left Side (Back + Title) */}
          <div>
            <div
              className="flex items-center gap-2 text-blue-700 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <LeftOutlined />
              <Title level={3} className="!mb-0">
                Broadband Prepaid
              </Title>
            </div>
            <Text type="secondary" className="ml-6">
              Recharge
            </Text>
          </div>

          {/* Right Side (Logo) */}
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
