"use client";

import { Card, Button, Typography, Tag, Modal, Form, Select, Input } from "antd";
import Image from "next/image";
import { useState } from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";

const { Text } = Typography;

interface Ticket {
    id: string;
    status: "Active" | "Closed";
    desc: string;
    mode: string;
    datetime: string;
}

interface TicketFormValues {
    transactionId: string;
    subject: string;
    description: string;
    priority: "low" | "medium" | "high";
}

export default function SupportTickets() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "TXN123456789",
            status: "Active",
            desc: "Customer reported incorrect transaction amount",
            mode: "BBPS Offline",
            datetime: "24 Aug 25, 14:30PM",
        },
        {
            id: "TXN123456789",
            status: "Closed",
            desc: "Customer reported incorrect transaction amount",
            mode: "BBPS Offline",
            datetime: "24 Aug 25, 14:30PM",
        },
    ]);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleSubmit = (values: TicketFormValues) => {
        const newTicket: Ticket = {
            id: values.transactionId,
            status: "Active",
            desc: values.description,
            mode: values.subject,
            datetime: new Date().toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setTickets([newTicket, ...tickets]); // Add new ticket at the top
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/support_ticket" pageTitle="Support Ticket">
            <DashboardSectionHeader title="Raised Tickets" titleClassName="!text-[20px]" />
            <div className="px-6 py-4 bg-white rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <Text className="!text-[14px] !font-medium !text-[#3386FF]">Tickets</Text>
                    <Button
                        type="primary"
                        className="!bg-[#3386FF] !rounded-lg !shadow-md !font-medium !text-[12px]"
                        onClick={showModal}
                    >
                        + Create New Ticket
                    </Button>
                </div>

                <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                        <Card key={index} className="!rounded-2xl !shadow-md !bg-[#FFFFFF] !border-none !mb-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`!w-[30px] !h-[30px] !flex !items-center !justify-center !rounded-2xl ${ticket.status === "Active"
                                                ? "bg-[#DFF5DD]"
                                                : "bg-[#E6F4FF]"
                                                }`}
                                        >
                                            <Image
                                                src={ticket.status === "Active" ? "/wallet-green.svg" : "/wallet-blue.svg"}
                                                alt="wallet status"
                                                width={18}
                                                height={18}
                                            />
                                        </div>
                                        <Tag
                                            className="!rounded-2xl !px-3 !py-1 !font-medium !w-[45px] !h-[14px] !text-[8px] !flex !items-center !text-center"
                                            style={{
                                                backgroundColor: ticket.status === "Active" ? "#DFF5DD" : "#E6F4FF",
                                                color: ticket.status === "Active" ? "#0BA82F" : "#3386FF",
                                                border: "none",
                                            }}
                                        >
                                            {ticket.status}
                                        </Tag>
                                    </div>
                                    <div className="mt-2 ml-9 space-y-1 text-sm">
                                        <Text className="!block !font-medium !text-[#232323]">
                                            Transaction ID - {ticket.id}
                                        </Text>
                                        <Text className="!block !text-[#232323] !font-semibold">
                                            Description - {ticket.desc}
                                        </Text>
                                        <Text className="!block text-gray-600">Mode - {ticket.mode}</Text>
                                        <Text className="!block text-[#232323] font-semibold">Date/Time - {ticket.datetime}</Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal open={isModalOpen} onCancel={handleCancel} footer={null} closable={true} className="!rounded-2xl">
                <Text className="!text-[18px] !font-medium !text-[#3386FF] !mb-3">Support Ticket Form</Text>
                <Form layout="vertical" onFinish={handleSubmit} className="!mt-4 !space-y-3">
                    <Form.Item label="Transaction ID" name="transactionId">
                        <Input placeholder="TXN123456789" className="!rounded-xl !bg-[#F5F5F5]" />
                    </Form.Item>
                    <Form.Item label="Subject" name="subject">
                        <Input placeholder="Transaction Details" className="!rounded-xl !bg-[#F5F5F5]" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input placeholder="Customer reported incorrect transaction amount" className="!rounded-xl !bg-[#F5F5F5]" />
                    </Form.Item>
                    <Form.Item label="Priority" name="priority">
                        <Select defaultValue="low" className="!rounded-xl !bg-[#F5F5F5]">
                            <Select.Option value="low">Low</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="high">High</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button onClick={handleCancel} className="!rounded-xl !px-6 !border !border-[#3386FF] !text-[#3386FF] !w-full">
                            Cancel
                        </Button>
                        <Button htmlType="submit" className="!rounded-xl !px-6 !bg-[#3386FF] !text-white !w-full">
                            Submit Ticket
                        </Button>
                    </div>
                </Form>
            </Modal>
        </DashboardLayout>
    );
}
