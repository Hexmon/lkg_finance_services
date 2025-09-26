"use client";

import { Card, Table, Typography, Empty, Dropdown } from "antd";
import Title from "antd/es/typography/Title";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const handleExport = (rows: any[]) => {
  const headers = ["Customer", "Txn ID", "Amount", "Transaction Type", "Date & Time", "Status"];
  const csvRows = rows.map(
    (r) => `${r.name},${r.txnId},${r.amount},${r.type},${r.date},${r.status}`
  );
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Fastag_Transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const transactionData = [
  {
    id: "1",
    txn_id: "TXN123456789",
    name: "Rajesh Kumar",
    service: "Fastag",
    amount: 5000,
    txn_status: "SUCCESS",
    created_at: "2025-04-20T10:00:00Z",
  },
  {
    id: "2",
    txn_id: "TXN987654321",
    name: "Rajesh Kumar",
    service: "Fastag",
    amount: 5000,
    txn_status: "PROCESSING",
    created_at: "2025-04-20T10:05:00Z",
  },
];

export default function FastagTransactionHistory() {
  const isLoading = false;
  const error = null;

  const rows =
    (transactionData || []).map((t: any, idx: number) => ({
      key: t.id ?? idx,
      name: t.name || "—",
      txnId: t.txn_id || "—",
      type: t.service || "Fastag",
      amount: inr.format(t.amount || 0),
      date: t.created_at
        ? `${dayjs(t.created_at).format("DD MMMM YYYY")}, ${dayjs(
            t.created_at
          ).fromNow()}`
        : "—",
      status: t.txn_status || "—",
      _rawStatus: (t.txn_status || "").toUpperCase(),
    })) ?? [];

  const statusClass = (s: string) => {
    switch (s) {
      case "SUCCESS":
        return "bg-green-100 text-green-600";
      case "PROCESSING":
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "FAILED":
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card className="rounded-2xl shadow-md">
      <div className="flex justify-between items-center px-6 pt-4 mb-3">
        <div>
          <Title level={4} className="!mb-0">
            Transaction History
          </Title>
          <Text className="secondary !font-[300]">
            Recent Fastag transactions
          </Text>
        </div>

        <div className="flex gap-3">
          <Dropdown
            dropdownRender={() => <div className="p-3">Filter UI Here</div>}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]">
              <Image
                src="/filter.svg"
                alt="filter"
                width={15}
                height={15}
                className="object-contain"
              />
              <span className="text-sm">Filter</span>
            </div>
          </Dropdown>

          <div
            className="flex items-center justify-center gap-2 px-3 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]"
            onClick={() => handleExport(rows)}
          >
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
        {error ? (
          <div className="text-red-600">Failed to load transactions.</div>
        ) : (
          <Table
            pagination={false}
            loading={isLoading}
            locale={{
              emptyText: <Empty description="No transactions found" />,
            }}
            className="custom-table"
            columns={[
              {
                title: "Customer",
                dataIndex: "customer",
                key: "customer",
                render: (_: string, record: any) => (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/transaction-p.svg"
                      alt="user"
                      width={38}
                      height={37}
                    />
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-xs text-gray-500">
                        {record.txnId}
                      </div>
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
                title: "Transaction Type",
                dataIndex: "type",
                key: "type",
                render: (val: string) => (
                  <Text className="text-black font-medium">{val}</Text>
                ),
              },
              {
                title: "Date & Time",
                dataIndex: "date",
                key: "date",
                render: (val: string) => (
                  <Text className="text-gray-700">{val}</Text>
                ),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (_: string, record: any) => (
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${statusClass(
                      record._rawStatus
                    )}`}
                  >
                    {record.status}
                  </span>
                ),
              },
            ]}
            dataSource={rows}
          />
        )}
      </div>
    </Card>
  );
}
