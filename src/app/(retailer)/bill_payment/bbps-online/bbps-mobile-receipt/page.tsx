// app/(retailer)/bill_payment/receipt/page.tsx

"use client";

import React from "react";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

export default function PaymentReceiptPage() {
  return (
     <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      {/* <DashboardSectionHeader
        title="Money Receipt"
        titleClassName="!font-medium text-[20px] !mt-0"
        showBack
      /> */}
    <div className="min-h-screen bg-[#FCF8F3] py-12 px-4 flex justify-center items-start rounded-2xl">
      <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md relative">
        {/* Logo */}
        <div className="absolute top-6 right-6">
          <Image src="/logo-as.svg" alt="BBPS Logo" width={60} height={60} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-10">Payment Receipt</h2>

        {/* Company Info + Meta */}
        <div className="flex justify-between text-sm mb-6">
          <div className="space-y-1">
            <p className="font-semibold">LKG Info Solutions Private Limited</p>
            <p>Rajasthan, 335001</p>
            <p>India</p>
            <p>Phone: 1234567890</p>
            <p>Email: info@lkginfoplin</p>
          </div>
          <div className="space-y-1 text-right">
            <p>Date: 05-Sep-2025</p>
            <p>Receipt: #0114</p>
            <p>Payment Mode: Cash</p>
          </div>
        </div>

        {/* Subscriber Details */}
        <div className="text-sm mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Subscriber/Received From:</p>
            <p className="font-medium">Srinivas</p>
          </div>
          <div>
            <p className="text-gray-500">Consumer Number:</p>
            <p className="font-medium">9892506507</p>
          </div>
          <div>
            <p className="text-gray-500">Bill Number:</p>
            <p className="font-medium">RCRQ/2020-07-17/6418619</p>
          </div>
          <div>
            <p className="text-gray-500">Bill Period:</p>
            <p className="font-medium">Monthly</p>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-300 text-sm mb-6">
          <div className="grid grid-cols-4 font-medium bg-gray-100 border-b border-gray-300 p-2">
            <span>Service</span>
            <span>Amount (INR)</span>
            <span>GST @18% (INR)</span>
            <span>Total (INR)</span>
          </div>
          <div className="grid grid-cols-4 p-2">
            <span>Broadband Postpaid</span>
            <span>70,692</span>
            <span>0</span>
            <span>70,692</span>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500">Transaction ID (BBPS):</p>
            <p className="font-medium">CC015223BAAG000010158</p>
          </div>
          <div>
            <p className="text-gray-500">Status:</p>
            <p className="font-medium text-green-600">Success</p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs italic text-gray-500 text-center mt-4">
          This is a system generated receipt from BBPS. No signature required.
        </p>
      </div>
    </div>

  </DashboardLayout>
  );
}
