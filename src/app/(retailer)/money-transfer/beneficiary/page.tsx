"use client";

import React, { useState } from "react";
import { Card, Typography, Button, Input, Table, Modal, Form } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";

const { Title, Text } = Typography;

export default function MoneyTransferServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);

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
          <Button size="small" type="text">👁</Button>
          <Button size="small" type="text">⬇</Button>
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
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
      <DashboardSectionHeader
        title="Money Transfer Service"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />
      <div className="p-6 min-h-screen w-full">
        {/* Content Card */}
        <div className="flex">
          <Card className="rounded-2xl shadow-md w-full max-w-5xl">
            {/* Heading */}
            <Title level={5} className="mb-2">
              Transfer payment anytime anywhere and to any Indian banks.
            </Title>

            {/* Input + Continue */}
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Enter Sender Mobile Number" className="w-full" />
              <Button type="primary" className="!bg-blue-600"
                onClick={() => setIsModalOpen(true)}
              >
                Continue
              </Button>
            </div>
            <Text type="secondary" className="block mb-6">
              Please enter sender's mobile number to start Money Transfer.
            </Text>

            {/* Recent Transactions */}
            <Title level={5} className="mb-4">
              Recent Transactions
            </Title>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered={false}
              className="rounded-lg overflow-hidden mb-4"
            />

            {/* Add Beneficiary Button */}
            <div className="flex justify-end">
              <Button
                type="primary"
                className="!bg-blue-600"
                onClick={() => setIsBeneficiaryModalOpen(true)}
              >
                + Add Beneficiary
              </Button>
            </div>
          </Card>
        </div>

        {/* Add Beneficiary Modal */}
        <Modal
          title="Add Beneficiary"
          open={isBeneficiaryModalOpen}
          footer={null}
          onCancel={() => setIsBeneficiaryModalOpen(false)}
          className="custom-modal"
        >
          <Form layout="vertical">
            <Form.Item
              label="Beneficiary Account No *"
              name="accountNo"
              rules={[{ required: true, message: "Please enter Account No" }]}
            >
              <Input placeholder="Enter Beneficiary Account Number" />
            </Form.Item>

            <Form.Item
              label="Confirm Account No *"
              name="confirmAccountNo"
              rules={[{ required: true, message: "Please confirm Account No" }]}
            >
              <Input placeholder="Confirm Account Number" />
            </Form.Item>

            <Form.Item
              label="Bank Name *"
              name="bankName"
              rules={[{ required: true, message: "Please enter Bank Name" }]}
            >
              <Input placeholder="Enter Bank Name" />
            </Form.Item>

            <Form.Item
              label="IFSC Code *"
              name="ifsc"
              rules={[{ required: true, message: "Please enter IFSC Code" }]}
            >
              <Input placeholder="Enter IFSC Code" />
            </Form.Item>

            <Form.Item
              label="Mobile No *"
              name="mobile"
              rules={[{ required: true, message: "Please enter Mobile No" }]}
            >
              <Input placeholder="Enter Mobile Number" />
            </Form.Item>

            <Form.Item
              label="Address *"
              name="address"
              rules={[{ required: true, message: "Please enter Address" }]}
            >
              <Input placeholder="Enter Address" />
            </Form.Item>

            <Form.Item
              label="Beneficiary Name *"
              name="beneficiaryName"
              rules={[{ required: true, message: "Please enter Beneficiary Name" }]}
            >
              <Input placeholder="Enter Beneficiary Name" />
            </Form.Item>

            <Button
              type="primary"
              block
              className="!bg-blue-600 mt-2"
              htmlType="submit"
            >
              Submit
            </Button>
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
          <Form layout="vertical">
            <Form.Item label="Sender Name">
              <Input placeholder="Sender Name" />
            </Form.Item>
            <Form.Item label="Mobile No.">
              <Input placeholder="Enter Sender Mobile No." />
            </Form.Item>
            <Form.Item label="Address">
              <Input placeholder="Enter Sender address" />
            </Form.Item>
            <Form.Item label="Pincode">
              <Input placeholder="Enter Sender Pincode" />
            </Form.Item>
            <Form.Item label="OTP">
              <Input placeholder="Enter OTP" />
            </Form.Item>

            <Button type="primary" block className="!bg-blue-600">
              Next
            </Button>
          </Form>
        </Modal>
      </div>
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
