"use client";

import React from "react";
import { Card, Typography, Button } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function FastTagSuccessPage() {
  const router = useRouter();
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
        // imgSrc="/logo.svg"
        // imgClassName="!w-[98px] !h-[36px] !mr-8"
      />

      {/* Page Content */}
      <div className="p-6 min-h-screen w-full">
        <Card className="rounded-xl shadow-sm !bg-[#CCCCCC9C] p-6 mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 mt-6 ml-4">
            <Image
              src="/car.svg"
              alt="Car Icon"
              width={18}
              height={18}
              className="object-contain"
            />
            <Text className="!text-[16px] font-medium">Vehicle Onboarding</Text>
          </div>

          {/* Success Message Card */}
          <div className="mt-6 p-10 bg-[#E6FCE9] border border-[#00A321] rounded-xl shadow text-center w-full mx-auto">
            <div className="flex justify-center mb-6">
              <Image
                src="/verified-b.svg" // Replace with your check-circle icon path
                alt="success"
                width={60}
                height={60}
              />
            </div>
            <Text className="!block !text-[#00A321] !font-normal !text-[20px] !mb-2">
              Vehicle Onboarded Successfully
            </Text>
            <Text className="!block !text-[#00A321] !font-medium !text-[15px] !mb-6">
              Vehicle Onboarded Successfully, Move to Fastag Recharge
            </Text>
            <Button
              type="default"
              className="!bg-[#00A321] !text-white w-[425px] h-[39px] rounded-[8px] rotate-0 opacity-100 !text-[12px]"
              onClick={()=>router.push("/fastag/dashboard")}
            >
              Proceed to Fastag Recharge
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}