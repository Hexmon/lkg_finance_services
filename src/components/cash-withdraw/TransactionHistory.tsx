"use client";

import { useTransactionSummaryQuery } from "@/features/retailer/general";
import { Card, Table, Typography, Empty } from "antd";
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

export default function TransactionHistory() {
  const {
    data: { data: transactionData } = {},
    isLoading: transactionLoading,
    error: transactionError,
  } = useTransactionSummaryQuery({ page: 1, per_page: 5, order: "desc" });

  // ✅ filter to AEPS only (case-insensitive)
  const aepsOnly =
    (transactionData || []).filter(
      (t: any) => String(t?.service || "").toUpperCase() === "AEPS"
    ) ?? [];

  const rows =
    aepsOnly.map((t: any, idx: number) => ({
      key: t.id ?? idx,
      name: t.name || t.registered_name || "—",
      txnId: t.txn_id,
      service: t.service,
      bank: t.api_partner || "—",
      amount: inr.format((t.net_amount ?? t.txn_amount) || 0),
      commission: t.commission != null ? inr.format(t.commission) : "—",
      status: t.txn_status || "—",
      time: t.created_at ? dayjs(t.created_at).fromNow() : "—",
      _rawStatus: (t.txn_status || "").toUpperCase(),
    })) ?? [];

  const statusClass = (s: string) => {
    switch (s) {
      case "SUCCESS":
        return "bg-green-100 text-green-600";
      case "FAILED":
      case "REJECTED":
        return "bg-red-100 text-red-600";
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
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
          {transactionError ? (
            <div className="text-red-600">Failed to load transactions.</div>
          ) : (
            <Table
              pagination={false}
              loading={transactionLoading}
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
                  title: "Service",
                  dataIndex: "service",
                  key: "service",
                  render: (val: string) => (
                    <Text className="text-black font-medium">{val}</Text>
                  ),
                },
                {
                  title: "Partner",
                  dataIndex: "bank",
                  key: "bank",
                  render: (val: string) => (
                    <Text className="text-black font-medium">{val}</Text>
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
                  title: "Commission",
                  dataIndex: "commission",
                  key: "commission",
                  render: (val: string) => (
                    <span className="text-blue-600">{val}</span>
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
                { title: "Time", dataIndex: "time", key: "time" },
                {
                  title: "Actions",
                  key: "actions",
                  render: () => (
                    <button className="text-gray-600 hover:text-black flex items-center ml-2">
                      <Image src="/eye.svg" alt="view" width={18} height={18} />
                    </button>
                  ),
                },
              ]}
              dataSource={rows}
            />
          )}
        </div>
      </Card>
    </>
  );
}
