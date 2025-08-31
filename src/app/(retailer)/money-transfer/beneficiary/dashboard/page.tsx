"use client";

import React from "react";
import { Card, Typography, Button, Table, Tag } from "antd";
import {
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";

const { Title, Text } = Typography;

export default function MoneyTransferPage() {
  const columns = [
    {
      title: "Beneficiaries",
      dataIndex: "name",
      key: "name",
      render: (text:string) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-600 text-lg" />
          <div>
            <Text strong>{text}</Text>
            <div className="text-xs text-gray-500">TXN123456789</div>
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "Success"
              ? "green"
              : status === "Processing"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Actions",
      key: "action",
      render: () => (
        <Button type="text" icon={<EyeOutlined />} />
      ),
    },
  ];

  const data = [
    { key: 1, name: "Rajesh Kumar", amount: "₹5,000", mode: "IMPS", status: "Success", time: "2 min ago" },
    { key: 2, name: "Rajesh Kumar", amount: "₹5,000", mode: "IMPS", status: "Processing", time: "2 min ago" },
    { key: 3, name: "Rajesh Kumar", amount: "₹5,000", mode: "IMPS", status: "Success", time: "2 min ago" },
    { key: 4, name: "Rajesh Kumar", amount: "₹5,000", mode: "IMPS", status: "Success", time: "2 min ago" },
  ];

  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/" pageTitle="Dashboards">
      <DashboardSectionHeader
        title="Money Transfer Service"
        subtitle="Send Money Instantly Across India"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />
      <div className="p-6 min-h-screen w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-xl shadow-md text-center">
            <Title level={4}>₹2,45,000</Title>
            <Text type="secondary">Today's Transfer</Text>
          </Card>
          <Card className="rounded-xl shadow-md text-center">
            <Title level={4}>99.5%</Title>
            <Text type="secondary">Success Rate</Text>
          </Card>
          <Card className="rounded-xl shadow-md text-center">
            <Title level={4}>156</Title>
            <Text type="secondary">Total Beneficiaries</Text>
          </Card>
          <Card className="rounded-xl shadow-md text-center">
            <Title level={4}>₹1,240</Title>
            <Text type="secondary">Commission Earned</Text>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <Button className="rounded-md px-6 py-2 shadow-sm">New Transfer</Button>
          <Button className="rounded-md px-6 py-2 shadow-sm">Beneficiaries</Button>
          <Button className="rounded-md px-6 py-2 shadow-sm bg-blue-600 text-white">
            Transactions
          </Button>
        </div>

        {/* Transaction History */}
        <Card className="rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={4} className="!mb-0">Transaction History</Title>
              <Text type="secondary">Recent money transfer transactions</Text>
            </div>
            <div className="flex gap-2">
              <Button>Filter</Button>
              <Button>Export</Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered={false}
          />
        </Card>
      </div>
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
