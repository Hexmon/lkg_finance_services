"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, Typography, Button, Alert } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";

const { Title, Text } = Typography;

export default function BillDetailsPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Payment successful!");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        {/* Header with Back + Title + Logo */}
        <div className="flex justify-between items-center mb-6">
          {/* Left Side (Back + Title) */}
          <div className="flex items-center gap-2 text-blue-700">
            <LeftOutlined />
            <Title level={3} className="!mb-0">
              Broadband Postpaid
            </Title>
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

        <Text type="secondary" className="block mb-4">
          Pending Payment
        </Text>

        {/* Full Width Card */}
        <Card className="rounded-2xl shadow-md w-full">
          {/* Customer & Amount */}
          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">Customer Name</Text>
              <Title level={5}>John Doe</Title>
            </div>
            <div>
              <Text type="secondary">Bill Amount</Text>
              <Title level={4} className="!text-blue-600">
                ₹999
              </Title>
            </div>
          </div>

          {/* Plan & Due Date */}
          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">Plan Details</Text>
              <Title level={5}>Fiber Ultra 200 MBPS</Title>
            </div>
            <div>
              <Text type="secondary">Due Date</Text>
              <Title level={5}>2024-01-25</Title>
            </div>
          </div>

          {/* Bill No & Date */}
          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">Bill Number</Text>
              <Title level={5}>BBLRR78A2U</Title>
            </div>
            <div>
              <Text type="secondary">Bill Date</Text>
              <Title level={5}>2024-01-25</Title>
            </div>
          </div>

          {/* Warning */}
          <Alert
            message="⚠ Please verify all details before making the payment. This transaction cannot be reversed."
            type="warning"
            showIcon
            className="mb-4"
          />

          {/* Buttons */}
          <div className="flex gap-4">
            <Button block>Back to Edit</Button>
            <Button
              type="primary"
              loading={isProcessing}
              onClick={handlePay}
              block
            >
              {isProcessing ? "Processing..." : "Pay ₹999"}
            </Button>
          </div>

          <Button block className="mt-3">
            Add to Biller
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
