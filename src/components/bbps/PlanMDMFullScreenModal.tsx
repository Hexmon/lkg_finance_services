/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Modal, Input, Button, Empty, Spin, Typography } from "antd";
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

/* ----------------------- utilities ----------------------- */
type PlainTag = { name: string; value: string };

const toPlainTags = (p: any): PlainTag[] => {
    const tag = p?.planAddnlInfo?.paramTag;
    if (!tag) return [];
    if (Array.isArray(tag)) {
        return tag
            .map((t) => ({
                name: String(t?.paramName ?? "").trim(),
                value: String(t?.paramValue ?? "").trim(),
            }))
            .filter((t) => t.name || t.value);
    }
    return [
        {
            name: String(tag?.paramName ?? "").trim(),
            value: String(tag?.paramValue ?? "").trim(),
        },
    ].filter((t) => t.name || t.value);
};

type NormPlan = {
    _raw: any;
    id: string;
    category: string;            // categoryType
    categorySubType?: string;    // shown as "Validity"
    description: string;         // planDesc (fallbacks)
    price: number | null;        // amountInRupees
    status?: string;
    billerId?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
    tags: PlainTag[];
};

const normalize = (p: any): NormPlan => {
    const priceRaw =
        p?.amountInRupees ?? p?.amount ?? p?.rechargeAmount ?? p?.price ?? p?.mrp;
    const price =
        priceRaw == null
            ? null
            : Number.parseFloat(String(priceRaw).replace(/[^\d.]/g, ""));

    return {
        _raw: p,
        id: p?.planId ?? p?.planCode ?? p?.id ?? `${p?.billerId ?? "plan"}-${Math.random()}`,
        category: p?.categoryType || "Plans",
        categorySubType: p?.categorySubType || "-",
        description: p?.planDesc || p?.description || p?.shortDesc || "-",
        price,
        status: p?.status,
        billerId: p?.billerId,
        effectiveFrom: p?.effectiveFrom,
        effectiveTo: p?.effectiveTo,
        tags: toPlainTags(p),
    };
};

