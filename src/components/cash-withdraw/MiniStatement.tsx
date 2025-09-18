"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input, Button, Typography, Modal } from "antd";
import SmartSelect from "@/components/ui/SmartSelect";

const { Title, Text } = Typography;

export default function MiniStatement() {
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
      alert("Mini Statement AEPS Transaction processed!");
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
      <Image src="/verified-b.svg" alt="success" width={50} height={50} />
    </div>

    {/* Title */}
    <Title level={5} className="!text-[#0BA82F]">
      Statement Generated Successfully
    </Title>
    <Text type="secondary" className="!text-[#0BA82F]">
      Your Mini statement has been retrieved successfully
    </Text>

    {/* Bank Info & Balance */}
    <div className="mt-5 p-4 rounded-lg bg-[#F5FFF8] w-full text-sm">
      <div className="flex justify-between font-medium">
        <div className="flex items-start flex-col">
            <span>ICICI Bank</span>
        <p className="text-gray-500">Account: XXXX9873</p>
        </div>
        <span className="text-green-600">Current Balance ₹63,163</span>
      </div>
      
    </div>

    {/* Statement List */}
    <div className="mt-4 space-y-2 w-full text-sm">
      {[
        { desc: "Bill Payment", date: "2025-09-12", amount: "₹3,163" },
        { desc: "Bill Payment", date: "2025-09-12", amount: "₹3,163" },
        { desc: "Bill Payment", date: "2025-09-12", amount: "₹3,163" },
        { desc: "Bill Payment", date: "2025-09-12", amount: "₹3,163" },
      ].map((txn, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-3 bg-[#F5FFF8] rounded-lg "
        >
          <div className="text-left">
            <p className="font-medium">{txn.desc}</p>
            <p className="text-xs text-gray-500">{txn.date}</p>
          </div>
          <p className="text-red-500 font-semibold">{txn.amount}</p>
        </div>
      ))}
    </div>

    {/* Footer Transaction Info */}
    <div className="mt-6 text-gray-600 text-xs flex justify-between w-full">
      <p>
        Transaction ID: <span className="font-medium">TXN12345678890</span>
      </p>
      <p>
        Date &amp; Time: <span className="font-medium">9/16/2025, 6:45:40</span>
      </p>
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
        Download
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
            alt="mini-statement"
            width={26}
            height={28}
            className="object-contain"
          />
          <Title level={5} className="mt-1 ml-1.5">
            Mini Statement
          </Title>
        </div>
        <Text type="secondary" className="ml-8">
          Fill in the customer information for Mini statement
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
        className={`!mt-6 h-12 !rounded-lg ${
          canProcess ? "!bg-[#3386FF] !text-white" : "!bg-[#5298FF54] !text-white"
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
