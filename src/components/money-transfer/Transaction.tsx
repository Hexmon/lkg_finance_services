"use client";

import { Card, Table, Typography } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";

const { Text } = Typography;

export default function Transaction() {
  return (
    <Card className="rounded-2xl shadow-md">
      <div className="flex justify-between items-center px-6 pt-4 mb-3">
        <div>
          <Title level={4} className="!mb-0">
            Transaction History
          </Title>
          <Text className="secondary !font-[300]">
            Recent money transfer transactions
          </Text>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]">
            <Image
              src="/filter.svg"
              alt="filter"
              width={15}
              height={15}
              className="object-contain"
            />
            <Text>Filter</Text>
          </div>

          <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]">
            <Image
              src="/download.svg"
              alt="download"
              width={15}
              height={15}
              className="object-contain"
            />
            <Text>Export</Text>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Table
          pagination={false}
          className="custom-table"
          columns={[
            {
              title: "Beneficiaries",
              dataIndex: "beneficiaries",
              key: "beneficiaries",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render: (_text: string, record: any) => (
                <div className="flex items-center gap-2">
                  <Image
                    src="/transaction-p.svg"
                    alt="user"
                    width={38}
                    height={37}
                  />
                  <div>
                    <div className="font-medium">{record.name}</div>
                    <div className="text-xs text-gray-500">{record.txnId}</div>
                  </div>
                </div>
              ),
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              render: (val: string) => (
                <Text className="text-black font-medium">{val}</Text>
              ),
            },
            {
              title: "Mode",
              dataIndex: "mode",
              key: "mode",
              render: (val: string) => (
                <Text className="text-black font-medium">{val}</Text>
              ),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (val: string) =>
                val === "Success" ? (
                  <span className="px-2 py-1 rounded-md bg-green-100 text-green-600 text-xs">
                    {val}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-600 text-xs">
                    {val}
                  </span>
                ),
            },
            { title: "Time", dataIndex: "time", key: "time" },
            {
              title: "Actions",
              key: "actions",
              render: () => (
                <div className="!shadow-2xl !rounded-2xl w-fit">
                  <button className="text-gray-600 hover:text-black flex items-center ml-2">
                    <Image src="/eye.svg" alt="view" width={18} height={18} />
                  </button>
                </div>
              ),
            },
          ]}
          dataSource={[
            {
              key: "1",
              name: "Rajesh Kumar",
              txnId: "TXN123456789",
              amount: "₹5,000",
              mode: "IMPS",
              status: "Success",
              time: "2 min ago",
            },
            {
              key: "2",
              name: "Rajesh Kumar",
              txnId: "TXN123456789",
              amount: "₹5,000",
              mode: "IMPS",
              status: "Processing",
              time: "2 min ago",
            },
            {
              key: "3",
              name: "Rajesh Kumar",
              txnId: "TXN123456789",
              amount: "₹5,000",
              mode: "IMPS",
              status: "Success",
              time: "2 min ago",
            },
            {
              key: "4",
              name: "Rajesh Kumar",
              txnId: "TXN123456789",
              amount: "₹5,000",
              mode: "IMPS",
              status: "Success",
              time: "2 min ago",
            },
            {
              key: "5",
              name: "Rajesh Kumar",
              txnId: "TXN123456789",
              amount: "₹5,000",
              mode: "IMPS",
              status: "Success",
              time: "2 min ago",
            },
          ]}
        />
      </div>
    </Card>
  );
}
