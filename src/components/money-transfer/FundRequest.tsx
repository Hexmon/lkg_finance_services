"use client";

import { Card, Table, Typography } from "antd";
import Image from "next/image";

const { Text, Title } = Typography;

export default function TransactionsTableFundReq() {
  const data = [
    {
      key: "1",
      datetime: "24 Aug 25, 14:30PM",
      description: "Fund Added by UPI",
      type: "Credited",
      amount: "₹5,000",
      balance: "₹10,000",
      status: "Completed",
    },
    {
      key: "2",
      datetime: "24 Aug 25, 14:30PM",
      description: "Fund Added by UPI",
      type: "Debited",
      amount: "₹1,245",
      balance: "₹16,000",
      status: "Failed",
    },
    {
      key: "3",
      datetime: "24 Aug 25, 14:30PM",
      description: "Fund Added by UPI",
      type: "Credited",
      amount: "₹5,000",
      balance: "₹10,000",
      status: "Completed",
    },
    {
      key: "4",
      datetime: "24 Aug 25, 14:30PM",
      description: "Fund Added by UPI",
      type: "Debited",
      amount: "₹1,245",
      balance: "₹16,000",
      status: "Failed",
    },
  ];

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
      render: (text: string) => (
        <Text className="text-[13px] text-[#232323]">{text}</Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Text className="text-[13px] font-medium text-[#232323]">{text}</Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <span
          className={`px-3 py-[1px] rounded-[6px] text-[12px] font-medium ${
            type === "Credited"
              ? "bg-[#DFF5DD] text-[#0BA82F]"
              : "bg-[#FFCCCC] text-[#FF4D4F]"
          }`}
        >
          {type}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => (
        <Text className="text-[13px] text-[#232323]">{amount}</Text>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: string) => (
        <Text className="text-[13px] text-[#232323]">{balance}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-3 py-[1px] rounded-[6px] text-[12px] font-medium ${
            status === "Completed"
              ? "bg-[#DFF5DD] text-[#0BA82F]"
              : "bg-[#FFCCCC] text-[#FF4D4F]"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Help",
      key: "help",
      render: () => (
        <Image
          src="/info.svg"
          alt="help"
          width={18}
          height={18}
          className="cursor-pointer"
        />
      ),
    },
  ];

  return (
    <Card className="rounded-2xl shadow-md bg-[#FEFAF6] border-none">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 pb-3">
        <div>
          <Title level={5} className="!mb-2 !text-[#000000] !text-[20px] !font-medium">
            Transactions
          </Title>
          <Text className="!text-[#1D1D1D] !text-[13px] !font-light !mb-3">
            Fund Request Transaction
          </Text>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]">
          <Image
            src="/download.svg"
            alt="download"
            width={15}
            height={15}
            className="object-contain"
          />
          <Text className="text-[#232323] text-[13px] font-[500]">Export</Text>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-6">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={false}
          className="custom-ant-table"
        />
      </div>
    </Card>
  );
}
