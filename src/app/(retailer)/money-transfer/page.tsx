"use client";

import React from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { Card, Typography, Button } from "antd";
import BankOutlined from "@ant-design/icons/lib/icons/BankOutlined";
import SwapOutlined from "@ant-design/icons/lib/icons/SwapOutlined";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import WalletOutlined from "@ant-design/icons/lib/icons/WalletOutlined";
const { Title, Text } = Typography;

export default function BillPaymentServicePage() {
  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
      <DashboardSectionHeader
        title="Money Transfer Service"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />
      
      <div className="p-6 bg-[#f9f6ef] min-h-screen w-full">
        {/* Header Section */}
        <div className="bg-[#fefaf1] border border-blue-400 rounded-xl shadow-md p-5 mb-6 flex justify-between items-center">
          {/* Left Section */}
          <div>
            <Title level={4} className="!mb-1">
              Welcome Back <span className="text-blue-600">Rajesh!</span>
            </Title>
            <Text type="secondary" className="block mb-3">
              Your business dashboard is ready. Let’s make today productive!
            </Text>

            {/* Status Tags */}
            <div className="flex gap-2">
              <span className="bg-white shadow px-3 py-1 rounded-md text-blue-600 text-sm">
                • All system Online
              </span>
              <span className="bg-white shadow px-3 py-1 rounded-md text-gray-700 text-sm">
                Premium Member
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex gap-4">
            {/* Virtual Account Card */}
            <div className="bg-white rounded-lg shadow-md px-5 py-3">
              <Text strong className="text-gray-600 block mb-2">Virtual Account</Text>
              <div className="text-sm text-gray-500">
                IFSC: <span className="font-semibold">SBIN004NUE9</span>
              </div>
              <div className="text-sm text-gray-500">
                Account no.: <span className="font-semibold">587553226995</span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-lg shadow-md px-6 py-4 flex flex-col items-center justify-center">
              <Text strong className="text-blue-600 text-xl">₹ 25,000</Text>
              <Text className="text-gray-500 text-sm mb-2">Total Balance</Text>
              <Button type="primary" className="!bg-blue-600">
                + Add Money
              </Button>
            </div>
          </div>
        </div>



        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-2xl shadow-sm">
            <Text strong>Total Transactions</Text>
            <Title level={3}>2,000</Title>
            <Text type="success">▲ 3.2% Since last month</Text>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <Text strong>Success Rate</Text>
            <Title level={3}>95.3%</Title>
            <Text type="success">▲ 2.1% Since last month</Text>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <Text strong>Customers</Text>
            <Title level={3}>1,500</Title>
            <Text type="success">▲ 3.2% Since last month</Text>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <Text strong>Commissions</Text>
            <Title level={3}>₹1467</Title>
            <Text type="success">▲ 3.2% Since last month</Text>
          </Card>
        </div>

        {/* Quick Services */}
        <Card className="rounded-2xl shadow-sm mb-6">
          <Text strong className="block mb-3">Quick Services</Text>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4 cursor-pointer hover:shadow-md">
              <SwapOutlined className="text-2xl mb-2 text-blue-500" />
              <Text>Money Transfer</Text>
            </Card>
            <Card className="text-center p-4 cursor-pointer hover:shadow-md">
              <BankOutlined className="text-2xl mb-2 text-blue-500" />
              <Text>Cash Withdrawal</Text>
            </Card>
            <Card className="text-center p-4 cursor-pointer hover:shadow-md">
              <FileTextOutlined className="text-2xl mb-2 text-blue-500" />
              <Text>Bill Payment</Text>
            </Card>
            <Card className="text-center p-4 cursor-pointer hover:shadow-md">
              <WalletOutlined className="text-2xl mb-2 text-blue-500" />
              <Text>Cashfree Payout</Text>
            </Card>
          </div>
        </Card>

        {/* Wallet Overview & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-sm">
            <Text strong className="block mb-3">Wallet Overview</Text>
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-[#faf5e9] rounded-xl text-center p-4">
                <Text type="secondary">Main Wallet</Text>
                <Title level={4}>₹25,000</Title>
              </Card>
              <Card className="bg-[#faf5e9] rounded-xl text-center p-4">
                <Text type="secondary">APES Wallet</Text>
                <Title level={4}>₹8,500</Title>
              </Card>
              <Card className="bg-[#faf5e9] rounded-xl text-center p-4">
                <Text type="secondary">Commission</Text>
                <Title level={4}>₹3,200</Title>
              </Card>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <Text strong className="block mb-3">Recent Activity</Text>
            <div className="flex flex-col gap-3">
              {[5000, 6000, 4500].map((amt, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-[#faf5e9] rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <WalletOutlined className="text-xl text-blue-500" />
                    <div>
                      <Text strong>DMT</Text>
                      <div className="text-xs text-gray-500">Nehaul Sharma</div>
                    </div>
                  </div>
                  <Text strong className="text-green-600">₹{amt}</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}

