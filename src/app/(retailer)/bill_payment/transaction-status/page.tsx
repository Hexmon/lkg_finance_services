"use client";

import React, { useState } from "react";
import { Button, DatePicker, Input, Modal, Select, Typography } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";


const { Title, Text } = Typography;
const { Option } = Select;

export default function TransactionStatusPage() {
  const router = useRouter();
  const [trackType, setTrackType] = useState("Mobile No.");
  const [mobile, setMobile] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout
      activePath="/transaction_status"
      sections={billPaymentSidebarConfig}
      pageTitle="Transaction Status"
    >
      <div className="min-h-screen w-full mb-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title="Transaction Status"
            titleClassName="!font-medium text-[20px] !mt-0"
            subtitle="You can verify the status of your Online transaction by entering your mobile number or transaction Ref ID."
            subtitleClassName="!mb-4 !text-[14px]"
            showBack
          />
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-full mt-4">
          {/* Warning Banner */}
          <div className="bg-[#FFECB3] text-[#FF9809] p-3 rounded-md text-sm text-center mb-6">
            Check your transaction status of your Online Transactions by entering your mobile number or transaction Ref ID.
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Track Type */}
            <div>
              <Text className="block text-gray-600 mb-2 text-[12px] font-semibold">Track Type</Text>
              <Select
                value={trackType}
                onChange={(val) => setTrackType(val)}
                className="w-full md:w-[300px] text-[12px] font-semibold"
              >
                <Option value="Mobile No.">Mobile No.</Option>
                <Option value="Transaction Ref Id.">Transaction Ref Id.</Option>
              </Select>
            </div>



            {/* Dates */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mt-20">
              {/* Mobile Input */}
              {trackType === "Mobile No." && (
                <div>
                  <Text className="block text-gray-600 mb-2 text-[12px] font-semibold">Enter Mobile No.</Text>
                  <Input
                    placeholder="Enter Mobile No."
                    value={mobile}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
                    className="md:w-[300px]"
                  />
                </div>
              )}
              <div>
                <Text className="block text-gray-600 mb-2 text-[12px] font-semibold">Select From Date</Text>
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  className="w-full"
                  value={fromDate}
                  onChange={(date) => setFromDate(date)}
                />
              </div>
              <div>
                <Text className="block text-gray-600 mb-2 text-[12px] font-semibold">Select To Date</Text>
                <DatePicker
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                  className="w-full"
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                className="!bg-[#3386FF] !text-white !rounded-xl !shadow-md !px-12 !h-[33px]"
                onClick={() => setIsModalOpen(true)}
              >
                Fetch Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Transaction Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={800}
        className="!rounded-2xl !p-0"
      >
        <div className="p-6 min-h-screen">
          {/* Full-width Success Card */}
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-6 w-full">
            {/* Top-right Logo */}
            <div className="flex justify-end mb-4">
              <Image
                src="/logo-as.svg"
                alt="logo"
                width={80}
                height={80}
                className="p-1"
              />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center rounded-full">
                <Image
                  src="/verified-b.svg"
                  alt="payment successed"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[#0BA82F] mb-2 text-center">
              Payment Completed!
            </h2>
            <p className="text-[#0BA82F] mb-6 text-center text-[15px] font-medium">
              Your broadband bill payment has been processed successfully.
            </p>

            {/* Details Card */}
            <div className="bg-[#F1F9EF] rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 text-sm text-[#333]">
                <div>
                  <p className="text-gray-500">Name Of Biller</p>
                  <p className="font-medium">Mobile Prepaid_Dummy</p>
                </div>
                <div>
                  <p className="text-gray-500">B-Connect TXD</p>
                  <p className="font-semibold">CC015223BAAG000010158</p>
                </div>
                <div>
                  <p className="text-gray-500">Bill Amount</p>
                  <p className="font-medium">₹799</p>
                </div>
                <div>
                  <p className="text-gray-500">Mobile Number</p>
                  <p className="font-medium">XXXXXXXXXX</p>
                </div>
                <div>
                  <p className="text-gray-500">Registered Mobile Number</p>
                  <p className="font-medium">XXXXXXXXXX</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium">₹799</p>
                </div>
                <div>
                  <p className="text-gray-500">Bill Number</p>
                  <p className="font-medium">XXXXXXXXXX</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Mode</p>
                  <p className="font-semibold">Cash</p>
                </div>
                <div>
                  <p className="text-gray-500">Transaction Date & Time</p>
                  <p className="font-medium">29/06/2017 23:17:03</p>
                </div>
                <div>
                  <p className="text-gray-500">Bill Date (dd/mm/yyyy)</p>
                  <p className="font-medium">29/06/2017</p>
                </div>
                <div>
                  <p className="text-gray-500">Customer Convenience Fee</p>
                  <p className="font-medium">0.00</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-semibold text-green-600">PAID</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date (dd/mm/yyyy)</p>
                  <p className="font-medium">29/06/2017</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center mt-8 mb-5">
              <button
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium w-full cursor-pointer"
                onClick={() =>
                  router.push("/bill_payment/bbps-online/bbps-postpaid-receipt")
                }
              >
                Download Receipt
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 w-full">
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
