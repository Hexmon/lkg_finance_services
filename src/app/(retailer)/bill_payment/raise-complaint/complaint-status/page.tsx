"use client";

import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { Input, Select, Button, Typography } from "antd";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

export default function CheckComplaintStatus() {
    return (
        <DashboardLayout
            activePath="/raise-complaint"
            sections={billPaymentSidebarConfig}
            pageTitle="Complaint Registration"
        >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <DashboardSectionHeader
                        title="Check Complain Status"
                        titleClassName="!font-medium text-[20px] !mt-0"
                        subtitle="Step 1 - Please select the complain ID and Select the type of Complain"
                        subtitleClassName="!mb-4 !text-[14px]"
                        showBack
                    />
                    <Image src="/logo.svg" alt="logo" width={120} height={120} />
                </div>
                <div>
                    <div className="bg-white rounded-xl shadow-sm w-full p-6">

                        {/* Info Banner */}
                        <div className="bg-[#FFECB3] text-[#FF9809s] text-sm px-4 py-2 rounded-xl mb-6">
                            Check Complain status using Complaint ID
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Complaint ID */}
                            <div>
                                <label className="block text-[#444] text-sm mb-2">Complain ID:</label>
                                <Input placeholder="Enter Complain ID:" size="large" />
                            </div>

                            {/* Type of Complaint */}
                            <div>
                                <label className="block text-[#444] text-sm mb-2">
                                    Types of Complaint
                                </label>
                                <Select
                                    placeholder="-Select Type of Complaint"
                                    size="large"
                                    className="w-full"
                                >
                                    <Option value="transaction">Transaction</Option>
                                    <Option value="services">Services</Option>
                                </Select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="primary"
                                className="bg-[#3386FF] hover:bg-[#1b6fe0] text-white px-10 h-[40px] rounded-xl w-[198px]"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
        </DashboardLayout>
    );
}
