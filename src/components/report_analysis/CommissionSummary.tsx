"use client";

import { Card, Table, Button, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Text } = Typography;

export default function CommissionSummary() {
  const commissionData = [
    {
      key: 1,
      service: "Electricity",
      transactions: "₹150",
      volume: "₹5,2000",
      commission: "₹2.5",
      rate: "0.5%",
    },
    {
      key: 2,
      service: "DTH",
      transactions: "₹89",
      volume: "₹7,2000",
      commission: "₹2.5",
      rate: "0.5%",
    },
    {
      key: 3,
      service: "Mobile Recharge",
      transactions: "₹799",
      volume: "₹7,8000",
      commission: "₹2.5",
      rate: "0.5%",
    },
    {
      key: 4,
      service: "Gas",
      transactions: "₹1,100",
      volume: "₹9,2000",
      commission: "₹2.5",
      rate: "0.5%",
    },
  ];

  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      render: (text: string) => (
        <Text className="!text-[14px] !font-medium">{text}</Text>
      ),
    },
    {
      title: "Transactions",
      dataIndex: "transactions",
      render: (text: string) => (
        <Text className="!text-[14px] !font-medium">{text}</Text>
      ),
    },
    {
      title: "Volume",
      dataIndex: "volume",
      render: (text: string) => (
        <Text className="!text-[14px] !font-medium">{text}</Text>
      ),
    },
    {
      title: "Commission",
      dataIndex: "commission",
      render: (text: string) => (
        <Text className="!text-[#0BA82F] !font-medium">{text}</Text>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text: string) => (
        <span className="!px-2 !py-[1px] !bg-[#E6F0FF] !text-[#3386FF] !rounded-md !text-[12px] !font-medium">
          {text}
        </span>
      ),
    },
  ];

  const chartData = [
    { name: "Elect.", value: 120 },
    { name: "Mobile", value: 200 },
    { name: "DTH", value: 150 },
    { name: "Gas", value: 100 },
    { name: "Education", value: 180 },
    { name: "Bills", value: 140 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 mb-6">
      {/* Commission Summary Table */}
      <div className="lg:col-span-2">
        <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
          <div className="flex justify-between items-center p-4 mb-3">
            <Text className="!text-[20px] !font-medium">Commission Summary</Text>
            <Button className="bg-white shadow px-4 rounded-lg flex items-center">
              <DownloadOutlined />
              <span className="!ml-2 !rounded-xl !shadow-2xl !font-medium">Export</span>
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={commissionData}
            pagination={false}
            bordered={false}
          />
        </Card>
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-6">
        {/* Commission Distribution */}
        <Card className="rounded-2xl shadow-md p-4">
          <Text className="!text-[16px] !font-medium">
            Commission Distribution
          </Text>
        </Card>

        {/* Monthly Summary */}
        <Card className="rounded-2xl shadow-md p-4">
          <Text className="!text-[16px] !font-medium">Monthly Summary</Text>
          <div className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between">
              <Text className="!text-[12px] !font-medium">Opening Balance</Text>
              <Text className="!text-[12px] !font-medium">₹15,000</Text>
            </div>
            <div className="flex justify-between">
              <Text className="!text-[12px] !font-medium">Credits</Text>
              <Text className="!text-[#0BA82F] !text-[12px] !font-medium">+₹10,045</Text>
            </div>
            <div className="flex justify-between">
              <Text className="!text-[12px] !font-medium">Debits</Text>
              <Text className="!text-[#FF4D4F] !text-[12px] !font-medium">-₹2,819</Text>
            </div>
            <div className="flex justify-between font-medium">
              <Text className="!text-[12px] !font-medium">Closing Balance</Text>
              <Text className="!text-[12px] !font-medium">₹26,000</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
