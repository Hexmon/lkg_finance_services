"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function VehicleRegistration() {
  const router = useRouter();
  return (
    <DashboardLayout
      sections={moneyTransferSidebarConfig}
      activePath="/fastag/vechileregistration"
      pageTitle="FASTag"
    >
      {/* Section Header */}
      <DashboardSectionHeader
        title="Fastag"
        titleClassName="!text-[#2F2F2F] !font-semibold !text-[22px]"
        arrowClassName="!text-[#2F2F2F]"
      // imgSrc="/logo.svg"
      // imgClassName="!w-[98px] !h-[36px] !mr-8"
      />

      <div className="p-6 min-h-screen w-full ">
        {/* Content Card */}
        <Card className="rounded-xl shadow-sm bg-[#FFF7EC] p-6 mx-auto w-full ">
          {/* Customer Onboarding Title */}
          <div className="flex items-center gap-2 mb-2 mt-6 ml-4">
            <Image
              src="/car.svg"
              alt="Car Icon"
              width={18}
              height={18}
              className="object-contain"
            />
            <Text className="!text-[16px] font-medium">Customer Onboarding</Text>
          </div>
          <Text className="block text-gray-500 mb-6 ml-10.5">
            Register new customers for FASTag services
          </Text>

          {/* Stepper */}
          <div className="flex items-center mb-16 justify-center">
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
                alt="otp verification"
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
              <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center">
                3
              </div>
              <span className="text-sm mt-2">Vehicle Registration</span>
            </div>
            {/* Line */}
            <Image
              src="/str-line.svg"
              alt="line"
              width={60}
              height={2}
              className="object-contain self-center mb-6.5"
            />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                4
              </div>
              <span className="text-sm mt-2">Upload KYC</span>
            </div>
          </div>
          {/* Vehicle No. Input + Search */}
          <div className="max-w-3xl mx-auto mb-10">
            <label className="block mb-2 text-black-600 !font-medium !text-[13px]">
              Vehicle No.
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Full Name"
                className="flex-1 h-[45px] px-4 rounded-xl border border-gray-300 text-sm focus:outline-none bg-[#FCFCFC]"
              />
              <button className="bg-[#3386FF] text-white px-6 rounded-xl text-sm hover:bg-blue-600">
                Search
              </button>
            </div>
          </div>

          {/* Step 3 - Vehicle Registration */}
          <div className="mb-6 rounded-xl shadow-xl">
            <Text className="font-medium block mb-6 ml-10.5 text-[12px] p-2">
              Step 3 : Vehicle Registration
            </Text>

            <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">First Name</Text>
                <Input placeholder="Enter First Name" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* ID Expiry Date */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">ID Expiry Date</Text>
                <Input type="date" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Gender */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Gender</Text>
                <select className="w-full !h-[42px] rounded-md border border-gray-300 px-2">
                  <option value="">Select Gender</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="O">O</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Email</Text>
                <Input placeholder="Enter Email" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* DOB */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">DOB</Text>
                <Input type="date" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Mobile */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Mobile</Text>
                <Input placeholder="Enter Mobile Number" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Address 1 */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Address 1</Text>
                <Input placeholder="Enter Address 1" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Address 2 */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Address 2</Text>
                <Input placeholder="Enter Address 2" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Special Date */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Special Date</Text>
                <Input type="date" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Registration Date */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Registration Date</Text>
                <Input type="date" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Address Category */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Address Category</Text>
                <Input placeholder="Permanent/Temporary" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Pincode */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Pincode</Text>
                <Input placeholder="Enter Pincode" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Country */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Country</Text>
                <Input placeholder="Enter Country" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* State */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">State</Text>
                <Input placeholder="Enter State" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* City */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">City</Text>
                <Input placeholder="Enter City" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* ID Type */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">ID Type</Text>
                <Input placeholder="RC NUMBER" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* ID Number */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">ID Number</Text>
                <Input placeholder="Enter ID Number" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Is Commercial */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Is Commercial</Text>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="isCommercial" value="yes" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="isCommercial" value="no" /> No
                  </label>
                </div>
              </div>

              {/* Entity Type */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Entity Type</Text>
                <Input placeholder="Truck Corporate" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Kit No. */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Kit No.</Text>
                <Input placeholder="Enter Kit Number" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Dependant */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Dependant</Text>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="dependant" value="yes" /> Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="dependant" value="no" /> No
                  </label>
                </div>
              </div>

              {/* Profile ID */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Profile ID</Text>
                <Input placeholder="VC4" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Tag ID */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Tag ID</Text>
                <Input placeholder="VC4" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Com Vehicle */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Com Vehicle</Text>
                <Input placeholder="T" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Engine No */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Engine No</Text>
                <Input placeholder="K12MP1346182" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* VRN */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">VRN</Text>
                <Input placeholder="78578542" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* VIN */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">VIN</Text>
                <Input placeholder="78578542" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* National Permit */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">National Permit</Text>
                <Input placeholder="T" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Registered As */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Registered As</Text>
                <Input placeholder="F" className="!h-[42px] rounded-md w-full" />
              </div>

              {/* Vehicle Descriptor */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Vehicle Descriptor</Text>
                <select className="w-full !h-[42px] rounded-md border border-gray-300 px-2">
                  <option value="">Select</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              {/* National Permit Date */}
              <div>
                <Text className="block mb-1 text-black-600 font-medium text-[12px]">National Permit Date</Text>
                <Input type="date" className="!h-[42px] rounded-md w-full" />
              </div>
            </div>

            <div className="flex justify-center mt-8 p-4">
              <Button
                type="default"
                className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-normal hover:!bg-[#E2E8F0] !w-[445px] text-[12px] cursor-pointer"
                onClick={()=>router.push("/fastag/upload_kyc")}
              >
                Continue to KYC
              </Button>
            </div>
          </div>

        </Card>
      </div>
    </DashboardLayout>
  );
}