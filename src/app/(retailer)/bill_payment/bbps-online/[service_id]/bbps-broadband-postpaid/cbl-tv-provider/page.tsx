"use client";

import React, { useState } from "react";
import { Card, Typography, Input, Button } from "antd";
import { LeftOutlined, DesktopOutlined } from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;

export default function BroadbandPostpaidPage() {
  const [provider, setProvider] = useState<string | undefined>("InDigital Cable");
  const [subscriberId, setSubscriberId] = useState("");

  const providers = [
    "Den Networks",
    "Hathway Cable",
    "Siti Networks",
    "Fastway Transmissions",
    "InDigital Cable",
    "GTPL Hathway",
    "Local Cable Operator",
    "YOU Broadband",
  ];

  const plans = [
    { name: "Basic Package", details: "100+ Channels", price: "150", color: "text-purple-600" },
    { name: "Family Pack", details: "200+ Channels", price: "250", color: "text-pink-600" },
    { name: "Premium Pack", details: "300+ Channels", price: "350", color: "text-blue-600" },
    { name: "Sports Special", details: "250+ Channels + Sports", price: "400", color: "text-orange-600" },
  ];

  return (
      <DashboardLayout activePath="/bill_payment" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <div className="p-6 bg-[#f9f6ef] min-h-screen w-full">
        {/* Header with Back + Title + Logo */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <div
              className="flex items-center gap-2 text-blue-700 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <LeftOutlined />
              <Title level={3} className="!mb-0">
                Broadband Postpaid
              </Title>
            </div>
            <Text type="secondary" className="ml-6">
              Bill Payment
            </Text>
          </div>

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
          <div className="flex items-center gap-2 mb-4">
            <DesktopOutlined className="text-purple-500 text-lg" />
            <Title level={5} className="!mb-0">
              Select Cable TV Provider
            </Title>
          </div>

          <div className="flex flex-col gap-4">
            {/* Providers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {providers.map((item) => (
                <Card
                  key={item}
                  onClick={() => setProvider(item)}
                  className={`cursor-pointer rounded-xl shadow-sm text-center py-6 transition-all ${provider === item
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "bg-[#faf5e9] border border-gray-200"
                    }`}
                >
                  <DesktopOutlined className="text-purple-500 text-2xl mb-2" />
                  <Text className="font-medium">{item}</Text>
                </Card>
              ))}
            </div>

            {/* Subscriber ID Input */}
            <div>
              <Text strong>Subscriber ID/ VC Number *</Text>
              <Input
                placeholder="Enter your Subscriber ID or VC Number"
                value={subscriberId}
                onChange={(e) => setSubscriberId(e.target.value)}
                className="mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                Subscriber ID can be found on your cable TV bill or set-top box
              </div>
            </div>

            {/* Fetch Bill Button */}
            <Button
              type="primary"
              block
              disabled={!provider || !subscriberId}
              className="!bg-[#BBD3EB] !border-[#BBD3EB] !text-gray-700 rounded-xl"
            >
              Fetch Bill Details
            </Button>

            {/* Info Note */}
            <div className="flex items-center gap-2 bg-purple-100 border border-purple-300 text-purple-700 text-sm rounded-xl px-3 py-2 mt-2">
              <DesktopOutlined className="text-purple-500" />
              <span>
                Cable TV Payment Information – Pay your cable TV bills on time to
                enjoy uninterrupted entertainment. Service may be suspended for
                overdue payments.
              </span>
            </div>
          </div>
        </Card>

        {/* Popular Cable Packages */}
        <div className="mt-6">
          <Text strong>Popular Cable TV Packages</Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className="cursor-pointer rounded-xl shadow-sm text-center bg-[#faf5e9] border border-gray-200 py-4"
              >
                <Text className={`${plan.color} font-bold`}>{plan.name}</Text>
                <div className="text-gray-600 text-sm">{plan.details}</div>
                <div className="text-gray-800 font-semibold mt-1">
                  ₹{plan.price}/month
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
