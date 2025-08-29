"use client";

import React, { useState } from "react";
import { Card, Typography, Select, Input, Button } from "antd";
import { LeftOutlined, DesktopOutlined } from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";

const { Title, Text } = Typography;

export default function CableTVBillPaymentPage() {
  const [biller, setBiller] = useState<string | undefined>();
  const [subscriberId, setSubscriberId] = useState("");

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#f9f6ef] min-h-screen w-full">
        {/* Header with Back + Title + Logo */}
        <div className="flex justify-between items-center mb-2">
          {/* Left Side (Back + Title + Subtitle) */}
          <div>
            <div
              className="flex items-center gap-2 text-blue-700 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <LeftOutlined />
              <Title level={3} className="!mb-0">
                Cable TV Bill Payment
              </Title>
            </div>
            <Text type="secondary" className="ml-6">
              Cable Television Services
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
            <DesktopOutlined className="text-pink-500 text-lg" />
            <Title level={5} className="!mb-0">
              Select Cable TV Provider
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
                <Select.Option value="tata">Tata Play</Select.Option>
                <Select.Option value="airtel">Airtel Digital TV</Select.Option>
                <Select.Option value="d2h">d2h</Select.Option>
              </Select>
            </div>

            {/* Subscriber ID Input */}
            <div>
              <Text strong>Subscriber ID/ VC Number *</Text>
              <Input
                placeholder="Enter your Customer ID or Phone Number"
                value={subscriberId}
                onChange={(e) => setSubscriberId(e.target.value)}
                className="mt-1"
              />
              <Text type="secondary" className="text-xs">
                Subscriber ID can be found on your cable TV bill or set-top box
              </Text>
            </div>

            {/* Fetch Bill Button */}
            <Button
              type="primary"
              block
              disabled={!biller || !subscriberId}
              className="!bg-[#BBD3EB] !border-[#BBD3EB] !text-gray-700 rounded-xl"
            >
              Fetch Bill Details
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
