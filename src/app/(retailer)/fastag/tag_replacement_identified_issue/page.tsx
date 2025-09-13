"use client";

import React from "react";
import { Card, Typography, Select } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function FastTagReplacementPage() {
  return (
    <DashboardLayout
      sections={billPaymentSidebarConfig}
      activePath="/fastag/replacement"
      pageTitle="FASTag Recharge"
    >
      {/* Section Header */}
      <DashboardSectionHeader
        title="Tag Replacement"
        subtitle="Replace expired, stolen, or damaged FASTag"
        titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
        arrowClassName="!text-[#2F2F2F]"
        imgSrc="/logo.svg"
        imgClassName="!w-[120px] !h-[36px] !mr-8"
        showBack
      />

      {/* Page Content */}
      <div className="p-6 min-h-screen w-full">
        <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/car.svg"
              alt="Vehicle Icon"
              width={20}
              height={20}
              className="object-contain"
            />
            <Text className="!text-[16px] font-medium">Vehicle Onboarding</Text>
          </div>
          <Text className="block text-gray-500 mb-6 ml-6">
            Register new customers for FASTag services
          </Text>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-10 mb-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <Image
                src="/verified-b.svg"
                alt="otp verification"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-sm mt-2">OTP Verification</span>
            </div>

            <div className="w-16 h-[2px] bg-gray-300" />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm mt-2">Customer Registration</span>
            </div>

            <div className="w-16 h-[2px] bg-gray-300" />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm mt-2">KYC Upload</span>
            </div>
          </div>

          {/* Step Section */}
          <div className="flex justify-center items-center">
            <Card className="w-full max-w-[1050px] mx-auto rounded-[15px] bg-[#FFF7EC] shadow-sm p-8">
              <Text className="font-medium block mb-6 text-[15px]">
                Step 2 : Identify Issue
              </Text>

              {/* Selected Tag */}
              <div className="mb-6 !ml-12">
                <Text className="block text-gray-700 mb-2 font-medium">
                  Identify Issue
                </Text>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="text-[#232323] font-semibold">
                    Selected Tag: FT001234
                  </div>
                  <div className="text-gray-500 text-sm">
                    Vehicle: DL012ABCD1234
                  </div>
                </div>
              </div>

              {/* Issue Type Dropdown */}
              <div>
                <Text className="block text-gray-700 mb-2 font-medium !ml-12">
                  Issue Type
                </Text>
                <Select
                  placeholder="Select Issue Type"
                  className="w-full h-[45px] rounded-lg !ml-12"
                  options={[
                    { label: "Lost", value: "lost" },
                    { label: "Damaged", value: "damaged" },
                    { label: "Expired", value: "expired" },
                  ]}
                />
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
