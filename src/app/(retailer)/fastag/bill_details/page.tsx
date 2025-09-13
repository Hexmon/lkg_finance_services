"use client";

import React, { useState } from "react";
import { Button, Modal, Radio, Select, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Option } = Select;

export default function BillDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("Wallet");
  const router = useRouter();

  return (
    <DashboardLayout
      activePath="/bill_details"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
    >
      <div className="min-h-screen w-full mb-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title="FASTag"
            subtitle="Recharge"
            titleClassName="!font-medium text-[20px] !mt-0"
            subtitleClassName="!mb-4 !text-[14px]"
            showBack
          />
          <Image
            src="/logo-as.svg"
            alt="logo"
            width={100}
            height={40}
            className="p-1"
          />
        </div>

        {/* Bill Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full mt-4">
          {/* Bill Header */}
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="!mb-0">
              Bill Details
            </Title>
            <span className="bg-[#FFEFC3] text-[#D97A00] px-4 py-1 rounded-lg text-sm font-medium">
              Pending Payment
            </span>
          </div>

          {/* Bill Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-10 text-sm font-medium text-[#333]">
              <div>
                <div className="text-gray-500">Customer Name</div>
                <div>John Doe</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Amount</div>
                <div className="text-[#3386FF] font-semibold">₹799</div>
              </div>
              <div>
                <div className="text-gray-500">Plane Details</div>
                <div>Fiber Ultra 200 MBPS</div>
              </div>
              <div>
                <div className="text-gray-500">Due Date</div>
                <div>2024-01-25</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Number</div>
                <div>BBLRR17B2AU</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Date</div>
                <div>2024-01-25</div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-[#FFEFC3] text-[#D97A00] p-3 rounded-md text-sm flex items-center gap-2 mt-6">
              <ExclamationCircleOutlined />
              Please verify all details before making the payment. This
              transaction cannot be reversed.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              <Button block className="!h-[39px] !rounded-xl !shadow-md">
                Back to Edit
              </Button>
              <Button
                block
                className="!h-[39px] !bg-[#5298FF54] !text-[#3386FF] !rounded-xl !shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                Pay ₹799
              </Button>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <Button
                block
                className="!h-[39px] !bg-[#5298FF54] !text-[#3386FF] !rounded-xl !shadow-md !mt-6 !w-[445px]"
              >
                Add to Biller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
        centered
        width={340}
        className="!rounded-2xl !p-0"
      >
        <div className="text-center py-6 px-4">
          <h3 className="text-[#3386FF] text-sm font-medium mb-1">
            Payable Amount
          </h3>
          <div className="text-[#3386FF] text-2xl font-bold mb-4">₹799</div>

          {/* Payment Mode */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-700">
            <Radio.Group
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <Radio value="Wallet">Wallet</Radio>
              <Radio value="Cashfree">
                <Image
                  src="/cashfree.svg"
                  alt="Cashfree"
                  width={70}
                  height={20}
                  className="inline-block"
                />
              </Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            block
            className="!bg-[#0BA82F] !text-white !rounded-lg !h-[38px]"
            // onClick={() => {
            //   setIsModalOpen(false);
            //   router.push(
            //     "/bill_payment/bbps-online/bbps-successful"
            //   );
            // }}
          >
            Proceed to Pay
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
