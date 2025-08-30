"use client";

import React from "react";
import { Card, Typography, Button, Tag } from "antd";
import {
  LeftOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";

const { Title, Text } = Typography;

export default function BillPaymentServicePage() {
  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Back + Title */}
        <div className="flex items-center gap-2 mb-8 text-blue-700">
          <LeftOutlined />
          <Title level={3} style={{ color: "#1d4ed8", marginBottom: 0 }}>
            Bill Payment Service
          </Title>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offline Bill Payment */}
          <Card
            hoverable
            className="rounded-2xl shadow-md"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex flex-col items-center text-center space-y-3 relative w-full">
              {/* Sub Tag in top-right */}
              <div className="absolute top-0 right-0">
                <Tag
                  color="white"
                  className="!bg-[#34C759] !text-white !rounded-lg  !text-center !border-none !p-0 w-[96px] h-[32px] leading-[32px] flex items-center justify-center"
                  style={{ width: "96px", height: "32px", lineHeight: "32px", padding: "0 12px" }}
                >
                  Sub.
                </Tag>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                <Image
                  src="/bill.svg"
                  alt="logo"
                  width={48}
                  height={48}
                  className="mx-auto p-2"
                />
              </div>

              {/* Title */}
              <Title level={4} className="!mb-0">
                Offline Bill Payment
              </Title>

              {/* Subtitle */}
              <Text
                type="secondary"
                className="font-[500] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center"
              >
                Pay bills manually by entering customer details and bill information
              </Text>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">Manual Entry</Button>
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">All Operators</Button>
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">Instant</Button>
              </div>
            </div>

          </Card>

          {/* Online Bill Payment */}
          <Card
            hoverable
            className="rounded-2xl shadow-md"
            styles={{ body: { padding: "24px" } }}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                <Image
                  src="/a.svg"
                  alt="logo"
                  width={32}
                  height={32}
                  className="mx-auto p-1"
                />
              </div>
              <Title level={4} className="!mb-0">
                Online Bill Payment
              </Title>
              <Text type="secondary" className="font-[400] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center">
                Pay bills online with automatic bill fetch and payment processing
              </Text>
              <div className="flex flex-wrap justify-center gap-2 mt-3 w-[251px] h-[16px]">
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">Auto Fetch</Button>
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">Quick Pay</Button>
                <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">Secure</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

