"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, Typography, Button, Alert, Skeleton } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, selectCustomer } from "@/lib/store";

const { Title, Text } = Typography;

export default function BillDetailsPage() {
  const router = useRouter();
  const { service_id, bbps_category_id } = useParams() as { service_id: string; bbps_category_id: string };
  const details = useAppSelector(selectCustomer); // { customerName, mobileNumber, email, idNumber }
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Guard: if customer details missing, send user back to the form step
  useEffect(() => {
    if (!details) {
      router.replace(`/bill_payment/bbps-online/${service_id}/bbps-customer-dtls/${bbps_category_id}`);
    }
  }, [details, router, service_id, bbps_category_id]);

  if (!details) {
    return (
      <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
        <div className="p-6 bg-gray-50 min-h-screen w-full">
          <Skeleton active />
        </div>
      </DashboardLayout>
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);
    // TODO: call your proceed/pay API here using service_id, bbps_category_id and details from the store
    setTimeout(() => {
      alert("Payment successful!");
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-blue-700 cursor-pointer" onClick={() => router.back()}>
            <LeftOutlined />
            <Title level={3} className="!mb-0">
              Broadband Postpaid
            </Title>
          </div>
          <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
        </div>

        <Text type="secondary" className="block mb-4">
          Pending Payment
        </Text>

        <Card className="rounded-2xl shadow-md w-full">
          {/* Customer & Amount */}
          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">Customer Name</Text>
              <Title level={5}>{details.customerName}</Title>
              <div className="text-xs text-gray-500">
                {details.mobileNumber} {details.email ? `• ${details.email}` : ""}
              </div>
            </div>
            <div>
              <Text type="secondary">Bill Amount</Text>
              <Title level={4} className="!text-blue-600">₹999</Title>
            </div>
          </div>

          {/* Example invoice info */}
          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">Plan Details</Text>
              <Title level={5}>Fiber Ultra 200 MBPS</Title>
            </div>
            <div>
              <Text type="secondary">Due Date</Text>
              <Title level={5}>2025-10-01</Title>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <Text type="secondary">BBPS Category ID</Text>
              <Title level={5}>{bbps_category_id}</Title>
            </div>
            <div>
              <Text type="secondary">Service ID</Text>
              <Title level={5}>{service_id}</Title>
            </div>
          </div>

          <Alert
            message="⚠ Please verify all details before making the payment. This transaction cannot be reversed."
            type="warning"
            showIcon
            className="mb-4"
          />

          <div className="flex gap-4">
            <Button block onClick={() => router.back()}>Back to Edit</Button>
            <Button type="primary" loading={isProcessing} onClick={handlePay} block>
              {isProcessing ? "Processing..." : "Pay ₹999"}
            </Button>
          </div>

          <Button block className="mt-3">Add to Biller</Button>
        </Card>
      </div>
    </DashboardLayout>
  );
}
