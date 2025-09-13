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
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function BroadbandPrepaidPage() {
  const [biller, setBiller] = useState<string | undefined>();
  const [mobileno, setMobileno] = useState("");
  const { service_id, bbps_category_id } = useParams() as { service_id: string; bbps_category_id: string };

  const {
    data: billerData,
    isLoading,
    isError,
    error,
  } = useBbpsBillerListQuery({ service_id, bbps_category_id, is_offline: false, mode: "ONLINE" });
  const router = useRouter();
console.log({billerData});

  return (
    <DashboardLayout activePath="/bill_payment" sections={billPaymentSidebarConfig} pageTitle="Bill Payment" isLoading={isLoading}>
      <div className="min-h-screen w-full mb-3">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title="Mobile Prepaid"
            titleClassName="!font-medium text-[20px] !mt-0"
            subtitle="Recharge"
            subtitleClassName="!mb-4"
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
          <div className="flex items-center gap-2 mb-8">
            <Image
            src="/wifi.svg"
            alt="wifi"
            width={21}
            height={21}
            className="object-contain"
            />
            <Title level={5} className="!mb-0">
              Select Broadband Biller
            </Title>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 ml-6">
            {/* Biller Dropdown */}
            <div>
              <Text strong className="!mb-4">Biller *</Text>
              <Select
                placeholder="Choose Your Biller"
                value={biller}
                onChange={setBiller}
                className="!w-full !mt-1 !h-[54px]"
              >
                <Select.Option value="BroadBandPostPaid_Dummy">BroadBandPostPaid_Dummy</Select.Option>
              </Select>
            </div>

            {/* Customer ID Input */}
            <div>
              <Text strong>Mobile No *</Text>
              <Input
                placeholder="Enter your Customer ID or Phone Number"
                value={mobileno}
                onChange={(e) => setMobileno(e.target.value)}
                className="mt-1 !h-[54px] !mb-8"
              />
            </div>

            {/* Fetch Bill Button */}
            <Button
              type="primary"
              block
              disabled={!biller || !mobileno}
              className="!bg-[#3386FF] !h-[45px] !rounded-[12px] !text-white"
              onClick={() => router.push("/bill_payment/bbps-online/[service_id]/bbps-broadband-postpaid/[bbps_category_id]")}
            >
              Fetch Plan Details
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
