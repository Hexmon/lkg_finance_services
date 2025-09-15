/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import SmartModal from "@/components/ui/SmartModal";
import { Input, Button, Empty, Spin, Tag, Typography } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import type { Plan } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

const { Text } = Typography;

type Props = {
    open: boolean;
    mandatory?: boolean;
    loading?: boolean;
    plans: Plan[];
    onSelect: (plan: Plan) => void;
    onCancel?: () => void; // Ignored when mandatory
    title?: string;
};

export default function PlanMDMFullScreenModal({
    open,
    mandatory = false,
    loading = false,
    plans,
    onSelect,
    onCancel,
    title = "Select a Plan",
}: Props) {
    const [query, setQuery] = React.useState("");

    const filtered = React.useMemo(() => {
        if (!query) return plans;
        const q = query.toLowerCase();
        return plans.filter((p: any) => {
            const hay =
                [
                    p?.planName,
                    p?.shortDesc,
                    p?.longDesc,
                    p?.description,
                    p?.planCode,
                    p?.planId,
                    p?.amount,
                    p?.rechargeAmount,
                    p?.category,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase() || JSON.stringify(p).toLowerCase();
            return hay.includes(q);
        });
    }, [plans, query]);

    return (
        <SmartModal
            open={open}
            onClose={mandatory ? undefined : onCancel}
            ariaLabel={title}
            animation="slide-up"
            centered={false}
            placement="top"
            maxHeight="100vh"
            // Full screen look
            containerClassName="px-0 py-0"
            contentClassName="w-screen h-screen max-w-none rounded-none"
            headerClassName="sticky top-0 z-10 bg-white/90 backdrop-blur border-b"
            bodyClassName="p-0"
            footerClassName="bg-white/80 backdrop-blur"
            closeOnBackdrop={!mandatory}
            closeOnEsc={!mandatory}
            zIndex={1100}
        >
            {/* HEADER */}
            <SmartModal.Header>
                <div className="flex items-center gap-3 px-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <span className="text-sm text-gray-500">({plans?.length ?? 0})</span>
                    <div className="ml-auto flex items-center gap-2">
                        <Input
                            allowClear
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search plans…"
                            prefix={<SearchOutlined />}
                            className="w-[48vw] max-w-[520px]"
                            size="middle"
                        />
                        {!mandatory && (
                            <Button
                                icon={<CloseOutlined />}
                                onClick={onCancel}
                                type="default"
                                size="middle"
                            >
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </SmartModal.Header>

            {/* BODY */}
            <SmartModal.Body className="p-0">
                {loading ? (
                    <div className="flex h-[70vh] items-center justify-center">
                        <Spin tip="Loading plans…" />
                    </div>
                ) : (filtered?.length ?? 0) === 0 ? (
                    <div className="flex h-[70vh] items-center justify-center">
                        <Empty description={query ? `No plans found for “${query}”.` : "No plans available."} />
                    </div>
                ) : (
                    <div className="divide-y">
                        {filtered.map((p: any, idx: number) => {
                            const name = p?.planName ?? p?.shortDesc ?? p?.description ?? "Unnamed Plan";
                            const code = p?.planCode ?? p?.planId ?? p?.id ?? "-";
                            const amount = p?.amount ?? p?.rechargeAmount ?? p?.price ?? p?.mrp ?? null;
                            const validity = p?.validity ?? p?.validityDays ?? p?.tenure ?? null;
                            const status = p?.status;

                            return (
                                <div
                                    key={`${code}-${idx}`}
                                    className="group p-4 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="truncate text-base font-medium">{name}</div>
                                                <Tag>{String(code)}</Tag>
                                                {status && (
                                                    <Tag color={status === "ACTIVE" ? "green" : "default"}>
                                                        {status}
                                                    </Tag>
                                                )}
                                            </div>

                                            <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                {p?.longDesc || p?.description || p?.shortDesc || "—"}
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                                {amount != null && (
                                                    <Text strong>
                                                        ₹ {Number(amount).toLocaleString("en-IN")}
                                                    </Text>
                                                )}
                                                {validity && <Tag color="blue">Validity: {validity}</Tag>}
                                                {p?.category && <Tag color="purple">{p.category}</Tag>}
                                                {p?.effectiveFrom && (
                                                    <Text type="secondary" className="text-xs">
                                                        From: {new Date(p.effectiveFrom).toLocaleDateString()}
                                                    </Text>
                                                )}
                                                {p?.effectiveTo && (
                                                    <Text type="secondary" className="text-xs">
                                                        To: {new Date(p.effectiveTo).toLocaleDateString()}
                                                    </Text>
                                                )}
                                            </div>

                                            <details className="mt-3">
                                                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                                                    View raw plan JSON
                                                </summary>
                                                <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-3 text-[11px] leading-relaxed">
                                                    {JSON.stringify(p, null, 2)}
                                                </pre>
                                            </details>
                                        </div>

                                        <Button
                                            type="primary"
                                            onClick={() => onSelect(p)}
                                        >
                                            Choose
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </SmartModal.Body>

            {/* FOOTER */}
            <SmartModal.Footer>
                <Text type="secondary" className="text-xs">
                    {mandatory
                        ? "Plan selection is required for this biller."
                        : "You may close this and continue without selecting a plan."}
                </Text>
            </SmartModal.Footer>
        </SmartModal>
    );
}
