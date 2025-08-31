"use client";

import React from "react";
import { Card, Typography, Button, Tag, Badge } from "antd";
import {
  LeftOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";

const { Title, Text } = Typography;

export default function BillPaymentServicePage() {
  return (
    <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <DashboardSectionHeader
        title={<span className="!text-[#3386FF] !font-semibold !text-[32px]">Bill Payment Service</span>}
        subtitle={null}
        showBack
        arrowClassName="!text-[#3386FF]"
        dropdownItems={[
          { key: "bill", label: "Bill Payment Service", path: "/bill-payment" },
          { key: "complain", label: "Register Complain", path: "/bill-payment/complain" },
          { key: "status", label: "Transaction Status", path: "/bill-payment/status" },
        ]}
        dropdownSelectedKey="bill"
        onDropdownSelect={(key) => console.log("selected:", key)}
        dropdownTriggerClassName="text-blue-500"
        dropdownClassName="!min-w-[220px]"
      />
      <div className="p-8 bg-gray-50">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offline Bill Payment */}
          <CardLayout
            as="section"
            size="lg"
            elevation={2}
            hoverable
            rounded="rounded-2xl"
            className="rounded-2xl"
            footer={<div className="flex justify-center"><Button type="primary" className="!text-white !bg-[#0BA82F] w-[70%]" size="middle">Subscribe</Button></div>}
            body={
              <div className="relative w-full flex flex-col items-center text-center space-y-3">
                {/* Sub Tag in top-right */}
                <div className="absolute top-0 right-0">
                  {/* <Tag
                    color="white"
                    className="!bg-[#34C759] !text-white !rounded-lg !text-center !border-none !p-0 w-[96px] h-[32px] leading-[32px] flex items-center justify-center"
                    style={{ width: 96, height: 32, lineHeight: "32px", padding: "0 12px" }}
                  >
                    Sub.
                  </Tag> */}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                  <Image src="/bill.svg" alt="logo" width={48} height={48} className="mx-auto p-2" />
                </div>

                {/* Title */}
                <Title level={4} className="!mb-0">
                  Offline Bill Payment
                </Title>

                {/* Subtitle */}
                <Text className="font-[500] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center !text-gray-500">
                  Pay bills manually by entering customer details and bill information
                </Text>

                {/* Pills */}
                {/* <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    Manual Entry
                  </Button>
                  <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    All Operators
                  </Button>
                  <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    Instant
                  </Button>
                </div> */}
              </div>
            }
          />

          {/* Online Bill Payment */}
          <CardLayout
            as="section"
            size="lg"
            elevation={2}
            hoverable
            rounded="rounded-2xl"
            className="rounded-2xl"
            // header={<div className="flex justify-end"><Badge count={"Active"} showZero color="#0BA82F" className="!rounded-md" size="default" /></div>}
            header={<div className="flex justify-end"><span className="!bg-[#0BA82F] !rounded-md !text-white px-4 py-1">Active</span></div>}
            body={
              <div className="w-full flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100">
                  <Image src="/a.svg" alt="logo" width={32} height={32} className="mx-auto p-1" />
                </div>

                <Title level={4} className="!mb-0">
                  Online Bill Payment
                </Title>

                <Text className="font-[400] text-[14px] leading-[141%] font-[Poppins,sans-serif] text-center !text-gray-500">
                  Pay bills online with automatic bill fetch and payment processing
                </Text>

                <div className="flex flex-wrap justify-center gap-2 mt-3 w-[251px] h-[16px]">
                  <Button size="small" className="!text-[10px] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    Auto Fetch
                  </Button>
                  <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    Quick Pay
                  </Button>
                  <Button size="small" className="!text-[10px] !font-[Poppins,sans-serif] !bg-[#F4F8FF] border-0 w-[75px] h-[16px] rounded-[5px] !text-[#9A9595]">
                    Secure
                  </Button>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

