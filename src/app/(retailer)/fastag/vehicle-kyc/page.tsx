"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;

export default function FastTagKYCUploadStep3() {
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
            Register new customers for FASTag services
          </Text>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <Image
                src="/verified-b.svg"
                alt="step 1 complete"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-sm mt-2">OTP Verification</span>
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
              <Image
                src="/verified-b.svg"
                alt="step 2 complete"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-sm mt-2">Customer Registration</span>
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
              <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm mt-2">KYC Upload</span>
            </div>
          </div>

          {/* Upload Form Card */}
          <Card className="w-full min-h-[339px] rounded-[15px] bg-white shadow-sm p-6">
            {/* Step Title */}
            <Text className="font-medium block mb-8 ml-5 text-[15px]">
              Step 3 : Upload Documents
            </Text>

            {/* Upload Sections */}
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* RC Upload */}
              <div>
                <Text className="block mb-2 text-[#666] font-medium text-[13px]">
                  Upload RC (Registration Certificate)
                </Text>
                <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg h-[120px] flex flex-col items-center justify-center text-[#666] text-sm">
                  <Image
                    src="/upload-icon.svg"
                    alt="upload"
                    width={30}
                    height={30}
                    className="mb-2"
                  />
                  <button className="text-blue-500 hover:underline">
                    Choose File
                  </button>
                </div>
              </div>

              {/* Image Tag Upload */}
              <div>
                <Text className="block mb-2 text-[#666] font-medium text-[13px]">
                  Upload Image Tag
                </Text>
                <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg h-[120px] flex flex-col items-center justify-center text-[#666] text-sm">
                  <Image
                    src="/upload-icon.svg"
                    alt="upload"
                    width={30}
                    height={30}
                    className="mb-2"
                  />
                  <button className="text-blue-500 hover:underline">
                    Choose File
                  </button>
                </div>
              </div>

              {/* Vehicle Image Upload */}
              <div>
                <Text className="block mb-2 text-[#666] font-medium text-[13px]">
                  Upload Vehicle Image
                </Text>
                <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg h-[120px] flex flex-col items-center justify-center text-[#666] text-sm">
                  <Image
                    src="/upload-icon.svg"
                    alt="upload"
                    width={30}
                    height={30}
                    className="mb-2"
                  />
                  <button className="text-blue-500 hover:underline">
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-10">
              <Button
                type="default"
                className="!bg-[#3386FF1A] !text-[#3386FF] !rounded-lg !h-[42px] !font-medium !w-[445px] hover:!bg-[#E2E8F0]"
              >
                Complete Registration
              </Button>
            </div>
          </Card>
        </Card>
      </div>
    </DashboardLayout>
  );
}
