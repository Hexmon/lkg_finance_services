"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Input } from "antd";
import {
  LeftOutlined,
  DeleteOutlined,
  WifiOutlined,
  ThunderboltOutlined,
  BankOutlined,
  HeartOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  CarOutlined,
  GiftOutlined,
  HomeOutlined,
  WalletOutlined,
  ContainerOutlined,
  AppstoreOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  ShopOutlined,
  FireOutlined,
  CloudOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";

const { Title, Text } = Typography;

export default function ChooseServicePage() {
  const [billers, setBillers] = useState([
    {
      id: "21081904512",
      name: "Jaipur Vidyut Vitran Nigam (JVVNL)",
      icon: <ThunderboltOutlined className="text-yellow-500" />,
      amount: 2450,
    },
    {
      id: "DTV987654321",
      name: "Airtel Digital TV",
      icon: <AppstoreOutlined className="text-purple-500" />,
      amount: 399,
    },
  ]);

  const totalAmount = billers.reduce((sum, b) => sum + b.amount, 0);

  const services = [
    { name: "Broadband Postpaid", icon: <WifiOutlined /> },
    { name: "Broadband Prepaid", icon: <WifiOutlined /> },
    { name: "Cable", icon: <AppstoreOutlined /> },
    { name: "Challan Payment", icon: <BankOutlined /> },
    { name: "Credit Card Payment", icon: <CreditCardOutlined /> },
    { name: "Data Card Prepaid", icon: <IdcardOutlined /> },
    { name: "Digital Voucher", icon: <GiftOutlined /> },
    { name: "Donation", icon: <HeartOutlined /> },
    { name: "DTH", icon: <AppstoreOutlined /> },
    { name: "Electricity", icon: <ThunderboltOutlined /> },
    { name: "EMI Payment", icon: <WalletOutlined /> },
    { name: "FASTAG", icon: <CarOutlined /> },
    { name: "Health Insurance", icon: <MedicineBoxOutlined /> },
    { name: "Hospital", icon: <HeartOutlined /> },
    { name: "Hospital & Pathology", icon: <ExperimentOutlined /> },
    { name: "Insurance", icon: <IdcardOutlined /> },
    { name: "Landline", icon: <PhoneOutlined /> },
    { name: "Life Insurance", icon: <HeartOutlined /> },
    { name: "Loan Payment", icon: <BankOutlined /> },
    { name: "LPG Booking", icon: <FireOutlined /> },
    { name: "Municipal Services", icon: <HomeOutlined /> },
    { name: "Municipal Taxes", icon: <ContainerOutlined /> },
    { name: "NCMC", icon: <CreditCardOutlined /> },
    { name: "NPC", icon: <AppstoreAddOutlined /> },
    { name: "Piped Gas", icon: <FireOutlined /> },
    { name: "Postpaid", icon: <PhoneOutlined /> },
    { name: "Prepaid", icon: <PhoneOutlined /> },
    { name: "Prepaid Data Card", icon: <IdcardOutlined /> },
    { name: "Prepaid Meter", icon: <ThunderboltOutlined /> },
    { name: "Recurring Deposit", icon: <BankOutlined /> },
    { name: "Rental", icon: <HomeOutlined /> },
    { name: "Subscription", icon: <AppstoreOutlined /> },
    { name: "Water", icon: <CloudOutlined /> },
  ];

  const removeBiller = (id: string) => {
    setBillers(billers.filter((b) => b.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#f9f6ef] min-h-screen w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
            onClick={() => window.history.back()}
          >
            <LeftOutlined />
            <div>
              <Title level={3} className="!mb-0">Choose Service</Title>
              <Text type="secondary">Online Bill Payment</Text>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="!rounded-xl !px-4 !py-2 shadow-sm">
              View Transaction History
            </Button>
            <Image src="/logo.svg" alt="logo" width={120} height={120} />
          </div>
        </div>

        {/* Search Bar */}
        <Input
          placeholder="Search for bill payment services..."
          className="rounded-xl shadow-sm mb-6"
        />

        {/* Available Services */}
        <Card className="rounded-2xl shadow-md w-full mb-6">
          <Text strong className="block mb-3">Available Services</Text>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <Card
                key={index}
                className="cursor-pointer rounded-xl text-center py-6 bg-[#faf5e9] hover:border-blue-400 hover:shadow-md transition"
              >
                <div className="text-2xl mb-2">{service.icon}</div>
                <Text className="text-sm">{service.name}</Text>
              </Card>
            ))}
          </div>
        </Card>

        {/* Manage Billers */}
        <Card className="rounded-2xl shadow-md w-full mb-6">
          <Text strong className="block mb-3">Manage Billers</Text>
          <div className="flex flex-col gap-4">
            {billers.map((biller) => (
              <div
                key={biller.id}
                className="flex justify-between items-center bg-[#faf5e9] rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{biller.icon}</div>
                  <div>
                    <Text strong>{biller.name}</Text>
                    <div className="text-xs text-gray-500">{biller.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Text strong>₹{biller.amount}</Text>
                  <DeleteOutlined
                    onClick={() => removeBiller(biller.id)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center mt-4 px-2">
            <Text strong>Total Amount</Text>
            <Text strong>₹{totalAmount}.00</Text>
          </div>
        </Card>

        {/* Proceed Button */}
        <Button
          type="primary"
          block
          className="!bg-blue-600 !border-blue-600 !text-white rounded-xl py-5 text-lg shadow-md"
          disabled={billers.length === 0}
        >
          Proceed to Pay
        </Button>
      </div>
    </DashboardLayout>
  );
}