/* ----------------------- component ----------------------- */
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
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
    const [selectedRowKey, setSelectedRowKey] = React.useState<string | null>(null);

    const normalized = React.useMemo<NormPlan[]>(
        () => (plans || []).map(normalize),
        [plans]
    );

    const categories = React.useMemo(() => {
        const set = new Set<string>();
        normalized.forEach((n) => n.category && set.add(n.category));
        return Array.from(set);
    }, [normalized]);

    React.useEffect(() => {
        if (!activeCategory && categories.length) setActiveCategory(categories[0]);
    }, [categories, activeCategory]);

    const filtered = React.useMemo(() => {
        const base = normalized.filter((n) =>
            activeCategory ? n.category === activeCategory : true
        );
        if (!query) return base;
        const q = query.toLowerCase();
        return base.filter((n) => {
            const tags = n.tags.map((t) => `${t.name}:${t.value}`).join(" ");
            const hay = [
                n.id,
                n.billerId,
                n.category,
                n.categorySubType,
                n.description,
                n.price?.toString(),
                n.status,
                n.effectiveFrom,
                n.effectiveTo,
                tags,
                JSON.stringify(n._raw ?? {}),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return hay.includes(q);
        });
    }, [normalized, activeCategory, query]);

    return (
        <Modal
            open={open}
            onCancel={mandatory ? undefined : onCancel}
            footer={null}
            closable={!mandatory}
            maskClosable={!mandatory}
            keyboard={!mandatory}
            title={null}
            centered                       // ✅ vertical centering
            width="80vw"
            style={{
                padding: 0,
                height: "80vh",              // keep your requested height
                overflow: "hidden",
                background: "#fff",
            }}
            className="!max-w-none !w-[80vw] !rounded-none"
        >
            {/* HEADER (custom) */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
                <div className="flex items-center gap-3 px-4 py-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <span className="text-sm text-gray-500">({plans?.length ?? 0})</span>
                    <div className="ml-auto flex items-center gap-2">
                        <Input
                            allowClear
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by any field…"
                            prefix={<SearchOutlined />}
                            className="w-[48vw] max-w-[520px]"
                            size="middle"
                        />
                        {!mandatory && (
                            <Button icon={<CloseOutlined />} onClick={onCancel} size="middle">
                                Close
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* BODY */}
            {loading ? (
                <div className="flex h-[calc(80vh-56px)] items-center justify-center">
                    <Spin tip="Loading plans…" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex h-[calc(80vh-56px)] items-center justify-center">
                    <Empty description={query ? `No plans found for “${query}”.` : "No plans available."} />
                </div>
            ) : (
                <div className="flex h-[calc(80vh-56px)] w-full">
                    {/* LEFT: dynamic categoryType rail */}
                    <aside className="w-56 shrink-0 border-r bg-[#F7F9FC] p-3 overflow-y-auto">
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const active = cat === activeCategory;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={[
                                            "w-full text-left px-4 py-3 rounded-xl border transition",
                                            active
                                                ? "bg-[#E6EEFF] border-[#BFD3FF] text-[#246BFD] shadow-[inset_0_0_0_1px_rgba(36,107,253,0.05)]"
                                                : "bg-white hover:bg-[#F0F4FF] border-transparent text-gray-700",
                                        ].join(" ")}
                                    >
                                        <div className="font-medium truncate">{cat}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* RIGHT: plan list (Validity = categorySubType; no TalkTime) */}
                    <section className="flex-1 overflow-auto">
                        {/* header row */}
                        <div className="sticky top-0 z-10 bg-white border-b px-6 py-3">
                            <div className="grid grid-cols-[160px_1fr_140px] gap-4 text-sm font-semibold text-gray-600">
                                <div>Validity</div>
                                <div>Description</div>
                                <div className="text-right pr-2">Price</div>
                            </div>
                        </div>

                        <div className="divide-y">
                            {filtered.map((n) => {
                                const selected = selectedRowKey === n.id;
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => {
                                            setSelectedRowKey(n.id);
                                            onSelect(n._raw as any);
                                        }}
                                        className={[
                                            "w-full text-left px-6 py-4 transition",
                                            selected ? "bg-[#E6EEFF]" : "hover:bg-[#F8FAFF]",
                                        ].join(" ")}
                                    >
                                        <div className="grid grid-cols-[160px_1fr_140px] gap-4 items-start">
                                            {/* Validity -> categorySubType */}
                                            <div>
                                                <div
                                                    className={[
                                                        "inline-flex min-w-[80px] justify-center rounded-xl px-3 py-2",
                                                        selected ? "bg-white" : "bg-[#EEF3FF]",
                                                    ].join(" ")}
                                                >
                                                    <span className="text-base font-semibold text-gray-800">
                                                        {n.categorySubType || "-"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description + tags/dates/status */}
                                            <div className="text-sm text-gray-700">
                                                <div className="line-clamp-2">{n.description}</div>
                                                <div className="mt-1 text-xs text-gray-500 space-x-2">
                                                    {n.tags.map((t, i) => (
                                                        <span key={`${n.id}-tag-${i}`} className="mr-2">
                                                            <span className="font-medium">{t.name}:</span> {t.value}
                                                        </span>
                                                    ))}
                                                    {(n.effectiveFrom || n.effectiveTo) && (
                                                        <span className="block md:inline">
                                                            {n.effectiveFrom ? `From ${n.effectiveFrom}` : ""}
                                                            {n.effectiveTo ? `${n.effectiveFrom ? " · " : ""}To ${n.effectiveTo}` : ""}
                                                        </span>
                                                    )}
                                                    {n.status && <span> · {n.status}</span>}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                {n.price != null ? (
                                                    <span className="text-[#246BFD] font-semibold text-base">
                                                        ₹{Number(n.price).toLocaleString("en-IN")}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">—</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}

            {/* FOOTER */}
            <div className="bg-white/80 backdrop-blur border-t px-4 py-3">
                <Text type="secondary" className="text-xs">
                    {mandatory
                        ? "Plan selection is required for this biller."
                        : "You may close this and continue without selecting a plan."}
                </Text>
            </div>
        </Modal>
    );
}
