"use client";

import React, { useState } from "react";
import { Card, Typography, Select, Input, Button } from "antd";
import { LeftOutlined, WifiOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title, Text } = Typography;

export default function BroadbandPrepaidPage() {
  const [biller, setBiller] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("799");
  const [selectedPlan, setSelectedPlan] = useState<string>("100Mbps");

  const plans = [
    { speed: "100Mbps", price: "799" },
    { speed: "200Mbps", price: "999" },
    { speed: "300Mbps", price: "1299" },
    { speed: "500Mbps", price: "1999" },
  ];

  return (
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
              Broadband Prepaid
            </Title>
          </div>
          <Text type="secondary" className="ml-6">
            Recharge
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
          <WifiOutlined className="text-blue-500 text-lg" />
          <Title level={5} className="!mb-0">
            Select Broadband Biller
          </Title>
        </div>

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

          {/* Recharge Amount Input */}
          <div>
            <Text strong>Recharge Amount *</Text>
            <Input
              prefix="₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Popular Broadband Plans */}
          <div className="mt-4">
            <Text strong>Popular Broadband Plans</Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {plans.map((plan) => (
                <Card
                  key={plan.speed}
                  onClick={() => {
                    setSelectedPlan(plan.speed);
                    setAmount(plan.price);
                  }}
                  className={`cursor-pointer rounded-xl shadow-sm text-center transition-all ${
                    selectedPlan === plan.speed
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-[#faf5e9] border border-gray-200"
                  }`}
                >
                  <Text className="text-blue-600 font-bold text-lg">
                    {plan.speed}
                  </Text>
                  <div className="text-gray-800 font-semibold">₹{plan.price}</div>
                  <div className="text-xs text-gray-500">Monthly Unlimited</div>

                  {/* Show "Pending Payment" only for selected one */}
                  {selectedPlan === plan.speed && (
                    <div className="mt-2 text-xs font-semibold text-blue-700">
                      Pending Payment
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Proceed To Pay Button */}
          <Button
            type="primary"
            block
            disabled={!biller || !customerId || !amount}
            className="!bg-[#BBD3EB] !border-[#BBD3EB] !text-gray-700 rounded-xl mt-4"
          >
            Proceed To Pay
          </Button>
        </div>
      </Card>
    </div>
  );
}
