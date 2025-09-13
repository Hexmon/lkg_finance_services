"use client";

import React from "react";
import { Card, Typography, Form, Input, Button, Table } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";

const { Text } = Typography;

type FormValues = {
  amount: number;
};

export default function MoveToWalletPage() {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    console.log("Submitted:", values);
  };

  const transactionData = [
    {
      key: "1",
      txnId: "TXN123456789",
      date: "24 Aug 25, 14:30PM",
      amount: "₹190",
      category: "WALLET SWAP",
      status: "Success",
    },
  ];

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "txnId",
      key: "txnId",
      render: (txnId: string) => (
        <span className="text-[#232323] font-medium text-[14px] rounded-2xl">{txnId}</span>
      ),
    },
    
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <span className="text-[#9A9595] font-medium text-[14px] rounded-2xl">{date}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <span className="text-[#232323] font-medium text-[14px] rounded-2xl">{amount}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <span className="text-[#232323] font-medium text-[14px] rounded-2xl">{category}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className="text-[#0BA82F] font-medium bg-[#0BA82F36] text-[10px] rounded-2xl !h-[16px] !w-[56px]">{status}</span>
      ),
    },
  ];

  return (
    <DashboardLayout
      activePath="/wallet"
      sections={billPaymentSidebarConfig}
      pageTitle="Move to Wallet"
    >
      <div className="p-6 min-h-screen !mt-0">
        {/* Wallet transfer form */}
        <Card className="!rounded-2xl !shadow-md !mb-6">
            <Text className="!text-[15px] !font-medium">Transfer Funds From AEPS TO MAIN</Text>
          <div className="flex justify-between mb-4 mt-3">
            <Text className="!text-[#3386FF] font-medium">
              Your AEPS Balance: ₹ 5,000
            </Text>
            <Text className="!text-[#3386FF] font-medium">
              Your Main Balance: ₹ 20,000
            </Text>
          </div>

          <Form<FormValues>
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            className="!text-[13px]"
          >
            <Form.Item
              label={<span className="text-[16px] font-semibold leading-8">Enter Amount *</span>}
              name="amount"
              rules={[{ message: "Please enter amount" }]}
              
            >
              <Input size="large" placeholder="Enter Amount" />
            </Form.Item>

            <Text type="secondary" className="block mb-4 !text-[12px]">
              <span className="text-[12px] font-semibold leading-8 text-black mr-1">Please Note:</span>
              This Service will transfer AEPS Wallet Balance to
              Main Wallet Without Extra Costing/Charges. Once AEPS Balance
              Transferred Will not be Reversed
            </Text>

            <div className="flex gap-4 justify-center items-center">
              <Button size="large" className="!px-8 !h-[33px] !w-[199.56px]">
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="!bg-[#3386FF] !px-8 !h-[33px] !w-[199.56px]"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card>

        {/* Transaction History */}
        <Card className="!rounded-2xl !shadow-md">
          <Text className="!text-[15px] !font-medium mb-4 block">
            Transfer History
          </Text>
          <Table
            dataSource={transactionData}
            columns={columns}
            pagination={false}
            bordered={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
