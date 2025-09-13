"use client";

import React, { useState } from "react";
import { Card, Input, Select, Button, Typography } from "antd";
import Image from "next/image";
import { services } from "@/config/app.config";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AEPSFormPage() {
    const [step, setStep] = useState<number>(0);
    const router = useRouter();

    return (
        <>
            {step === 0 && (
                <div className="min-h-screen bg-transparent p-6 space-y-3">
                    {/* AEPS Services */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <Title level={5}>Select AEPS Service</Title>
                        <Text type="secondary">Choose the service you want to provide</Text>

                        <div className="flex justify-center gap-6 flex-wrap mt-4">
                            {services.map(({ key, label, icon }) => (
                                <Image
                                    key={key}
                                    src={icon}
                                    alt={label}
                                    width={139}
                                    height={137}
                                    className="object-contain"
                                    priority
                                />
                            ))}
                        </div>
                    </div>

                    {/* AEPS Transaction Form */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="mb-11">
                            <div className="flex items-center">
                                <Image
                                    src="/aeps.svg"
                                    alt="aeps"
                                    width={26}
                                    height={28}
                                    className="object-contain"
                                />
                                <Title level={5} className="mt-1 ml-1.5">AEPS Transaction Details</Title>
                            </div>
                            <Text type="secondary" className="ml-8">Fill in the customer and transaction information</Text>
                        </div>

                        {/* Form Fields */}
                        <div className="grid md:grid-cols-2 gap-4 ml-8">
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Customer Name *</label>
                                <Input placeholder="Enter Customer Name" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Select Bank *</label>
                                <Select placeholder="Choose Bank" className="w-full rounded-lg h-11 mt-1">
                                    <Option value="sbi">SBI</Option>
                                    <Option value="icici">ICICI</Option>
                                    <Option value="hdfc">HDFC</Option>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Aadhaar number *</label>
                                <Input.Password placeholder="Enter 12-digit Aadhaar number" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Mobile Number *</label>
                                <Input placeholder="+91 **********" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="md:col-span-2 flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Enter Amount *</label>
                                <Input.Password placeholder="***************" className="rounded-lg h-11 mt-1" />
                            </div>
                        </div>

                        {/* Fingerprint Capture */}
                        <div className="flex flex-col items-center justify-center mt-20">
                            <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
                                <Image src="/biometric.svg" alt="fingerprint" width={90} height={90} />
                            </div>
                            <Text className="mt-2 font-medium">Capture Fingerprint</Text>
                            <Text type="secondary" className="text-xs">Ask customer to place finger on scanner</Text>
                            <Button
                                className="!mt-4 !bg-[#3386FF] !text-white !rounded-lg !px-10 !h-10 !w-[219px]"
                                onClick={() => setStep(1)}
                            >
                                <Image
                                    src="/scanner-w.svg"
                                    alt="biometric"
                                    width={15}
                                    height={15}
                                    className="object-contain mr-2"
                                />
                                Scan Now
                            </Button>
                        </div>

                        {/* Disabled Process Button */}
                        <Button
                            disabled
                            block
                            className="!mt-6 h-12 !bg-[#5298FF54] !text-white !rounded-lg"
                        >
                            <Image
                                src="/aeps-white.svg"
                                alt="aeps"
                                width={15}
                                height={15}
                                className="object-contain mr-2"
                            />
                            Process AEPS Transaction
                        </Button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-screen bg-transparent p-6 space-y-8">
                    {/* AEPS Services */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <Title level={5}>Select AEPS Service</Title>
                        <Text type="secondary">Choose the service you want to provide</Text>

                        <div className="flex justify-center gap-6 flex-wrap mt-4">
                            {services.map(({ key, label, icon }) => (
                                <Image
                                    key={key}
                                    src={icon}
                                    alt={label}
                                    width={139}
                                    height={137}
                                    className="object-contain"
                                    priority
                                />
                            ))}
                        </div>
                    </div>

                    {/* AEPS Transaction Form */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="mb-11">
                            <div className="flex items-center">
                                <Image
                                    src="/aeps.svg"
                                    alt="aeps"
                                    width={26}
                                    height={28}
                                    className="object-contain"
                                />
                                <Title level={5} className="mt-1 ml-1.5">AEPS Transaction Details</Title>
                            </div>
                            <Text type="secondary" className="ml-8">Fill in the customer and transaction information</Text>
                        </div>

                        {/* Form Fields */}
                        <div className="grid md:grid-cols-2 gap-4 ml-8">
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Customer Name *</label>
                                <Input placeholder="Enter Customer Name" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Select Bank *</label>
                                <Select placeholder="Choose Bank" className="w-full rounded-lg h-11 mt-1">
                                    <Option value="sbi">SBI</Option>
                                    <Option value="icici">ICICI</Option>
                                    <Option value="hdfc">HDFC</Option>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Aadhaar number *</label>
                                <Input.Password placeholder="Enter 12-digit Aadhaar number" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Mobile Number *</label>
                                <Input placeholder="+91 **********" className="rounded-lg h-11 mt-1" />
                            </div>
                            <div className="md:col-span-2 flex flex-col w-full max-w-[444px]">
                                <label className="text-sm font-medium">Enter Amount *</label>
                                <Input.Password placeholder="***************" className="rounded-lg h-11 mt-1" />
                            </div>
                        </div>

                        {/* Fingerprint Capture */}
                        <div className="flex flex-col items-center justify-center mt-20">
                            <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
                                <Image src="/biometric.svg" alt="fingerprint" width={90} height={90} />
                            </div>
                            <Text className="mt-2 font-medium">Fingerprint Captured ✓</Text>
                            <Text type="secondary" className="text-xs">Ask customer to place finger on scanner</Text>
                            <Button
                                className="!mt-4 !bg-[#3386FF] !text-white !rounded-lg !px-10 !h-10 !w-[219px]"
                                onClick={() => setStep(1)}
                            >
                                <Image
                                    src="/scanner-w.svg"
                                    alt="biometric"
                                    width={15}
                                    height={15}
                                    className="object-contain mr-2"
                                />
                                Recapture
                            </Button>
                        </div>

                        {/* Disabled Process Button */}
                        <Button
                            block
                            className="!mt-6 h-12 !bg-[#3386FF] !text-white !rounded-lg"
                            onClick={() => router.push("/cash_withdrawal/payment_successful")}
                        >
                            <Image
                                src="/aeps-white.svg"
                                alt="aeps"
                                width={15}
                                height={15}
                                className="object-contain mr-2"
                            />
                            Process AEPS Transaction
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
