// src/app/(dashboard)/money-transfer/beneficiaries/page.tsx
"use client";

import React from "react";
import { Button, Typography, Avatar, Tooltip } from "antd";
import {
    PlusOutlined,
    SwapOutlined,
    UserOutlined,
    WalletOutlined,
    ReloadOutlined,
    CreditCardOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useRouter } from "next/navigation";
import { useCheckSender, type Beneficiary, type Sender } from "@/features/retailer/dmt/sender";

const { Title, Text } = Typography;

type BeneficiaryManagementPageProps = {
    service_id: string,
    beneficiaries: Beneficiary[],
    sender: Sender | undefined,
}

export default function BeneficiaryManagementPage({ service_id, beneficiaries, sender }: BeneficiaryManagementPageProps) {
    const router = useRouter();

    const { checkSenderAsync, data, error: checkSenderRegError, isLoading: checkSenderRegLoading } = useCheckSender();
    const { mobile_no, sender_id, sender_name, beneficiary_count, email_address, pincode } = sender || {}

    return (
        <CardLayout
            width="w-full max-w-6xl mx-auto"
            height="h-auto"
            padding="p-0"
            bgColor="bg-transparent"
            elevation={0}
            className="px-5 pb-14 pt-6 !bg-[#FFFFFF]"
            header={
                <div className="flex items-start justify-between">
                    <div className="mb-6">
                        <Title level={4} className="!mb-1 !text-[20px] !font-semibold !leading-6">
                            Beneficiary Management
                        </Title>
                        <Text className="!text-gray-500">Manage your saved beneficiaries</Text>
                    </div>

                    <Button
                        type="primary"
                        size="middle"
                        icon={<PlusOutlined />}
                        className="rounded-full !px-4 !py-2 !h-[36px]"
                    >
                        Add Beneficiary
                    </Button>
                </div>
            }
            body={
                <>
                    {/* ---- Saved Accounts + Sender Button + Stats (all with CardLayout) ---- */}
                    <CardLayout
                        className="!px-5 !py-4 shadow-sm w-full"
                        size="lg"
                        width="w-full"
                        rounded="rounded-2xl"
                        divider
                        header={
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <div className="text-[18px] font-semibold text-gray-900">
                                        {sender_name} Saved Accounts
                                    </div>
                                    <div className="mt-1 text-[12px] text-gray-500">
                                        Sender’s Mobile No. <span className="tabular-nums">{mobile_no}</span>
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    icon={<SwapOutlined />}
                                    className="rounded-full !px-4 !py-2 !h-[36px] bg-[#3B82F6] hover:!bg-[#2767d8]"
                                    onClick={() => { router.push(`/money_transfer/service/${service_id}`) }}
                                >
                                    Change Sender
                                </Button>
                            </div>
                        }
                        body={
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <StatCard title="Beneficiary" value={beneficiary_count} icon={<UserOutlined />} />

                                <StatCard
                                    title="Total Limit"
                                    value="25,0000"
                                    icon={<WalletOutlined />}
                                    titleAddon={
                                        <Tooltip title="Daily/overall limit allotted">
                                            <CreditCardOutlined className="text-[12px] text-gray-400" />
                                        </Tooltip>
                                    }
                                />

                                <StatCard title="Remaining Limit" value="25,0000" icon={<ReloadOutlined />} />
                            </div>
                        }
                    />

                    {/* ---- Beneficiary Cards Grid (each is a CardLayout) ---- */}
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {(beneficiaries ?? []).map((b) => {
                            const { beneficiary_id } = b || {}
                            return (
                                <BeneficiaryCard key={beneficiary_id} b={b} />
                            )
                        })}
                    </div>
                </>
            }
        />
    );
}

/* ------------------------------- Sub-UI ------------------------------- */

function StatCard({
    title,
    value,
    icon,
    titleAddon,
}: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    titleAddon?: React.ReactNode;
}) {
    return (
        <CardLayout
            className="!p-3 rounded-xl border border-gray-100 shadow-sm"
            elevation={1}
            header={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                        {icon}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[12px] text-gray-500">{title}</div>
                        {titleAddon}
                    </div>
                </div>
            }
            body={
                <div className="mt-1 tabular-nums text-[18px] font-semibold tracking-tight text-gray-900">
                    {value}
                </div>
            }
        />
    );
}

function BeneficiaryCard({ b }: { b: Beneficiary }) {
    const {b_mobile, b_name, bankname, beneficiary_id, lastfour, status} = b || {}
    return (
        <CardLayout
            className="!p-4 rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] border border-gray-100"
            elevation={1}
            header={
                <div className="flex items-center gap-3">
                    <Avatar
                        size={44}
                        icon={<UserOutlined />}
                        className="!bg-[#EEF3FF] !text-[#3B82F6]"
                    />
                    <div className="min-w-0">
                        <div className="truncate text-[14px] font-semibold text-gray-900">
                            {b_name}
                        </div>
                        <div className="text-[12px] text-gray-500">{bankname}</div>
                    </div>
                </div>
            }
            body={
                <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-[80px_1fr] items-center">
                        <div className="text-[12px] text-gray-500">Account:</div>
                        <div className="text-[13px] font-medium tracking-wider text-gray-900">••••{lastfour}</div>
                    </div>

                    <div className="grid grid-cols-[80px_1fr] items-center">
                        <div className="text-[12px] text-gray-500">Mobile:</div>
                        <div className="text-[13px] font-medium text-gray-900">{b_mobile}</div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <Button
                            type="primary"
                            size="small"
                            className="!h-[26px] flex-1 !rounded-full !text-xs !font-semibold bg-[#3B82F6] hover:!bg-[#2767d8]"
                        >
                            Send
                        </Button>

                        <button
                            aria-label="view"
                            className="grid h-6 w-6 place-content-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                        >
                            <EyeOutlined className="text-[12px] text-gray-600" />
                        </button>
                    </div>
                </div>
            }
        />
    );
}
