"use client";

import { Card, Table, Typography, Input, Select, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

export default function ReportTransactionHistory() {
    const txData = [
        {
            key: 1,
            txnId: "TXN123456789",
            service: "Electricity",
            datetime: "24 Aug 25, 14:30PM",
            type: "Mobile Recharge",
            customerNo: "965465223",
            amount: "₹190",
            commission: "₹2.5",
            status: "Success",
        },
        {
            key: 2,
            txnId: "TXN123456789",
            service: "Electricity",
            datetime: "24 Aug 25, 14:30PM",
            type: "BBPS",
            customerNo: "965465223",
            amount: "₹1,190",
            commission: "₹2.5",
            status: "Processing",
        },
        {
            key: 3,
            txnId: "TXN123456789",
            service: "DTH",
            datetime: "24 Aug 25, 14:30PM",
            type: "DTH Recharge",
            customerNo: "965465223",
            amount: "₹999",
            commission: "₹2.5",
            status: "Success",
        },
    ];

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "txnId",
            render: (text: string, record: string) => (
                <div>
                    <Text className="!font-medium !text-[14px]">{text}</Text>
                    <br />
                    <Text className="!text-[12px] !text-[#9A9595]">{record.service}</Text>
                </div>
            ),
        },
        {
            title: "Date & Time",
            dataIndex: "datetime",
            render: (text: string) => <Text className="!text-[14px] !text-[#9A9595] !font-medium">{text}</Text>,
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (text: string) => (
                <Text className="!text-[14px] !font-medium">{text}</Text>
            ),
        },
        {
            title: "Customer No.",
            dataIndex: "customerNo",
            render: (text: string) => <Text className="!text-[14px] !text-[#9A9595] !font-medium">{text}</Text>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (amt: string) => <Text className="!text-[14px] !font-medium">{amt}</Text>,
        },
        {
            title: "Commission",
            dataIndex: "commission",
            render: (amt: string) => (
                <Text className="!text-[14px] !text-[#0BA82F]">{amt}</Text>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (s: string) => (
                <span
                    className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${s === "Success"
                            ? "bg-[#DFF5DD] text-[#0BA82F]"
                            : s === "Processing"
                                ? "bg-[#FFF2CC] text-[#F9A825]"
                                : "bg-[#FFCCCC] text-[#FF4D4F]"
                        }`}
                >
                    {s}
                </span>
            ),
        },
    ];

    return (
        <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
            {/* Header */}
            <div className="p-4">
                <Text className="!text-[20px] !font-medium block">
                    Transaction History
                </Text>
                <Text className="!text-[12px] !font-light text-gray-500">
                    Recent money transfer transactions
                </Text>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 pb-4">
                {/* Search */}
                <div className="flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">Search</label>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Transaction Id, mobile..."
                        className="!rounded-xl !bg-[#8C8C8C1C]"
                    />
                </div>

                {/* Transaction Type */}
                <div className="flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">Transaction Type</label>
                    <Select
                        defaultValue="All Type"
                        className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
                    >
                        <Option value="all">All Type</Option>
                        <Option value="recharge">Mobile Recharge</Option>
                        <Option value="dth">DTH</Option>
                    </Select>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">Status</label>
                    <Select
                        defaultValue="All Status"
                        className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
                    >
                        <Option value="all">All Status</Option>
                        <Option value="success">Success</Option>
                        <Option value="failed">Failed</Option>
                        <Option value="processing">Processing</Option>
                    </Select>
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label className="text-gray-600 text-sm mb-1">Category</label>
                    <Select
                        defaultValue="All Category"
                        className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
                    >
                        <Option value="all">All Category</Option>
                        <Option value="electricity">Electricity</Option>
                        <Option value="dth">DTH</Option>
                    </Select>
                </div>

                {/* Filter Button */}
                <div className="flex flex-col">
                    <label className="invisible mb-1">Filter</label> {/* keeps alignment */}
                    <Button className="!rounded-xl !bg-white !shadow-md !flex !items-center !justify-center h-[38px]">
                        <FilterOutlined />
                        <span className="ml-1">Filter</span>
                    </Button>
                </div>
            </div>


            {/* Table */}
            <Table
                columns={columns}
                dataSource={txData}
                pagination={false}
                bordered={false}
                className="px-4"
            />
        </Card>
    );
}
