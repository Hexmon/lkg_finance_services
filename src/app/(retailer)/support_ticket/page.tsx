"use client";

import { Card, Button, Typography, Tag, Modal, Form, Select, Input,  } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import { useState } from "react";
import { Option } from "antd/es/mentions";
const { Text } = Typography;

interface Ticket {
    id: string;
    status: "Active" | "Closed";
    desc: string;
    mode: string;
    datetime: string;
}

const tickets: Ticket[] = [
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
    {
        id: "TXN123456789",
        status: "Closed",
        desc: "Customer reported incorrect transaction amount",
        mode: "BBPS Offline",
        datetime: "24 Aug 25, 14:30PM",
    },
];

interface TicketFormValues {
  transactionId: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export default function SupportTickets() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
    const handleSubmit = (values: TicketFormValues) => {
        console.log("Form Values:", values);
        setIsModalOpen(false);
    };
    return (
        <DashboardLayout sections={moneyTransferSidebarConfig} activePath="/support_ticket" pageTitle="Support Ticket">
            <DashboardSectionHeader
                title="Raised Tickets"
                titleClassName=" !text-[20px]"
            />
            <div className="px-6 py-4 bg-white rounded-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <Text className="!text-[14px] !font-medium !text-[#3386FF]">
                        Tickets
                    </Text>
                    <Button
                        type="primary"
                        className="!bg-[#3386FF] !rounded-lg !shadow-md !font-medium !text-[12px]"
                        onClick={showModal}
                    >
                        + Create New Ticket
                    </Button>
                </div>

                {/* <Text className="text-base font-medium mb-2 block">Tickets</Text> */}

                {/* Ticket List */}
                <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                        <Card
                            key={index}
                            className="rounded-2xl shadow-md bg-[#FFF9F0] border-none"
                        >
                            <div className="flex justify-between items-start">
                                {/* Ticket Info */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        {/* Wallet Icon with Circle Background */}
                                        <div
                                            className={`w-7 h-7 flex items-center justify-center rounded-full ${ticket.status === "Active"
                                                ? "bg-[#DFF5DD]"
                                                : ticket.status === "Closed"
                                                    ? "bg-[#E6F4FF]"
                                                    : "bg-[#FFF5E6]"
                                                }`}
                                        >
                                            <Image
                                                src={
                                                    ticket.status === "Active"
                                                        ? "/wallet-green.svg"
                                                        : ticket.status === "Closed"
                                                            ? "/wallet-blue.svg"
                                                            : "/wallet-orange.svg"
                                                }
                                                alt="wallet status"
                                                width={16}
                                                height={16}
                                            />
                                        </div>

                                        {/* Status Text Tag */}
                                        <Tag
                                            className="rounded-full px-3 py-1 font-medium"
                                            style={{
                                                backgroundColor:
                                                    ticket.status === "Active"
                                                        ? "#DFF5DD"
                                                        : ticket.status === "Closed"
                                                            ? "#E6F4FF"
                                                            : "#FFF5E6",
                                                color:
                                                    ticket.status === "Active"
                                                        ? "#0BA82F"
                                                        : ticket.status === "Closed"
                                                            ? "#3386FF"
                                                            : "#FA8C16",
                                                border: "none",
                                            }}
                                        >
                                            {ticket.status}
                                        </Tag>
                                    </div>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <Text className="!block !font-medium !text-[#232323]">
                                            Transaction ID - {ticket.id}
                                        </Text>
                                        <Text className="!block !text-[#232323] !font-semibold">
                                            Description - {ticket.desc}
                                        </Text>
                                        <Text className="!block text-gray-600">
                                            Mode - {ticket.mode}
                                        </Text>
                                        <Text className="!block text-[#232323] font-semibold">
                                            Date/Time - {ticket.datetime}
                                        </Text>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Button
                                        shape="circle"
                                        icon={<Image
                                            src="/edit.svg"
                                            alt="edit"
                                            width={16}
                                            height={16}
                                        />}
                                        className="!border-none !shadow-md"
                                    />
                                    <Button
                                        shape="circle"
                                        icon={<Image
                                            src="/delete.svg"
                                            alt="delete"
                                            width={16}
                                            height={16}
                                        />}
                                        className="!border-none !shadow-md"
                                        danger
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                closable={true}
                className="!rounded-2xl"
            >
                <Text className="!text-[18px] !font-medium !text-[#3386FF] !mb-3">
                    Support Ticket Form
                </Text>

                {/* Form */}
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="!mt-4 !space-y-3"
                >
                    <Form.Item label="Transaction ID" name="transactionId">
                        <Input
                            placeholder="TXN123456789"
                            className="!rounded-xl !bg-[#F5F5F5]"
                        />
                    </Form.Item>

                    <Form.Item label="Subject" name="subject">
                        <Input
                            placeholder="Transaction Details"
                            className="!rounded-xl !bg-[#F5F5F5]"
                        />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <Input
                            placeholder="Customer reported incorrect transaction amount"
                            className="!rounded-xl !bg-[#F5F5F5]"
                        />
                    </Form.Item>

                    <Form.Item label="Priority" name="priority">
                        <Select
                            defaultValue="Low"
                            className="!rounded-xl !bg-[#F5F5F5]"
                        >
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            onClick={handleCancel}
                            className="!rounded-xl !px-6 !border !border-[#3386FF] !text-[#3386FF] !w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            htmlType="submit"
                            className="!rounded-xl !px-6 !bg-[#3386FF] !text-white !w-full"
                        >
                            Submit Ticket
                        </Button>
                    </div>
                </Form>
            </Modal>
        </DashboardLayout>
    );
}
