"use client";

import { Card, Button, Input, Select, Typography } from "antd";
import Image from "next/image";
import SmartSelect, { SmartOption } from "../ui/SmartSelect";

const { Text, Title } = Typography;

export default function NewTransfer() {
  const options: SmartOption<string>[] = [
    {
      value: "imps",
      label: (
        <div className="flex justify-between w-full">
          <span>IMPS - Instant Transfer (24*7)</span>
          <span className="text-gray-500">Fee ₹5 | Time Instant</span>
        </div>
      ),
    },
    {
      value: "neft",
      label: (
        <div className="flex justify-between w-full">
          <span>NEFT - Working Hours Only</span>
          <span className="text-gray-500">Fee ₹2.5 | Time 30min</span>
        </div>
      ),
    },
    {
      value: "rtgs",
      label: (
        <div className="flex justify-between w-full">
          <span>RTGS</span>
          <span className="text-gray-500">Fee ₹25 | Time 30min</span>
        </div>
      ),
    },
  ];

  // const purposeOptions: SmartOption<string>[] = [
  //   { value: "family", label: "Family Support" },
  //   { value: "business", label: "Business" },
  //   { value: "education", label: "Education" },
  //   { value: "others", label: "Others" },
  // ];

  return (
    <div className=" min-h-screen w-full">

      {/* Transfer Card */}
      <Card className="rounded-2xl shadow-md mb-6">
        {/* Header */}
        <div className="mb-8">
          <Title level={4} className="!mb-1">
            Transfer
          </Title>
          <Text type="secondary">Choose the best option for your transfer</Text>
        </div>

        {/* Beneficiary Info */}
        <div className="flex items-center justify-center">
          <div className="p-4 rounded-[15px] shadow-xl grid items-start gap-4 w-fit bg-white">
            {/* Avatar + Details */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="bg-[#5298FF54] rounded-full w-[55px] h-[55px] flex items-center justify-center shrink-0">
                <Image
                  src="/person-blue.svg"
                  alt="person image"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              {/* Right Section */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <Text strong className="text-[15px]">
                      Rajesh Kumar
                    </Text>
                    <Text type="secondary" className="text-[14px]">
                      SBI
                    </Text>
                  </div>
                  <a className="text-blue-600 text-[14px] ml-6">
                    Sender → Receiver
                  </a>
                </div>

                {/* Account & IFSC */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between">
                    <Text type="secondary">Account:</Text>
                    <Text className="font-semibold">*****1234</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">IFSC Code:</Text>
                    <Text strong>SBIFN89</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode of Transfer */}
        <div className="mb-6 mt-6">
          <Text className="text-[#232323] font-semibold">Mode of Transfer</Text>
          <SmartSelect
            placeholder="Select Mode.."
            className="w-full mt-1"
            options={options}
            allowClear
            onChange={(val, option) => {
              console.log("Selected:", val, option);
            }}
          />
        </div>

        {/* Transfer Amount */}
        <div className="mb-6">
          <Text className="text-[#232323] font-semibold">Transfer Amount</Text>
          <Input
            prefix="₹"
            placeholder="0.00"
            className="mt-1"
            suffix={
              <span className="text-xs text-gray-400">
                Min: ₹100 | Max: ₹2,00,000
              </span>
            }
          />
        </div>

        {/* Purpose of Transfer */}
        {/* <div className="mb-6">
          <Text className="text-[#232323] font-semibold">Purpose of Transfer</Text>
          <SmartSelect
            placeholder="Select Purpose.."
            className="w-full"
            options={purposeOptions}
            allowClear
            onChange={(val, option) => {
              console.log("Purpose:", val, option);
            }}
          />
        </div> */}

        {/* OTP */}
        <div className="mb-6">
          <Text className="text-[#232323] font-semibold">OTP</Text>
          <div className="flex gap-2 mt-1">
            <Input placeholder="Enter OTP" />
            <Button>Send OTP</Button>
          </div>
        </div>

        {/* Transfer Button */}
        <Button
          type="primary"
          className="!bg-[#3386FF] w-full h-[44px] text-white rounded-[9px] !text-[12px] !font-medium"
        >
          Transfer Money
        </Button>
      </Card>
    </div>
  );
}
