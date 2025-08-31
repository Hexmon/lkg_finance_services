'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
import {
    HomeFilled,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { CardLayout } from '@/lib/layouts/CardLayout';

// ---------- Small UI atoms ----------
const Chip = ({
    color = 'blue',
    children,
}: {
    color?: 'blue' | 'green';
    children: React.ReactNode;
}) => {
    const styles =
        color === 'green'
            ? 'bg-[#E9F8EE] text-[#2E7D32] border-[#CDEFD8]'
            : 'bg-[#EAF3FF] text-[#2F6FE4] border-[#C7E0FF]';
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] leading-[14px] font-medium ${styles}`}
        >
            {children}
        </span>
    );
};

const RoundIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3FF] text-[#2F6FE4]">
        {children}
    </div>
);

const GhostIconBtn = ({
    title,
    onClick,
    children,
}: {
    title: string;
    onClick?: () => void;
    children: React.ReactNode;
}) => (
    <Tooltip title={title}>
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md"
        >
            {children}
        </button>
    </Tooltip>
);

// ---------- Address Card (uses your CardLayout) ----------
type AddressCardProps = {
    badge: 'Current' | 'Billing';
    lines: string[]; // each address line
    onEdit?: () => void;
    onDelete?: () => void;
};

function AddressCard({ badge, lines, onEdit, onDelete }: AddressCardProps) {
    const isCurrent = badge === 'Current';

    return (
        <CardLayout
            // "pixel perfect" sizing & visuals
            width="w-full"
            height="h-auto"
            padding="p-4 md:p-5"
            rounded="rounded-2xl"
            elevation={2}
            bordered
            hoverable
            className="shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
            // header / body composed below
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <RoundIcon>
                            <HomeFilled />
                        </RoundIcon>
                        <Chip color={isCurrent ? 'green' : 'blue'}>{badge}</Chip>
                    </div>

                    <div className="flex items-center gap-2">
                        <GhostIconBtn title="Edit" onClick={onEdit}>
                            <EditOutlined style={{ fontSize: 16 }} />
                        </GhostIconBtn>
                        <GhostIconBtn title="Delete" onClick={onDelete}>
                            <DeleteOutlined style={{ fontSize: 16 }} />
                        </GhostIconBtn>
                    </div>
                </div>
            }
            body={
                <div className="mt-2 md:mt-3">
                    {lines.map((line, idx) => (
                        <div
                            key={idx}
                            className="text-[14px] leading-[22px] text-[#4E4E4E]"
                        >
                            {line}
                        </div>
                    ))}
                </div>
            }
        />
    );
}

// ---------- The Address Tab (header button + list of cards) ----------
export default function AddressTab() {
    const addresses: AddressCardProps[] = [
        {
            badge: 'Current',
            lines: [
                'Shri Kanaka Nilaya, Umachankar Nagar 1st Main',
                'Near City Hospital',
                'Rambeenu, Kumbaluru, Karnataka - 560001',
                'India',
            ],
        },
        {
            badge: 'Billing',
            lines: [
                'Plot No. 123, MG Road',
                'Near City Hospital',
                'Bangalore, Bangalore, Karnataka - 560001',
                'India',
            ],
        },
    ];

    return (
        <div className="w-full">
            {/* Top bar with Add Address button */}
            {/* <div className="mb-3 flex items-center justify-end">
                <Button
                    type="primary"
                    className="!h-10 !rounded-xl !bg-[#1677ff] !border-none px-4 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
                >
                    Add Address
                </Button>
            </div> */}

            {/* Subtle separator shadow under the bar (like the screenshot) */}
            <div className="mb-4 h-[10px] w-full rounded-full bg-black/5 blur-[10px] opacity-10" />

            {/* Cards list */}
            <div className="space-y-5">
                {addresses.map((addr, i) => (
                    <AddressCard
                        key={i}
                        {...addr}
                        onEdit={() => console.log('edit', i)}
                        onDelete={() => console.log('delete', i)}
                    />
                ))}
            </div>
        </div>
    );
}
