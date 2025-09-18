"use client";

import { Card, Table, Button, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect } from "react";

// ⬇️ import the hook
import { useCommissionSummaryQuery } from "@/features/retailer/wallet/data/hooks";

const { Text } = Typography;

export default function CommissionSummary() {
  // 🔔 Call the API (background only). Keep your UI fully static.
  const { data, error, isLoading } = useCommissionSummaryQuery(
    {
      page: 1,
      per_page: 10,
      order: "desc",
      sort_by: "created_at",
      // start_date: "2025-05-27",
      // end_date: "2025-05-27",
      // user_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
    true // enabled
  );

  // Optional: observe what's coming back without rendering it
  useEffect(() => {
    if (data) console.log("[commission-summary] fetched:", data);
    if (error) console.error("[commission-summary] error:", error);
  }, [data, error]);

  // ---- Your existing static data (unchanged) ----
  const commissionData = [
    { key: 1, service: "Electricity", transactions: "₹150", volume: "₹5,2000", commission: "₹2.5", rate: "0.5%" },
    { key: 2, service: "DTH", transactions: "₹89", volume: "₹7,2000", commission: "₹2.5", rate: "0.5%" },
    { key: 3, service: "Mobile Recharge", transactions: "₹799", volume: "₹7,8000", commission: "₹2.5", rate: "0.5%" },
    { key: 4, service: "Gas", transactions: "₹1,100", volume: "₹9,2000", commission: "₹2.5", rate: "0.5%" },
  ];

  const columns = [
    { title: "Service", dataIndex: "service", render: (text: string) => <Text className="!text-[14px] !font-medium">{text}</Text> },
    { title: "Transactions", dataIndex: "transactions", render: (text: string) => <Text className="!text-[14px] !font-medium">{text}</Text> },
    { title: "Volume", dataIndex: "volume", render: (text: string) => <Text className="!text-[14px] !font-medium">{text}</Text> },
    { title: "Commission", dataIndex: "commission", render: (text: string) => <Text className="!text-[#0BA82F] !font-medium">{text}</Text> },
    { title: "Rate", dataIndex: "rate", render: (text: string) => <span className="!px-2 !py-[1px] !bg-[#E6F0FF] !text-[#3386FF] !rounded-md !text-[12px] !font-medium">{text}</span> },
  ];

  const chartData = [
    { name: "Elect.", value: 120 },
    { name: "Mobile", value: 200 },
    { name: "DTH", value: 150 },
    { name: "Gas", value: 100 },
    { name: "Education", value: 180 },
    { name: "Bills", value: 140 },
  ];
   const transactions = [
    { id: "TXN001", date: "2025-09-12", amount: 3163, status: "Success" },
    { id: "TXN002", date: "2025-09-12", amount: 5000, status: "Pending" },
    { id: "TXN003", date: "2025-09-13", amount: 2000, status: "Failed" },
  ];

  // 🔹 Export to CSV
  const handleExport = () => {
    // Convert to CSV string
    const headers = ["Transaction ID", "Date", "Amount", "Status"];
    const rows = transactions.map(
      (t) => `${t.id},${t.date},${t.amount},${t.status}`
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create downloadable file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Trigger download
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
      <div className="lg:col-span-2">
        <Card className="!rounded-2xl !shadow-md !bg-[#FEFAF6] ">
          <div className="flex justify-between p-4 mb-3">
            <Text className="!text-[20px] !font-medium">Commission Summary</Text>
            <Button className="!bg-white !shadow-2xl !px-4 !rounded-md !flex !items-center">
              <DownloadOutlined />
              <span className="!ml-2 !rounded-xl !shadow-2xl !font-medium"
               onClick={handleExport}
              >Export</span>
            </Button>
          </div>

          {/* ✅ Still rendering static data only */}
          <Table columns={columns} dataSource={commissionData} pagination={false} bordered={false} />
        </Card>
      </div>

      {/* Right Side */}
      <div className="flex flex-col gap-6">
        <Card className="rounded-2xl shadow-md p-4">
          <Text className="!text-[16px] !font-medium">Commission Distribution</Text>
        </Card>

        <Card className="rounded-2xl shadow-md p-4">
          <Text className="!text-[16px] !font-medium">Monthly Summary</Text>
          <div className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><Text className="!text-[12px] !font-medium">Opening Balance</Text><Text className="!text-[12px] !font-medium">₹15,000</Text></div>
            <div className="flex justify-between"><Text className="!text-[12px] !font-medium">Credits</Text><Text className="!text-[#0BA82F] !text-[12px] !font-medium">+₹10,045</Text></div>
            <div className="flex justify-between"><Text className="!text-[12px] !font-medium">Debits</Text><Text className="!text-[#FF4D4F] !text-[12px] !font-medium">-₹2,819</Text></div>
            <div className="flex justify-between font-medium"><Text className="!text-[12px] !font-medium">Closing Balance</Text><Text className="!text-[12px] !font-medium">₹26,000</Text></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
