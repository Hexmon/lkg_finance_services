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
            activePath="/fastag/uploadkyc"
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
                            <Image
                                src="/verified-b.svg"
                                alt="otp verification"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
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
                            <div className="w-8 h-8 rounded-full bg-[#3386FF] text-white flex items-center justify-center">
                                4
                            </div>
                            <span className="text-sm mt-2">Upload KYC</span>
                        </div>
                    </div>

                    {/* Step 4 - Kyc Upload */}
                    <div className="mb-6 rounded-xl shadow-xl">
                        <Text className="font-medium block mb-6 ml-10.5 text-[12px] p-2">
                            Step 3 : KYC Upload
                        </Text>

                        <div className="ml-14 flex flex-row gap-4">
                            {/* Vehicle Number */}
                            {/* Vehicle Number */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px] w-sm">
                                    Vehicle Number
                                </Text>
                                <select
                                    disabled
                                    className="w-sm !h-[42px] rounded-md border border-gray-300 px-2 bg-[#EBEBEB] text-gray-500 cursor-not-allowed"
                                >
                                    <option value="DL2CBC4200">DL2CBC4200</option>
                                </select>
                            </div>

                            {/* Vehicle Type */}
                            <div>
                                <Text className="block mb-1 text-black-600 font-medium text-[12px] w-sm">
                                    Vehicle Type
                                </Text>
                                <select
                                    disabled
                                    className="w-sm !h-[42px] rounded-md border border-gray-300 px-2 bg-[#EBEBEB] text-gray-500 cursor-not-allowed"
                                >
                                    <option value="Truck Corporate">Truck Corporate</option>
                                </select>
                            </div>

                        </div>

                        {/* Upload Sections */}
                        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 mt-6">
                            {/* Address Proof */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload Address Proof</Text>
                                <input type="file" className="hidden" id="addressProof" />
                                <label htmlFor="addressProof" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* ID Proof */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload ID Proof</Text>
                                <input type="file" className="hidden" id="idProof" />
                                <label htmlFor="idProof" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* ACK Document */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload ACK Document</Text>
                                <input type="file" className="hidden" id="ackDoc" />
                                <label htmlFor="ackDoc" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* Vehicle RC */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload Vehicle RC</Text>
                                <input type="file" className="hidden" id="vehicleRC" />
                                <label htmlFor="vehicleRC" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* Front Image */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload Front Image</Text>
                                <input type="file" className="hidden" id="frontImage" />
                                <label htmlFor="frontImage" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* Side Image */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload Side Image</Text>
                                <input type="file" className="hidden" id="sideImage" />
                                <label htmlFor="sideImage" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>

                            {/* Tag Image */}
                            <div className="border-2 border-dashed border-[#CFCFCF] rounded-lg w-full h-[180px] flex flex-col items-center justify-center text-[#666] text-sm col-span-2">
                                <Image src="/upload-icon.svg" alt="upload" width={30} height={30} className="mb-2" />
                                <Text className="block mb-2 text-[12px] text-[#9A9595]">Upload Tag Image</Text>
                                <input type="file" className="hidden" id="tagImage" />
                                <label htmlFor="tagImage" className="cursor-pointer text-blue-500 mt-1 hover:underline text-[12px]">
                                    Choose File
                                </label>
                            </div>
                        </div>


                        {/* Button */}
                        <div className="flex justify-center mt-8 p-4">
                            <Button
                                type="default"
                                className="!bg-[#3386FF] !h-[42px] !rounded-lg !text-[#FFFFFF] !font-normal hover:!bg-[#E2E8F0] !w-[445px] text-[12px]"
                                onClick={()=>router.push("/fastag/vehicle_onboarded_successfully")}
                            >
                                Complete Registration
                            </Button>
                        </div>
                    </div>


                </Card>
            </div>
        </DashboardLayout>
    );
}