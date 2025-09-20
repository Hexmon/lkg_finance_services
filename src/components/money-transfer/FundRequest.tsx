"use client";

import React, { useMemo } from "react";
import { Card, Table, Typography } from "antd";
import Image from "next/image";

// ✅ import your hook/types (same place you used useRetailerDashboardQuery)
import { useTransactionSummaryQuery } from "@/features/retailer/general";
import type { TransactionSummaryQuery } from "@/features/retailer/general/domain/types";

const { Text, Title } = Typography;

type Row = {
  key: string;
  datetime: string;
  description: string;
  type: "Credited" | "Debited" | string;
  amount: string;
  balance: string;
  status: "Completed" | "Failed" | string;
};

function formatINR(n: number | null | undefined) {
  if (typeof n !== "number" || !isFinite(n)) return "₹0";
  try {
    return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
  } catch {
    // fallback
    const [i, f] = n.toFixed(2).split(".");
    return `₹${i.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${f ? "." + f : ""}`;
  }
}
function toCredDeb(sub: string | null | undefined): "Credited" | "Debited" | string {
  if (!sub) return "";
  const u = sub.toUpperCase();
  if (u === "CR") return "Credited";
  if (u === "DR") return "Debited";
  return sub;
}
function toStatusLabel(st: string | null | undefined): "Completed" | "Failed" | string {
  if (!st) return "";
  const u = st.toUpperCase();
  if (u === "SUCCESS") return "Completed";
  if (u === "FAILED") return "Failed";
  return st;
}
function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  // "24 Aug 25, 14:30PM"
  const dd = d.getDate().toString().padStart(2, "0");
  const mmm = d.toLocaleString("en-US", { month: "short" });
  const yy = String(d.getFullYear()).slice(-2);
  let hh = d.getHours();
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  if (hh === 0) hh = 12;
  else if (hh > 12) hh -= 12;
  const HH = hh.toString().padStart(2, "0");
  return `${dd} ${mmm} ${yy}, ${HH}:${mm}${ampm}`;
}

export default function TransactionsTableFundReq() {
  // 🔗 hook query (no UI change)
  const query: TransactionSummaryQuery = { page: 1, per_page: 10, order: "desc", sort_by: "created_at" };
  const { data: page } = useTransactionSummaryQuery(query);

  // Map API → existing table shape
  const tableData: Row[] = useMemo(() => {
    const list = page?.data ?? [];
    return list.map((t, i) => {
      const desc =
        t.service?.trim() ||
        t.mode?.trim() ||
        t.txn_type?.trim() ||
        "—";
      return {
        key: t.id || `${t.txn_id}-${i}`,
        datetime: formatDateTime(t.created_at),
        description: desc,
        type: toCredDeb(t.txn_subtype),
        amount: formatINR(t.txn_amount),
        // No running balance in summary → show net_amount to keep UI intact
        balance: formatINR(t.net_amount),
        status: toStatusLabel(t.txn_status),
      };
    });
  }, [page]);

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

  // 🔹 Export now uses the same hook data
  const handleExport = () => {
    const headers = ["Transaction ID", "Date", "Amount", "Status"];
    const rows = (page?.data ?? []).map((t) => {
      const id = t.txn_id || t.id || "";
      const date = t.created_at || "";
      const amount = String(t.txn_amount ?? "");
      const status = toStatusLabel(t.txn_status);
      return `${id},${date},${amount},${status}`;
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "Transaction_History.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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

        <div
          className="flex items-center justify-center gap-2 px-4 py-1 rounded-[9px] bg-white shadow-sm cursor-pointer w-[111px] h-[35px]"
          onClick={handleExport}
        >
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
          dataSource={tableData}
          pagination={false}
          bordered={false}
          className="custom-ant-table"
        />
      </div>
    </Card>
  );
}
