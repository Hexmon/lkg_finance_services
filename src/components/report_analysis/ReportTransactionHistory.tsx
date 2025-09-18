/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Select, Button, Alert, Skeleton } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import SmartTable, { type SmartTableColumn } from "@/components/ui/SmartTable";
import { useTransactionSummaryQuery } from "@/features/retailer/general";

const { Text } = Typography;
const { Option } = Select;

type ApiTxn = {
  id: string;
  txn_id: string;
  service: string;
  created_at: string; // ISO
  txn_type: string;
  txn_amount: number;
  commission?: number | null;
  txn_status: "SUCCESS" | "FAILED" | "PENDING" | string;
  customer_id?: string | null;
  mode?: string | null;
  user_id?: string;
  // ...other fields possible
};

type ApiResponseShape =
  | { transactionData?: ApiTxn[]; total?: number; meta?: { total?: number } }
  | { data?: ApiTxn[]; total?: number; meta?: { total?: number } }
  | any;

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function formatINR(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

export default function ReportTransactionHistory() {
  // --- server pagination state ---
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // --- query (server-paginated) ---
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useTransactionSummaryQuery(
    { page, per_page: pageSize, order: "desc" },
    { refetchOnMountOrArgChange: true }
  );

  // --- robust data extraction: supports both shapes you shared ---
  const rows: ApiTxn[] = useMemo(() => {
    const d = data as ApiResponseShape | undefined;
    if (!d) return [];
    return (d.data as ApiTxn[]) || (d.transactionData as ApiTxn[]) || [];
  }, [data]);

  const total: number = useMemo(() => {
    const d = data as ApiResponseShape | undefined;
    return d?.meta?.total ?? d?.total ?? rows.length;
  }, [data, rows.length]);

  // --- columns for SmartTable ---
  const columns: SmartTableColumn<ApiTxn>[] = useMemo(
    () => [
      {
        key: "txn",
        title: "Transaction",
        render: ({ record }) => (
          <div className="min-w-[200px]">
            <Text className="!font-medium !text-[14px]">{record.txn_id || "—"}</Text>
            <br />
            <Text className="!text-[12px] !text-[#9A9595]">{record.service || "—"}</Text>
          </div>
        ),
      },
      {
        key: "date",
        title: "Date & Time",
        dataIndex: "created_at",
        render: ({ value }) => (
          <Text className="!text-[14px] !text-[#9A9595] !font-medium">{formatDateTime(value)}</Text>
        ),
      },
      {
        key: "type",
        title: "Type",
        dataIndex: "txn_type",
        render: ({ value }) => <Text className="!text-[14px] !font-medium">{value ?? "—"}</Text>,
      },
      {
        key: "customer",
        title: "Customer / Ref",
        dataIndex: "customer_id",
        render: ({ value, record }) => (
          <Text className="!text-[14px] !text-[#9A9595] !font-medium">{value || record.user_id || "—"}</Text>
        ),
      },
      {
        key: "amount",
        title: "Amount",
        dataIndex: "txn_amount",
        align: "right",
        render: ({ value }) => <Text className="!text-[14px] !font-medium">{formatINR(value)}</Text>,
      },
      {
        key: "commission",
        title: "Commission",
        dataIndex: "commission",
        align: "right",
        render: ({ value }) => (
          <Text className="!text-[14px] !text-[#0BA82F]">{value != null ? formatINR(value) : "—"}</Text>
        ),
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "txn_status",
        render: ({ value }) => {
          const v = String(value || "").toUpperCase();
          const cls =
            v === "SUCCESS"
              ? "bg-[#DFF5DD] text-[#0BA82F]"
              : v === "PENDING" || v === "PROCESSING"
              ? "bg-[#FFF2CC] text-[#F9A825]"
              : "bg-[#FFCCCC] text-[#FF4D4F]";
          const label = v === "SUCCESS" ? "Success" : v === "PENDING" ? "Processing" : v || "Failed";
          return (
            <span className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${cls}`}>
              {label}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
      {/* Header */}
      <div className="p-4">
        <Text className="!text-[20px] !font-medium block">Transaction History</Text>
        <Text className="!text-[12px] !font-light text-gray-500">
          Recent money transfer transactions
        </Text>
      </div>

      {/* Filters (UI only; wire your own handlers if needed) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 pb-4">
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Search</label>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Transaction Id, mobile…"
            className="!rounded-xl !bg-[#8C8C8C1C]"
            disabled={isLoading || isFetching}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Transaction Type</label>
          <Select defaultValue="All Type" className="!rounded-xl !bg-[#8C8C8C1C] !w-full">
            <Option value="all">All Type</Option>
            <Option value="SUBSCRIPTION">Subscription</Option>
            <Option value="DEBIT">Debit</Option>
            <Option value="CREDIT">Credit</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Status</label>
          <Select defaultValue="All Status" className="!rounded-xl !bg-[#8C8C8C1C] !w-full">
            <Option value="all">All Status</Option>
            <Option value="SUCCESS">Success</Option>
            <Option value="PENDING">Processing</Option>
            <Option value="FAILED">Failed</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Category</label>
          <Select defaultValue="All Category" className="!rounded-xl !bg-[#8C8C8C1C] !w-full">
            <Option value="all">All Category</Option>
            <Option value="BBPS">BBPS</Option>
            <Option value="DMT">DMT</Option>
            <Option value="AEPS">AEPS</Option>
          </Select>
        </div>

        {/* <div className="flex flex-col">
          <label className="invisible mb-1">Filter</label>
          <Button
            className="!rounded-xl !bg-white !shadow-md !flex !items-center !justify-center h-[38px]"
            disabled={isLoading || isFetching}
          >
            <FilterOutlined />
            <span className="ml-1">Filter</span>
          </Button>
        </div> */}
      </div>

      {/* Error */}
      {error ? (
        <div className="px-4 pb-3">
          <Alert
            type="error"
            message="Couldn’t load transactions."
            description="Please try again in a moment."
            showIcon
          />
        </div>
      ) : null}

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="px-4 pb-4">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <div className="px-4 pb-4">
          <SmartTable<ApiTxn>
            columns={columns}
            data={rows}
            striped
            card
            pagination={{
              mode: "server",
              page,
              pageSize,
              total,
              align: "right",
              pageSizeOptions: [5, 10, 20, 50],
              onChange: (nextPage, nextSize) => {
                setPage(nextPage);
                setPageSize(nextSize);
                // the hook will refetch because args changed
              },
            }}
            caption="Transactions table"
          />
        </div>
      )}
    </Card>
  );
}
