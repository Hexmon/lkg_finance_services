"use client";

import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

export default function AEPSTransactionForm() {
  const [fingerCaptured, setFingerCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanToggle = () => {
    setFingerCaptured((prev) => !prev);
  };

  const handleProcess = (values: any) => {
    console.log("Form submitted:", values);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleProcess}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      {/* Header */}
      <div className="mb-11 ml-3">
        <div className="flex items-center">
          <Image
            src="/aeps.svg"
            alt="aeps"
            width={26}
            height={28}
            className="object-contain"
          />
          <Title level={5} className="mt-1 ml-1.5">
            AEPS Transaction Details
          </Title>
        </div>
        <Text type="secondary" className="ml-8">
          Fill in the customer and transaction information
        </Text>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-4 ml-8">
        <Form.Item
          name="customerName"
          label={<span className="text-sm font-medium">Customer Name *</span>}
          rules={[{ required: true, message: "Please enter customer name" }]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input placeholder="Enter Customer Name" className="rounded-lg h-11 mt-1" />
        </Form.Item>

        <Form.Item
          name="bank"
          label={<span className="text-sm font-medium">Select Bank *</span>}
          rules={[{ required: true, message: "Please select a bank" }]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input placeholder="Search Bank" className="rounded-lg h-11 mt-1" />
          <Text type="secondary" className="text-xs mt-1">
            Start typing to search bank by name, IIN or IFSC
          </Text>
        </Form.Item>

        <Form.Item
          name="aadhaar"
          label={<span className="text-sm font-medium">Aadhaar number *</span>}
          rules={[
            { required: true, message: "Enter Aadhaar number" },
            { len: 12, message: "Aadhaar must be 12 digits" },
          ]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input.Password
            placeholder="Enter 12-digit Aadhaar number"
            className="rounded-lg h-11 mt-1"
            maxLength={12}
          />
          <Text type="secondary" className="text-xs mt-1">
            Digits only, 12 characters
          </Text>
        </Form.Item>

        <Form.Item
          name="mobile"
          label={<span className="text-sm font-medium">Mobile Number *</span>}
          rules={[
            { required: true, message: "Enter mobile number" },
            { len: 10, message: "Mobile must be 10 digits" },
          ]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input
            placeholder="+91 **********"
            className="rounded-lg h-11 mt-1"
            maxLength={10}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label={<span className="text-sm font-medium">Enter Amount *</span>}
          rules={[{ required: true, message: "Please enter amount" }]}
          className="md:col-span-2 flex flex-col w-full max-w-[444px]"
        >
          <Input.Password
            placeholder="Enter amount"
            className="rounded-lg h-11 mt-1"
          />
        </Form.Item>
      </div>

      {/* Fingerprint Capture */}
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
          <Image src="/biometric.svg" alt="fingerprint" width={90} height={90} />
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
      <Form.Item className="mt-6">
        <Button
          block
          htmlType="submit"
          className={`h-12 !rounded-lg mt-4 ${
            !fingerCaptured || isLoading
              ? "!bg-[#5298FF54] !text-white"
              : "!bg-[#3386FF] !text-white"
          }`}
          disabled={!fingerCaptured || isLoading}
        >
          <Image
            src="/aeps-white.svg"
            alt="aeps"
            width={15}
            height={15}
            className="object-contain mr-2"
          />
          {isLoading ? "Processing..." : "Process AEPS Transaction"}
        </Button>
      </Form.Item>
    </Form>
  );
}
