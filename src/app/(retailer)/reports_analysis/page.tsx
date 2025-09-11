"use client";

import React, { useState } from "react";
import {
    Card, Typography, Button, Input, DatePicker, Select, Table, Tabs, Progress
} from "antd";
import { ArrowLeftOutlined, CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { CardLayout } from "@/lib/layouts/CardLayout";
import SmartTabs, { TabItem } from "@/components/ui/SmartTabs";
import WalletStatement from "@/components/report_analysis/WalletStatement";
import ReportTransactionHistory from "@/components/report_analysis/ReportTransactionHistory";
import CommissionSummary from "@/components/report_analysis/CommissionSummary";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ReportAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<string | number>("wallet");

    const stats = [
        { label: "Current Balance", value: "₹ 25,000", change: "12.5%", up: true },
        { label: "Total Transaction", value: "1,247", change: "8.3%", up: true },
        { label: "Commission Earned", value: "₹5,234", change: "3.2%", up: false },
        { label: "Success Rate", value: "92.4%", change: "1.8%", up: true },
    ];



    const items: TabItem[] = [
        {
            key: "walletstatement",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "walletstatement"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/credit-card.svg" alt="New" width={16} height={16} />
                    <span>Wallet Statement</span>
                </div>
            ),
            content: <WalletStatement/>,
        },
        {
            key: "transactionhistory",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "transactionhistory"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/transaction-bill.svg" alt="History" width={16} height={16} />
                    <span>Transaction History</span>
                </div>
            ),
            content: <ReportTransactionHistory />,
        },
                {
            key: "commissionsummary",
            label: (
                <div
                    className={`flex items-center px-3.5 py-2.5 rounded-[15px] h-[60px] ${activeTab === "commissionsummary"
                        ? "bg-[#3386FF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Image src="/line-blk.svg" alt="History" width={16} height={16} />
                    <span>Commission Summary</span>
                </div>
            ),
            content: <CommissionSummary />,
        },
    ];

    return (
        <DashboardLayout activePath="/reports" pageTitle="Report & Analysis" sections={moneyTransferSidebarConfig}>
            <DashboardSectionHeader
                title="Report & Analytics"
                subtitle="Financial reports and transaction analytics"
                titleClassName="text-[25px] font-medium"
                subtitleClassName="text-[14px]"
            />

            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                <CardLayout
                    elevation={2}
                    rounded="rounded-3xl"
                    padding="p-4"
                    height="h-auto"
                    bgColor="bg-white"
                    body={
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="text-[#787878] text-[14px] font-medium">Current Balance</div>
                                <Image
                                    src="/icons/total-transation.svg"
                                    alt=""
                                    width={25}
                                    height={25}
                                    className="bg-[#3385ff3d] rounded-full p-1"
                                />
                            </div>
                            <div className="font-semibold text-[32px]">25000</div>
                            <Text className="text-black text-[10px] font-light">
                                <CaretUpOutlined style={{ color: 'green' }} /> 12.5% Since Last Month
                            </Text>
                        </div>
                    }
                />
                <CardLayout
                    elevation={2}
                    rounded="rounded-3xl"
                    padding="p-4"
                    height="h-auto"
                    bgColor="bg-white"
                    body={
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="text-[#787878] text-[14px] font-medium">Total Transaction</div>
                                <Image
                                    src="/icons/success-rate.svg"
                                    alt=""
                                    width={25}
                                    height={25}
                                    className="bg-[#3385ff3d] rounded-full p-1"
                                />
                            </div>
                            <div className="font-semibold text-[32px]">1,247</div>
                            <Text className="text-black text-[10px] font-light">
                                <CaretUpOutlined style={{ color: 'green' }} /> 8.3% Since Last Month
                            </Text>
                        </div>
                    }
                />
                <CardLayout
                    elevation={2}
                    rounded="rounded-3xl"
                    padding="p-4"
                    height="h-auto"
                    bgColor="bg-white"
                    body={
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="text-[#787878] text-[14px] font-medium">Commission Earned</div>
                                <Image
                                    src="/customer.svg"
                                    alt=""
                                    width={25}
                                    height={25}
                                    className="bg-[#3385ff3d] rounded-full p-1"
                                />
                            </div>
                            <div className="font-semibold text-[32px]">₹5,234</div>
                            <Text className="text-black text-[10px] font-light">
                                <CaretDownOutlined style={{ color: 'red' }} />3.2% Since Last Month
                            </Text>
                        </div>
                    }
                />
                <CardLayout
                    elevation={2}
                    rounded="rounded-3xl"
                    padding="p-4"
                    height="h-auto"
                    bgColor="bg-white"
                    body={
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="text-[#787878] text-[14px] font-medium">Success Rate</div>
                                <Image
                                    src="/icons/commission.svg"
                                    alt=""
                                    width={25}
                                    height={25}
                                    className="bg-[#3385ff3d] rounded-full p-1"
                                />
                            </div>
                            <div className="font-semibold text-[32px]">92.4%</div>
                            <Text className="text-black text-[10px] font-light">
                                <CaretUpOutlined style={{ color: 'green' }} /> 1.8% Since Last Month
                            </Text>
                        </div>
                    }
                />
            </div>

            <div className="flex gap-3 p-4 bg-[#FFFF] rounded-2xl shadow-inner justify-between">
                {/* From Date */}
                <DatePicker
                    placeholder="From Date"
                    style={{
                        width: 203,
                        height: 45,
                        borderRadius: "12px",
                        padding: "6px 12px",
                        boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
                    }}
                />

                {/* To Date */}
                <DatePicker
                    placeholder="To Date"
                    style={{
                        width: 203,
                        height: 45,
                        borderRadius: "12px",
                        padding: "6px 12px",
                        boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
                    }}
                />

                {/* Service Dropdown */}
                <select className="px-4 py-2 rounded-xl shadow-md bg-[#FFFFFF] text-gray-600 w-[203px]">
                    <option>Service</option>
                </select>

                {/* Status Dropdown */}
                <select className="px-4 py-2 rounded-xl shadow-md bg-[#FFFF] text-gray-600 w-[203px]">
                    <option>Status</option>
                </select>

                {/* Filter Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FFFF] rounded-xl shadow-md text-gray-700 font-medium w-[109px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    Filter
                </button>
            </div>

           <SmartTabs
                items={items}
                activeKey={activeTab}
                onChange={setActiveTab}
                keepAlive
                fitted={false}
                durationMs={260}
                easing="cubic-bezier(.22,1,.36,1)"
            />
            
        </DashboardLayout>
    );
}
