"use client";

import { Card, Table, Button, Typography } from "antd";
import Image from "next/image";

const { Text } = Typography;

export default function WalletStatement() {
    const txData = [
        {
            key: 1,
            datetime: "24 Aug 25, 14:30PM",
            desc: "Fund Added by UPI",
            type: "Credited",
            amount: "₹5,000",
            balance: "₹10,000",
            status: "Completed",
        },
        {
            key: 2,
            datetime: "24 Aug 25, 14:30PM",
            desc: "Fund Added by UPI",
            type: "Debited",
            amount: "₹1,245",
            balance: "₹16,000",
            status: "Failed",
        },
        {
            key: 3,
            datetime: "24 Aug 25, 14:30PM",
            desc: "Fund Added by UPI",
            type: "Debited",
            amount: "₹5,245",
            balance: "₹19,000",
            status: "Completed",
        },
        {
            key: 3,
            datetime: "24 Aug 25, 14:30PM",
            desc: "Fund Added by UPI",
            type: "Debited",
            amount: "₹6,245",
            balance: "₹16,000",
            status: "Failed",
        },
        {
            key: 4,
            datetime: "24 Aug 25, 14:30PM",
            desc: "Fund Added by UPI",
            type: "Debited",
            amount: "₹8,245",
            balance: "₹20,000",
            status: "Completed",
        },

    ];

    const columns = [
        {
            title: "Date & Time",
            dataIndex: "datetime",
            render: (text: string) => <Text className="!text-[13px] !text-[#9A9595] !font-medium">{text}</Text>,
        },
        {
            title: "Description",
            dataIndex: "desc",
            render: (text: string) => (
                <Text className="!text-[13px] !font-medium">{text}</Text>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (t: string) => (
                <span
                    className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${t === "Credited"
                            ? "bg-[#DFF5DD] text-[#0BA82F]"
                            : "bg-[#FFCCCC] text-[#FF4D4F]"
                        }`}
                >
                    {t}
                </span>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (amt: string) => <Text className="!text-[13px] !font-medium">{amt}</Text>,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            render: (bal: string) => <Text className="text-[13px] !font-medium">{bal}</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string) => (
                <span
                    className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${s === "Completed"
                            ? "bg-[#DFF5DD] text-[#0BA82F]"
                            : "bg-[#FFCCCC] text-[#FF4D4F]"
                        }`}
                >
                    {s}
                </span>
            ),
        },
        {
            title: "Help",
            render: () => (
                <Image src="/info.svg" alt="help" width={18} height={18} />
            ),
        },
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
            {/* Wallet Transactions */}
            <div className="lg:col-span-2">
                <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
                    <div className="flex justify-between items-start p-4 mb-0">
                        <div>
                            <Text className="!text-[20px] !font-medium block">
                                Wallet Transactions
                            </Text>
                            <Text className="!text-[12px] !font-light text-gray-500">
                                Recent money transfer transactions
                            </Text>
                        </div>

                        <Button className="bg-white shadow-xl px-4 rounded-lg flex items-center h-fit"
                        onClick={handleExport}
                        >
                            <Image src="/download.svg" alt="export" width={15} height={15} />
                            <Text className="inline ml-2">Export</Text>
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={txData}
                        pagination={false}
                        bordered={false}
                    />
                </Card>
            </div>

            {/* Wallet Summary */}
            <Card className="rounded-2xl shadow-md p-6">
                <div className="!mt-8">
                    <Text className="!text-[16px] !font-medium ">Wallet Summary</Text>
                </div>
                <div className="mt-6 space-y-2 text-[14px]">
                    <div className="flex justify-between !text-[12px] !font-medium"><Text>Opening Balance</Text><Text>₹15,000</Text></div>
                    <div className="flex justify-between !text-[12px] !font-medium"><Text>Credits</Text><Text className="!text-[#0BA82F]">+₹10,045</Text></div>
                    <div className="flex justify-between !text-[12px] !font-medium"><Text>Debits</Text><Text className="!text-[#FF4D4F]">‑₹2,819</Text></div>
                    <div className="flex justify-between !text-[12px] !font-medium"><Text strong>Closing Balance</Text><Text strong>₹26,000</Text></div>
                </div>
                <Button className="!bg-[#3386FF] !w-full !mt-18 !rounded-2xl !text-[12px] !font-medium !h-[40px] !text-white">Add Funds</Button>
                <Button className=" !border !border-[#3386FF] !w-full !mt-6 !rounded-2xl !text-[#3386FF] !text-[12px] !font-medium !h-[40px]">Download Statement</Button>
            </Card>
        </div>
    );
}
