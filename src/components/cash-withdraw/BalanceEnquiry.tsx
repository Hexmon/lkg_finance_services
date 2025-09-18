"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input, Button, Typography, Modal } from "antd";
import SmartSelect from "@/components/ui/SmartSelect";

const { Title, Text } = Typography;

export default function BalanceEnquiry() {
    const [customerName, setCustomerName] = useState("");
    const [bank, setBank] = useState<string>();
    const [aadhaar, setAadhaar] = useState("");
    const [mobile, setMobile] = useState("");
    const [fingerCaptured, setFingerCaptured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 🔹 Dummy search function for SmartSelect
    const searchBanks = async (query: string) => {
        const banks = [
            { label: "State Bank of India", value: "SBI" },
            { label: "HDFC Bank", value: "HDFC" },
            { label: "ICICI Bank", value: "ICICI" },
            { label: "Axis Bank", value: "AXIS" },
            { label: "Punjab National Bank", value: "PNB" },
        ];
        return banks.filter((b) =>
            b.label.toLowerCase().includes(query.toLowerCase())
        );
    };

    // Validations
    const isValidName = customerName.length > 2;
    const isValidAadhaar = aadhaar.length === 12;
    const isValidMobile = mobile.length === 10;

    const canProcess =
        isValidName && bank && isValidAadhaar && isValidMobile && fingerCaptured;

    const handleScanToggle = () => {
        setFingerCaptured(true);
        setRetriveOpen(true);
    };
    const [retriveOpen, setRetriveOpen] = useState(false);

    const handleProcess = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Balance enquiry processed!");
        }, 1500);

    };


    return (
        <>
            {/* Modal */}
            <Modal
                open={retriveOpen}
                onCancel={() => setRetriveOpen(false)}
                footer={null}
                centered
                className="rounded-2xl"
            >
                <div className="flex flex-col items-center text-center p-4">
                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-[#E8F9EE] rounded-full flex items-center justify-center mb-4">
                        <Image src="/verified-b.svg" alt="success" width={75} height={75} />
                    </div>

                    {/* Title */}
                    <Title level={5} className="!text-[#0BA82F]">
                        Balance Retrieved Successfully
                    </Title>
                    <Text type="secondary" className="!text-[#0BA82F]">
                        Your Account Balance has been retrieved successfully
                    </Text>

                    {/* Balance Box */}
                    <div className="mt-5 p-4 border border-[#0BA82F] rounded-lg bg-[#0BA82F36] w-full max-w-xs">
                        <Text className="block text-[#0BA82F] font-medium">
                            Available Balance
                        </Text>
                        <p className="text-2xl font-bold text-[#0BA82F]">₹63,163</p>
                    </div>

                    {/* Transaction Details */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 w-full text-sm">
                        <div className="flex justify-between">
                            
                                <span className="text-gray-500">Transaction ID: </span>
                                <span className="font-medium">BAL1758029150976</span>
                            
                        </div>
                    
                            <div className="flex justify-between">
                            <span className="text-gray-500">Account Number: </span>
                            <span className="font-medium">XXXX5413</span>
                            </div>
                        
                        
                            <div className="flex justify-between">
                            <span className="text-gray-500">Bank: </span>
                            <span className="font-medium">ICICI Bank</span>
                            </div>
                        
                        
                            <div className="flex justify-between">
                            <span className="text-gray-500">Date &amp; Time: </span>
                            <span className="font-medium">9/16/2025, 6:55:50</span>
                            </div>
                        
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-center gap-4 mt-6 w-full">
                        <Button
                            className="!bg-white border !border-[#3386FF] !text-[#3386FF] !rounded-lg !px-6 w-full"
                            onClick={() => setRetriveOpen(false)}
                        >
                            New Enquiry
                        </Button>
                        <Button
                            className="!bg-[#3386FF] !text-white !rounded-lg !px-6 w-full"
                            onClick={() => setRetriveOpen(false)}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </Modal>
            <div className="!bg-[#FFFFFF] rounded-2xl shadow-md p-6">
                {/* Header */}
                <div className="mb-11">
                    <div className="flex items-center">
                        <Image
                            src="/aeps.svg"
                            alt="balance"
                            width={26}
                            height={28}
                            className="object-contain"
                        />
                        <Title level={5} className="mt-1 ml-1.5">
                            Balance Enquiry
                        </Title>
                    </div>
                    <Text type="secondary" className="ml-8">
                        Fill in the customer information for balance enquiry
                    </Text>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-4 ml-8">
                    {/* Customer Name */}
                    <div className="flex flex-col w-full max-w-[444px]">
                        <label className="text-sm font-medium">Customer Name *</label>
                        <Input
                            placeholder="Enter Customer Name"
                            className="rounded-lg h-11 mt-1"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            status={customerName && !isValidName ? "error" : undefined}
                        />
                    </div>

                    {/* Bank Select */}
                    <div className="flex flex-col w-full max-w-[444px]">
                        <label className="text-sm font-medium">Select Bank *</label>
                        <SmartSelect<string>
                            placeholder="Choose Bank"
                            className="w-full rounded-lg h-11 mt-1"
                            remote
                            debounceMs={300}
                            initialRemoteOptions={[]}
                            searchFn={searchBanks}
                            allowClear
                            value={bank ?? null}
                            onChange={(val) => setBank(val ?? undefined)}
                            dropdownMatchSelectWidth
                        />
                    </div>

                    {/* Aadhaar */}
                    <div className="flex flex-col w-full max-w-[444px]">
                        <label className="text-sm font-medium">Aadhaar number *</label>
                        <Input.Password
                            placeholder="Enter 12-digit Aadhaar number"
                            className="rounded-lg h-11 mt-1"
                            value={aadhaar}
                            onChange={(e) =>
                                setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))
                            }
                            status={aadhaar && !isValidAadhaar ? "error" : undefined}
                        />
                        <Text type="secondary" className="text-xs mt-1">
                            Enter 12-digit Aadhaar number
                        </Text>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col w-full max-w-[444px]">
                        <label className="text-sm font-medium">Mobile Number *</label>
                        <Input
                            placeholder="+91 **********"
                            className="rounded-lg h-11 mt-1"
                            value={mobile}
                            onChange={(e) =>
                                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                            }
                            status={mobile && !isValidMobile ? "error" : undefined}
                        />
                    </div>
                </div>

                {/* Fingerprint Capture */}
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
                        <Image src="/biometric.svg" alt="fingerprint" width={60} height={60} />
                    </div>
                    <Text className="mt-2 font-medium">
                        {fingerCaptured ? "Fingerprint Captured ✓" : "Capture Fingerprint"}
                    </Text>
                    <Text type="secondary" className="text-xs">
                        Ask customer to place finger on scanner
                    </Text>
                    <Button
                        className="!mt-4 !bg-[#3386FF] !text-white !rounded-lg !px-10 !h-10 !w-[219px]"
                        onClick={handleScanToggle}
                    >
                        <Image
                            src="/scanner-w.svg"
                            alt="biometric"
                            width={15}
                            height={15}
                            className="object-contain mr-2"
                        />
                        {fingerCaptured ? "Recapture" : "Scan Now"}
                    </Button>
                </div>

                {/* Process Button */}
                <Button
                    block
                    className={`!mt-6 h-12 !rounded-lg ${canProcess ? "!bg-[#3386FF] !text-white" : "!bg-[#5298FF54] !text-white"
                        }`}
                    disabled={!canProcess || isLoading}
                    onClick={handleProcess}
                >
                    {isLoading ? "Processing..." : "Process AEPS Transaction"}
                </Button>
            </div>
        </>
    );
}
