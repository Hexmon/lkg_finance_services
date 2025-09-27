"use client";

import React from "react";
import { Card, Typography, Button, Select, message } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

export default function ChangeTagStatus() {
  const [messageApi, contextHolder] = message.useMessage();

  const handleChangeStatus = () => {
    messageApi.success("Tag status has been updated successfully!");
  };

  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/fastag/change-tag-status"
      pageTitle="FASTag"
    >
      {contextHolder}

      {/* Section Header */}
      <DashboardSectionHeader
        title="Change Tag Status"
        titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
        arrowClassName="!text-[#2F2F2F]"
      />

      <div className="p-6 min-h-screen w-full">
        {/* Main Card */}
        <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full">
          {/* Top Bar */}
          <Card className="rounded-xl shadow-sm bg-[#FFF7EC] h-[74px] flex items-center px-4 mx-auto w-full">
            <div className="flex items-center justify-between w-full">
              {/* Left Section */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Image
                    src="/car.svg"
                    alt="Car Icon"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  <Text className="!text-[15px] font-normal">Fastag Dashboard</Text>
                </div>
                <Text className="block text-gray-500 text-sm ml-6 font-light text-[12px]">
                  Select Your Fastag services
                </Text>
              </div>

              {/* Middle Section */}
              <div className="flex items-center justify-center gap-3 ml-45">
                <div className="bg-[#EBEBEB] text-black text-sm font-medium px-3 py-1 rounded-[9px] w-[95px] h-[32px] flex items-center justify-center">
                  ₹ 25,000
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-[9px] flex items-center gap-2 w-fit h-[34px]">
                  <Image
                    src="/plus.svg"
                    alt="plus"
                    width={15.83}
                    height={15.83}
                    className="object-contain"
                  />
                  Recharge Wallet
                </button>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-end gap-2 ml-55">
                <div className="w-8 h-8 rounded-full bg-[#5298FF54] flex items-center justify-center">
                  <Image src="/person.svg" alt="User Icon" width={18} height={18} />
                </div>
                <div className="text-right flex flex-col items-start">
                  <Text className="font-medium text-sm">Vijay Singh</Text>
                  <a
                    href="tel:9241773811"
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Mobile No.- 9241773811
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto mb-10 mt-10 grid grid-cols-2 gap-8">
            {/* Vehicle Number */}
            <div>
              <Text className="block mb-1 text-black-600 font-medium text-[12px]">
                Vehicle Number
              </Text>
              <Select
                defaultValue="UP78ES5388"
                className="w-full !h-[42px]"
              >
                <Option value="UP78ES5388">UP78ES5388</Option>
              </Select>
            </div>

            {/* Kit Number */}
            <div>
              <Text className="block mb-1 text-black-600 font-medium text-[12px]">
                Kit Number
              </Text>
              <Select
                defaultValue="34161AR32678900"
                className="w-full !h-[42px]"
              >
                <Option value="34161AR32678900">34161AR32678900</Option>
              </Select>
            </div>

            {/* Tag Operation */}
            <div>
              <Text className="block mb-1 text-black-600 font-medium text-[12px]">
                Tag Operation
              </Text>
              <Select defaultValue="Add" className="w-full !h-[42px]">
                <Option value="Add">Add</Option>
                <Option value="Remove">Remove</Option>
              </Select>
            </div>

            {/* EXC Code */}
            <div>
              <Text className="block mb-1 text-black-600 font-medium text-[12px]">
                EXC Code
              </Text>
              <Select defaultValue="Closed" className="w-full !h-[42px]">
                <Option value="Closed">Closed</Option>
                <Option value="Hotlist">Hotlist</Option>
                <Option value="Low Balance">Low Balance</Option>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-8 p-4 gap-6">
            <Button
              type="default"
              className="!bg-[#FFFF] !h-[42px] !rounded-lg !text-[#3386FF] !font-normal hover:!bg-[#E2E8F0] !w-[300px] text-[12px] !border !border-[#3386FF]"
            >
              Reset
            </Button>
            <Button
              type="default"
              className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-normal hover:!bg-[#2c76db] !w-[300px] text-[12px]"
              onClick={handleChangeStatus}
            >
              Change Status
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
