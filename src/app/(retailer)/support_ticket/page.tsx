"use client";

import { Card, Button, Typography, Tag, Modal, Form, Select, Input } from "antd";
import Image from "next/image";
import { useMemo, useState } from "react";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { useCreateTicket, useGetTickets } from "@/features/support";
import type { GetTicketsQuery } from "@/features/support";

const { Text } = Typography;

type UiTicket = {
    id: string;
    status: "Active" | "Closed";
    desc: string;
    mode: string;
    datetime: string;
};

interface TicketFormValues {
    transactionId: string;
    subject: string;
    description: string;
    priority: "low" | "medium" | "high";
}

export default function SupportTickets() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- server list (useGetTickets) ---
    const query: GetTicketsQuery = useMemo(
        () => ({
            per_page: 10,
            page: 1,
            order: "desc",
            sort_by: "created_at",
            // You can add filters like:
            // status: "OPEN",
            // priority: "HIGH",
            // sr_number: 1003,
        }),
        []
    );

    const { data, isLoading, error, refetch } = useGetTickets(query, true);

    // map API → UI shape
    const serverTickets: UiTicket[] = useMemo(() => {
        const list = data?.data ?? [];
        return list.map((t) => ({
            id: t.ticket_id ?? t.transaction_id ?? "—",
            status: (t.status === "OPEN" || t.status === "IN_PROGRESS" ? "Active" : "Closed") as
                | "Active"
                | "Closed",
            desc: t.description ?? "",
            mode: t.subject ?? "",
            datetime: t.created_at ?? "",
        }));
    }, [data]);

    // optional local-prepend list after create (keeps UX snappy)
    const [localTickets, setLocalTickets] = useState<UiTicket[]>([]);

    const tickets: UiTicket[] = useMemo(
        () => [...localTickets, ...serverTickets],
        [localTickets, serverTickets]
    );

    // --- create ticket ---
    const { createTicketAsync, isLoading: creating } = useCreateTicket();

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleSubmit = async (values: TicketFormValues) => {
        try {
            const res = await createTicketAsync({
                subject: values.subject,
                category: "TRANSACTION",
                description: values.description,
                priority: values.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
                transaction_id: values.transactionId || undefined,
            });

            if (res?.data) {
                // Optimistic local add
                setLocalTickets((prev) => [
                    {
                        id: res.data.ticket_id ?? res.data.transaction_id ?? "—",
                        status: (res.data.status === "OPEN" || res.data.status === "IN_PROGRESS"
                            ? "Active"
                            : "Closed") as "Active" | "Closed",
                        desc: res.data.description ?? "",
                        mode: res.data.subject ?? "",
                        datetime: res.data.created_at ?? new Date().toISOString(),
                    },
                    ...prev,
                ]);
            }

            setIsModalOpen(false);
            // ensure server state is fresh
            refetch();
        } catch (err) {
            console.error("Ticket creation failed:", err);
        }
    };

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/support_ticket"
            pageTitle="Support Ticket"
        >
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

                {isLoading && <Text>Loading tickets…</Text>}
                {(error || false) && <Text type="danger">Failed to load tickets.</Text>}

                <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                        <Card
                            key={`${ticket.id}-${index}`}
                            className="!rounded-2xl !shadow-md !bg-[#FFFFFF] !border-none !mb-5"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`!w-[30px] !h-[30px] !flex !items-center !justify-center !rounded-2xl ${ticket.status === "Active" ? "bg-[#DFF5DD]" : "bg-[#E6F4FF]"
                                                }`}
                                        >
                                            <Image
                                                src={
                                                    ticket.status === "Active" ? "/wallet-green.svg" : "/wallet-blue.svg"
                                                }
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
                                        <Text className="!block text-[#232323] font-semibold">
                                            Date/Time - {ticket.datetime}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {!isLoading && tickets.length === 0 && (
                        <Text type="secondary">No tickets yet. Create your first one!</Text>
                    )}
                </div>
            </div>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                closable
                className="!rounded-2xl"
            >
                <Text className="!text-[18px] !font-medium !text-[#3386FF] !mb-3">
                    Support Ticket Form
                </Text>
                <Form layout="vertical" onFinish={handleSubmit} className="!mt-4 !space-y-3">
                    <Form.Item label="Transaction ID" name="transactionId">
                        <Input placeholder="TXN123456789" className="!rounded-xl !bg-[#F5F5F5]" />
                    </Form.Item>
                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[{ required: true, message: "Subject is required" }]}
                    >
                        <Input placeholder="Transaction Details" className="!rounded-xl !bg-[#F5F5F5]" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Description is required" }]}
                    >
                        <Input
                            placeholder="Customer reported incorrect transaction amount"
                            className="!rounded-xl !bg-[#F5F5F5]"
                        />
                    </Form.Item>
                    <Form.Item label="Priority" name="priority" initialValue="low">
                        <Select className="!rounded-xl !bg-[#F5F5F5]">
                            <Select.Option value="low">Low</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="high">High</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            onClick={handleCancel}
                            className="!rounded-xl !px-6 !border !border-[#3386FF] !text-[#3386FF] !w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            htmlType="submit"
                            loading={creating}
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
