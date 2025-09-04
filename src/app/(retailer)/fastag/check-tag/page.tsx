"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function FastTagCheckTagPage() {
  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/fastag/onboarding"
      pageTitle="FASTag"
    >
      {/* Section Header */}
      <DashboardSectionHeader
        title="New Customer Onboarding"
        subtitle="Fastag Recharge"
        titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
        arrowClassName="!text-[#2F2F2F]"
        imgSrc="/logo.svg"
        imgClassName="!w-[98px] !h-[36px] !mr-8"
      />

      {/* Page Content */}
      <div className="p-6 min-h-screen w-full">
        <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
          {/* Header: Title + Subtitle */}
          <div className="flex items-center gap-2 mb-2 mt-6 ml-4">
            <Image
              src="/car.svg"
              alt="Car Icon"
              width={18}
              height={18}
              className="object-contain"
            />
            <Text className="!text-[16px] font-medium">Vehicle Onboarding</Text>
          </div>
          <Text className="block text-gray-500 mb-6 ml-10.5">
            Register vehicles and verify FASTag details
          </Text>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm mt-2">Check Tag</span>
            </div>

            {/* Line */}
            <Image
              src="/str-line.svg"
              alt="line"
              width={60}
              height={2}
              className="object-contain self-center mb-6.5"
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm mt-2">Vehicle Details</span>
            </div>

            {/* Line */}
            <Image
              src="/str-line.svg"
              alt="line"
              width={60}
              height={2}
              className="object-contain self-center mb-6.5"
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm mt-2">Upload Documents</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="w-full min-h-[339px] rounded-[15px] bg-white shadow-sm p-6">
            {/* Step Title */}
            <Text className="font-medium block mb-10 ml-4 text-[15px]">
              Step 1 : Check Tag
            </Text>

            {/* Inputs */}
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Tag ID */}
              <div>
                <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                  Tag ID
                </Text>
                <Input
                  placeholder="Enter Tag ID"
                  className="!h-[42px] rounded-md bg-[#F5F5F5] border-none"
                />
              </div>

              {/* Kit Number */}
              <div>
                <Text className="block mb-1 text-[#666] font-medium text-[13px]">
                  Kit Number
                </Text>
                <Input
                  placeholder="Enter Kit Number"
                  className="!h-[42px] rounded-md bg-[#F5F5F5] border-none"
                />
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-10">
              <Button
                type="default"
                className="!bg-[#5298FF54] !text-[#3386FF] !rounded-lg !h-[42px] !font-medium !w-[445px] hover:!bg-[#2465c3] text-2xl"
              >
                Send OTP
              </Button>
            </div>
          </Card>
        </Card>
      </div>
    </DashboardLayout>
  );
}
