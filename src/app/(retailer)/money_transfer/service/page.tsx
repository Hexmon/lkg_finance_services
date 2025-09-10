"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Input, Table, Modal, Form } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function MoneyTransferServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const router = useRouter();

  // Table columns
  const columns = [
    { title: "#", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Transaction ID", dataIndex: "transactionId", key: "transactionId" },
    { title: "Sender", dataIndex: "sender", key: "sender" },
    { title: "Beneficiary", dataIndex: "beneficiary", key: "beneficiary" },
    { title: "Bank", dataIndex: "bank", key: "bank" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="flex gap-2">
          <Button size="small" type="text">
            <div className="bg-[#5298FF54] p-2 rounded-full flex items-center justify-center w-8 h-8">
              <Image
                src="/eye-b.svg"
                alt="eye upload"
                width={15}
                height={15}
              />
            </div>

          </Button>
          <Button size="small" type="text">
            <div className="bg-[#5298FF54] p-2 rounded-full flex items-center justify-center w-8 h-8">
              <Image
                src="/upload-b.svg"
                alt="eye upload"
                width={15}
                height={15}
              />
            </div>
          </Button>
        </div>
      ),
    },
  ];

  // Table data
  const data = [
    {
      key: "1",
      id: "1",
      date: "08-04-2023 04:55:20 PM",
      transactionId: "T52340B615520333063",
      sender: "RAHUL 9660496729",
      beneficiary: "RAHUL 9660496729",
      bank: "AIRTEL PAYMENTS BANK LIMITED 9660496729",
      amount: "Amount: 360 | Charges: 35",
    },
  ];

  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="" pageTitle="Dashboards">
      <DashboardSectionHeader
        title="Money Transfer Service"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />
      <div className="p-6 !h-16 !w-full">
        {/* Content Card */}
        <CardLayout
          elevation={2}
          rounded="rounded-2xl"
          padding="p-6"
          bgColor="bg-white"
          width="w-full"
          className="!w-full"
          header={
            <Title level={5} className="!mb-6 !font-medium !text-[20px]">
              Transfer payment anytime anywhere and to any Indian banks.
            </Title>
          }
          body={
            <>
              {/* Sender Mobile Input */}
              <Input
                placeholder="Enter Sender Mobile Number"
                className="!w-full !h-[52px] !mb-4"
              />

              {/* Mode Selection */}
              <div className="mb-4">
                <select
                  className="w-full h-[52px] border border-gray-300 rounded-md px-3 text-gray-700 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Mode..
                  </option>
                  <option value="IMPS">IMPS – Instant Transfer (24*7)</option>
                  <option value="NEFT">NEFT – Working Hours Only</option>
                  <option value="RTGS">RTGS</option>
                </select>
              </div>

              {/* Bank Selection */}
              <div className="mb-6">
                <select
                  className="w-full h-[52px] border border-gray-300 rounded-md px-3 text-gray-700 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Bank ID
                  </option>
                  <option value="AIRTEL">AIRTEL</option>
                  <option value="FINO">FINO</option>
                </select>
              </div>


              {/* Continue Button */}
              <div className="flex justify-end mb-6">
                <Button
                  type="primary"
                  className="!bg[#3386FF] !h-[52px] !w-[155px] !rounded-[12px]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Continue
                </Button>
              </div>

              {/* Recent Transactions */}
              <Title level={5} className="!mb-4 !font-medium !text-[20px]">
                Recent Transactions
              </Title>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered={false}
                className="rounded-lg overflow-hidden mb-4"
              />
            </>
          }
          footer={
            <div className="flex justify-end">
              <Button
                type="primary"
                className="!bg[#3386FF] w-[111px] !round-[9px] !text-[10px]"
                onClick={() => setIsBeneficiaryModalOpen(true)}
              >
                + Add Beneficiary
              </Button>
            </div>
          }
        />
        s

        {/* Add Beneficiary Modal */}
        <Modal
          title="Add Beneficiary"
          open={isBeneficiaryModalOpen}
          footer={null}
          onCancel={() => setIsBeneficiaryModalOpen(false)}
          className="custom-modal"
        >
          <Form layout="vertical" className="w-[527px]">
            {/* Beneficiary Account No */}
            <Form.Item
              label="Beneficiary Account No *"
              name="beneficiaryAccountNo"
              rules={[{ message: "Please enter Beneficiary Account Number" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Beneficiary Account Number" />
            </Form.Item>

            {/* Confirm Account No */}
            <Form.Item
              label="Confirm Account No *"
              name="confirmAccountNo"
              rules={[{ message: "Please confirm Account Number" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Confirm Account Number" />
            </Form.Item>

            {/* Bank Name */}
            <Form.Item
              label="Bank Name *"
              name="bankName"
              rules={[{ message: "Please enter Bank Name" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Bank Name" />
            </Form.Item>

            {/* IFSC Code */}
            <Form.Item
              label="IFSC Code *"
              name="ifscCode"
              rules={[{ message: "Please enter IFSC Code" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter IFSC Code" />
            </Form.Item>

            {/* Mobile No */}
            <Form.Item
              label="Mobile No *"
              name="mobileNo"
              rules={[{ message: "Please enter Mobile Number" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Mobile Number" />
            </Form.Item>

            {/* Address */}
            <Form.Item
              label="Address *"
              name="address"
              rules={[{ message: "Please enter Address" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Address" />
            </Form.Item>

            {/* Beneficiary Name */}
            <Form.Item
              label="Beneficiary Name *"
              name="beneficiaryName"
              rules={[{ message: "Please enter Beneficiary Name" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Beneficiary Name" />
            </Form.Item>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="primary"
                block
                className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal>



        {/* Add Sender Modal */}
        <Modal
          title="Add Sender"
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          className="custom-modal"
        >
          <Form layout="vertical" className="w-[527px]">
            <Form.Item
              label="Sender Name"
              name="sendername"
              rules={[{ message: "Please enter Sender Name" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Sender Name" />
            </Form.Item>

            <Form.Item
              label="Mobile No"
              name="confirmMoblieNo"
              rules={[{ message: "Please confirm Mobile No" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Sender Mobile No" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ message: "Please enter Address" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Sender address" />
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[{ message: "Please enter pincode" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Sender Pincode" />
            </Form.Item>

            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ message: "Please enter otp" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter OTP" />
            </Form.Item>

            <div className="flex justify-center">
              <Button
                type="primary"
                block
                className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
                htmlType="submit"
                onClick={() => router.push("/money_transfer/service/sender_onboarding") }
              >
                Next
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
