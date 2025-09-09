"use client";

import React, { useState } from "react";
import { Button, Input, Select, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useRouter } from "next/navigation";

const { Text } = Typography;
const { Option } = Select;

export default function RaiseComplaintPage() {
    const [complaintType, setComplaintType] = useState("Transaction");
    const [participantType, setParticipantType] = useState("");
    const [serviceReason, setServiceReason] = useState("");
    const [complaintDisposition, setComplaintDisposition] = useState("");
    const router = useRouter();

    return (
        <DashboardLayout
            activePath="/raise-complaint"
            sections={billPaymentSidebarConfig}
            pageTitle="Complaint Registration"
        >
            <div className="min-h-screen w-full mb-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <DashboardSectionHeader
                        title="Bharat Connect - Raise Complaint"
                        titleClassName="!font-medium text-[20px] !mt-0"
                        subtitle="Select Service type of Complaint"
                        subtitleClassName="!mb-4 !text-[14px]"
                        showBack
                    />
                    <Image src="/logo.svg" alt="logo" width={120} height={120} />
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-md p-6 mt-4 w-full">
                    {/* Banner */}
                    <div className="bg-[#FFECB3] text-[#FF9809] p-3 rounded-md text-sm mb-6">
                        Enter details to raise complaint
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Complaint Type */}
                        <div>
                            <Text className="block text-gray-600 mb-2">Type Of Complaint</Text>
                            <Select
                                value={complaintType}
                                onChange={(val) => setComplaintType(val)}
                                className="w-full !h-[40px]"
                            >
                                <Option value="Transaction">Transaction</Option>
                                <Option value="Services">Services</Option>
                            </Select>
                        </div>

                        {/* Participant Type */}
                        <div>
                            <Text className="block text-gray-600 mb-2">Participant Type</Text>
                            <Select
                                placeholder="-Select Participation Type-"
                                value={participantType || undefined}
                                onChange={(val) => setParticipantType(val)}
                                className="w-full !h-[40px]"
                            >
                                <Option value="Agent">Agent</Option>
                                <Option value="Biller">Biller</Option>
                            </Select>
                        </div>

                        {/* Transaction ID */}
                        <div>
                            <Text className="block text-gray-600 mb-2 ">Transaction Id*</Text>
                            <Input
                                placeholder="Enter Transaction ID"
                                suffix={<SearchOutlined />}
                                className="!h-[40px]"
                            />
                        </div>

                        {/* Complaint Disposition */}
                        <div>
                            <Text className="block text-gray-600 mb-2">Complaint Disposition</Text>
                            <Select
                                placeholder="-Select Complaint Disposition-"
                                value={complaintDisposition || undefined}
                                onChange={(val) => setComplaintDisposition(val)}
                                className="w-full !h-[40px]"
                            >
                                <Option value="not_received">
                                    Transaction successful, Amount Debited but services not received
                                </Option>
                                <Option value="service_stopped">
                                    Transaction successful, Amount Debited but service Disconnected or service stopped
                                </Option>
                                <Option value="late_payment">
                                    Transaction successful, Amount Debited but Late Payment Surcharge Charges add in next bill
                                </Option>
                                <Option value="wrong_account">
                                    Erroneously paid in wrong account
                                </Option>
                                <Option value="duplicate">Duplicate Payment</Option>
                                <Option value="wrong_amount">
                                    Erroneously paid the wrong amount
                                </Option>
                                <Option value="info_not_received">
                                    Payment information not received from Biller or Delay in receiving payment information from the Biller
                                </Option>
                                <Option value="bill_not_adjusted">
                                    Bill Paid but amount not adjusted or still showing due amount
                                </Option>
                            </Select>
                        </div>

                        {/* Service Reason */}
                        <div>
                            <Text className="block text-gray-600 mb-2">Service Reason*</Text>
                            <Select
                                placeholder="-Select Service Reason-"
                                value={serviceReason || undefined}
                                onChange={(val) => setServiceReason(val)}
                                className="w-full !h-[40px]"
                            >
                                <Option value="api">Complaint Initiated Through API</Option>
                                <Option value="manual">Manual Complaint</Option>
                            </Select>
                        </div>
                        {/* Complaint Description */}
                        <div className="md:col-span-2">
                            <label className="block text-[#444] text-sm mb-1">
                                Complaint Description
                            </label>
                            <Input
                                placeholder="Enter Complaint Description"
                                size="large"
                                className="!h-[40px] !w-xl"
                            />
                        </div>


                        {/* Biller ID */}
                        <div>
                            <Text className="block text-gray-600 mb-2">Biller Id*</Text>
                            <Input value="Mobile Prepaid_Dummy" className="!h-[40px]" />
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <Button
                            type="primary"
                            className="!bg-[#3386FF] !text-white !rounded-xl !shadow-md px-8 py-2 !h-[40px]"
                            onClick={() => router.push("/bill_payment/raise-complaint/complaint-status")}
                        >
                            Raise Complaint
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
