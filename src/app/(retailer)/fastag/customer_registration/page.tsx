"use client";

import React from "react";
import { Card, Typography, Button, Input } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function FastTagCustomerRegistrationPage() {
    const router = useRouter();
    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/fastag/customerregistration"
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
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center">
                                2
                            </div>
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
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
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

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#82828240] text-white flex items-center justify-center">
                                4
                            </div>
                            <span className="text-sm mt-2">KYC Upload</span>
                        </div>
                    </div>

                    {/* Step 2 - Customer Registration */}
                    <div className="mb-6 rounded-xl shadow-xl">
                        <Text className="font-medium block mb-6 ml-10.5 text-[12px] p-2">
                            Step 2 : Customer Registration
                        </Text>

                        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
                            {/* OTP */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Enter OTP</Text>
                                <Input placeholder="Enter OTP" className="!h-[42px] rounded-md w-full" />
                            </div>

                            {/* Title */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Title</Text>
                                <Input placeholder="Enter Title" className="!h-[42px] rounded-md w-full" />
                            </div>

                            {/* First Name */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">First Name</Text>
                                <Input placeholder="Enter First Name" className="!h-[42px] rounded-md w-full" />
                            </div>

                            {/* Last Name */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Last Name</Text>
                                <Input placeholder="Enter Last Name" className="!h-[42px] rounded-md w-full" />
                            </div>

                            {/* Gender */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Gender</Text>
                                <select className="w-full !h-[42px] rounded-md border border-gray-300 px-2">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* DOB */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Date of Birth</Text>
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

                            {/* Address 3 */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Address 3</Text>
                                <Input placeholder="Enter Address 3" className="!h-[42px] rounded-md w-full" />
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

                            {/* KYC Info */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">ID Number</Text>
                                <Input placeholder="Enter ID Number" className="!h-[42px] rounded-md w-full" />
                            </div>

                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Proof Type</Text>
                                <Input placeholder="Enter Proof Type" className="!h-[42px] rounded-md w-full" />
                            </div>

                            {/* Politically Exposed */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px]">Politically Exposed</Text>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-1">
                                        <input type="radio" name="politicallyExposed" value="yes" />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input type="radio" name="politicallyExposed" value="no" />
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Consent */}
                            <div className="col-span-3">
                                <label className="flex items-center gap-2 text-[#3386FF] !font-medium !text-[12px]">
                                    <input type="checkbox" />
                                    I Accept Terms & Conditions
                                </label>
                            </div>
                        </div>



                        <div className="flex justify-center mt-8 p-4">
                            <Button
                                type="default"
                                className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-normal hover:!bg-[#E2E8F0] !w-[445px] text-[12px] cursor-pointer"
                                onClick={()=>router.push("/fastag/vehicle_registration")}
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