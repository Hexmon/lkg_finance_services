"use client";

import { Card, Table, Button, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useMemo } from "react";

// ⬇️ use the hook you already created
import { useCommissionSummaryQuery } from "@/features/retailer/wallet/data/hooks";

const { Text } = Typography;

export default function CommissionSummary() {
  // fetch page 1, 10 rows (same as your static table)
  const { data, error, isLoading } = useCommissionSummaryQuery(
    {
      page: 1,
      per_page: 10,
      order: "desc",
      sort_by: "created_at",
      // start_date, end_date, user_id can be provided when you wire filters
    },
    true
  );

  useEffect(() => {
    if (data) console.log("[commission-summary] fetched:", data);
    if (error) console.error("[commission-summary] error:", error);
  }, [data, error]);

  // ----- columns (UNCHANGED) -----
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

  // ----- map API → your existing row shape (no UI changes) -----
  const rows = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((it, idx) => ({
      key: it.id ?? idx,
      // show wallet/service name
      service: it.wallet_name ?? it.txn_type ?? "—",
      // keep currency-like look for this column, use last_balance
      transactions: `₹${Number(it.last_balance ?? 0).toLocaleString("en-IN")}`,
      // volume: current balance snapshot at that time
      volume: `₹${Number(it.current_balance ?? 0).toLocaleString("en-IN")}`,
      // commission amount from API (balance field)
      commission: `₹${Number(it.balance ?? 0).toLocaleString("en-IN")}`,
      // no rate provided by API → show placeholder (keeps same pill UI)
      rate: "—",
    }));
  }, [data]);

  // your existing CSV export still uses local demo data; leaving it untouched
  const transactions = [
    { id: "TXN001", date: "2025-09-12", amount: 3163, status: "Success" },
    { id: "TXN002", date: "2025-09-12", amount: 5000, status: "Pending" },
    { id: "TXN003", date: "2025-09-13", amount: 2000, status: "Failed" },
  ];

  const handleExport = () => {
    const headers = ["Transaction ID", "Date", "Amount", "Status"];
    const rows = transactions.map(
      (t) => `${t.id},${t.date},${t.amount},${t.status}`
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Transaction_History.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  mb-6">
      {/* Commission Summary Table */}
      <div className="lg:col-span-3">
        <Card className="!rounded-2xl !shadow-md !bg-[#FEFAF6] ">
          <div className="flex justify-between p-4 mb-3">
            <Text className="!text-[20px] !font-medium">Commission Summary</Text>
            <Button className="!bg-white !shadow-2xl !px-4 !rounded-md !flex !items-center">
              <DownloadOutlined />
              <span className="!ml-2 !rounded-xl !shadow-2xl !font-medium" onClick={handleExport}>
                Export
              </span>
            </Button>
          </div>

          {/* render API rows; keep styling/props identical */}
          <Table
            columns={columns}
            dataSource={rows}
            loading={isLoading}
            pagination={false}
            bordered={false}
          />
        </Card>
      </div>

      {/* Right Side (unchanged) */}
      {/* <div className="flex flex-col gap-6">
        <Card className="rounded-2xl shadow-md p-4">
          <Text className="!text-[16px] !font-medium">Commission Distribution</Text>
        </Card>

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
      </div> */}
    </div>
  );
}
