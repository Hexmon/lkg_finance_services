"use client";

import React, { useState, useMemo } from "react";
import { Card, Typography, Form, Input, Button, Table, Modal } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { useBankAccounts } from "@/features/retailer/bank_account/data/hooks";
import { useAppSelector, selectUserId } from "@/lib/store";
import SmartSelect from "@/components/ui/SmartSelect";
import { useCreatePayout } from "@/features/wallet/data/hooks";
// NOTE: we keep the import, but we won't *require* it to run
import { useWalletStatement } from "@/features/retailer/wallet/data/hooks";
import type { WalletStatementQuery } from "@/features/retailer/wallet/domain/types";

const { Text } = Typography;

type FormValues = {
    amount: number;
    transferMode: string;
};

export default function BankWithdrawalPage() {
    const [form] = Form.useForm<FormValues>();

    const userId = useAppSelector(selectUserId) || "";
    const { data: { data: accData } = {}, isLoading: accListLoading } = useBankAccounts(
        userId,
        !!userId
    );

    // Map API data to the card UI shape (no UI change in the section)
    const uiAccounts = useMemo(
        () =>
            (accData ?? []).map((r) => ({
                id: r.account_id, // string UUID (will be sent as account_id in payload)
                name: r.account_holder_name,
                bank: r.bank_name,
                account: r.last4 ? `•••• ${r.last4}` : "••••",
                ifsc: r.ifsc_code,
            })),
        [accData]
    );

    // selected account_id from cards
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // transfer mode via SmartSelect
    const [mode, setMode] = useState<string | null>(null);

    // submit/lock state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // hook: create payout
    const createPayout = useCreatePayout();

    // live values for gating the Submit button
    const amountVal = Form.useWatch("amount", form);
    const isAmountValid = (() => {
        const n = typeof amountVal === "number" ? amountVal : parseFloat(amountVal || "");
        return Number.isFinite(n) && n > 0;
    })();

    const isBusy = isSubmitting || createPayout.isPending;
    const canSubmit = Boolean(selectedId && mode && isAmountValid && !isBusy);

    const handleSubmit = (values: FormValues) => {
        if (!canSubmit || !selectedId || !mode) return;
        setIsSubmitting(true);

        createPayout.mutate(
            {
                account_id: selectedId,
                mode: (mode || "").toUpperCase() as any, // IMPS | NEFT | RTGS
                amount: String(values.amount),
            },
            {
                onSuccess: (res) => {
                    Modal.success({
                        title: "Transaction Successful",
                        content: res?.message || `₹${values.amount} has been transferred successfully.`,
                        centered: true,
                        zIndex: 9999,
                    });
                    // keep disabled after submit (per your rule)
                },
                onError: (err: any) => {
                    const msg =
                        err?.data?.error?.message ||
                        err?.data?.message ||
                        err?.message ||
                        "Payout failed";
                    Modal.error({
                        title: "Transaction Failed",
                        content: String(msg),
                        centered: true,
                        zIndex: 9999,
                    });
                    setIsSubmitting(false); // re-enable to allow retry
                },
            }
        );
    };

    const transferModeOptions = useMemo(
        () => [
            { label: "IMPS", value: "IMPS" },
            { label: "NEFT", value: "NEFT" },
            { label: "RTGS", value: "RTGS" },
        ],
        []
    );

    /* =========================
       Wallet Statement — NO balance_id required
       ========================= */
    // If you ever get a balance_id from elsewhere (e.g., selected wallet),
    // set it here; otherwise we simply don't call the hook.
    const inferredBalanceId: string | undefined = undefined; // <- stays undefined (no need for balance_id)

    const statementQuery: WalletStatementQuery | undefined = useMemo(() => {
        if (!inferredBalanceId) return undefined;
        return {
            balance_id: inferredBalanceId,
            per_page: 10,
            page: 1,
            order: "desc",
            sort_by: "created_at",
        };
    }, [inferredBalanceId]);

    const { data: statement, isLoading: statementLoading } = useWalletStatement(
        // When there's no balance_id, pass any to satisfy TS but keep enabled=false so it never calls.
        (statementQuery as WalletStatementQuery) ?? ({} as any),
        Boolean(statementQuery?.balance_id)
    );

    // Convert statement rows to the table’s expected shape (no UI changes)
    const transactionData = useMemo(
        () =>
            ((statement?.data as any[]) ?? []).map((row: any, idx: number) => ({
                key: String(idx),
                txnId: row.txn_id,
                date: row.created_at,
                amount:
                    typeof row.balance === "number"
                        ? `₹${row.balance}`
                        : `₹${row.balance ?? ""}`,
                category: row.txn_type,
                status: row.txn_status,
            })),
        [statement]
    );

    return (
        <DashboardLayout
            activePath="/wallet"
            sections={billPaymentSidebarConfig}
            pageTitle="Bank Withdrawal"
            isLoading={accListLoading}
        >
            <DashboardSectionHeader title="" />

            <div className="p-6 min-h-screen !mt-0">
                {/* Bank Withdrawal Form */}
                <Card className="!rounded-2xl !shadow-md !mb-6">
                    <Text className="!text-[15px] !font-medium">Bank Withdrawal</Text>

                    {/* Bank Accounts Section (UI unchanged; now uses api data) */}
                    <div className="flex gap-6 mt-8 flex-wrap mb-6 justify-center items-center">
                        {uiAccounts.map((acc) => (
                            <div
                                key={acc.id}
                                onClick={() => !isBusy && setSelectedId(acc.id)}
                                className={`flex items-start gap-4 border rounded-2xl p-4 w-[280px] cursor-pointer transition ${selectedId === acc.id ? "border-blue-500 shadow-md" : "border-gray-200"
                                    } ${isBusy ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        {/* Avatar */}
                                        <div className="bg-[#5298FF54] rounded-full w-[55px] h-[55px] flex items-center justify-center shrink-0">
                                            <Image
                                                src="/person-blue.svg"
                                                alt="person image"
                                                width={28}
                                                height={28}
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Name + Bank */}
                                        <div className="flex flex-col ml-3">
                                            <Text strong className="text-[15px]">{acc.name}</Text>
                                            <Text type="secondary" className="text-[14px]">{acc.bank}</Text>
                                        </div>

                                        {/* Right Tick */}
                                        <Image
                                            src={selectedId === acc.id ? "/tick-blue.svg" : "/tick-gray.svg"}
                                            alt="tick"
                                            width={15}
                                            height={15}
                                            className="ml-6"
                                        />
                                    </div>

                                    {/* Account & IFSC */}
                                    <div className="mt-3 space-y-1">
                                        <div className="flex justify-between">
                                            <Text type="secondary">Account:</Text>
                                            <Text className="font-semibold">{acc.account}</Text>
                                        </div>
                                        <div className="flex justify-between">
                                            <Text type="secondary">IFSC Code:</Text>
                                            <Text strong>{acc.ifsc}</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transfer Form */}
                    <Form<FormValues>
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="!text-[13px]"
                    >
                        <Form.Item
                            label={<span className="text-[15px] font-semibold leading-8">Transfer Mode</span>}
                            name="transferMode"
                            rules={[{ required: true, message: "Please select transfer mode" }]}
                        >
                            {/* SmartSelect — single, non-searchable */}
                            <SmartSelect
                                options={[
                                    { label: "IMPS", value: "IMPS" },
                                    { label: "NEFT", value: "NEFT" },
                                    { label: "RTGS", value: "RTGS" },
                                ]}
                                value={mode}
                                onChange={(val) => {
                                    setMode((val as string | null) ?? null);
                                    form.setFieldsValue({
                                        transferMode: (val as string | null) ?? undefined,
                                    });
                                }}
                                placeholder="Select Mode"
                                disabled={isBusy}
                                allowClear={false}
                                dense
                                popupMatchSelectWidth
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[15px] font-semibold leading-8">Enter Amount *</span>}
                            name="amount"
                            rules={[{ required: true, message: "Please enter amount" }]}
                        >
                            <Input size="large" placeholder="Enter Amount" disabled={isBusy} />
                        </Form.Item>

                        {/* Note */}
                        <Text type="secondary" className="block mb-4 !text-[12px]">
                            <span className="font-semibold text-black mr-1">Please Note:</span>
                            <ul className="list-disc ml-6">
                                <li>
                                    IMPS Service Will Charge for real-time settlement. It will charge ₹5 for less than
                                    25000 and ₹15 for upto 2lac.
                                </li>
                                <li>NEFT/IMPS Charges Waived.</li>
                            </ul>
                        </Text>

                        {/* Buttons */}
                        <div className="flex gap-4 justify-center items-center">
                            <Button
                                size="large"
                                className="!px-8 !h-[33px] !w-[199px]"
                                onClick={() => form.resetFields()}
                                disabled={isBusy}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="!bg-[#3386FF] !px-8 !h-[33px] !w-[199px]"
                                disabled={!canSubmit}
                                title={
                                    !selectedId
                                        ? "Select a bank account"
                                        : !mode
                                            ? "Select transfer mode"
                                            : !isAmountValid
                                                ? "Enter a valid amount"
                                                : undefined
                                }
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* Transaction History */}
                <Card className="!rounded-2xl !shadow-md">
                    <Text className="!text-[15px] !font-medium mb-4 block">Paypoint History</Text>
                    <Table
                        dataSource={transactionData /* empty if no balance_id — no UI change */}
                        columns={[
                            {
                                title: "Transaction ID",
                                dataIndex: "txnId",
                                key: "txnId",
                                render: (txnId: string) => (
                                    <span className="text-[#232323] font-medium text-[14px]">{txnId}</span>
                                ),
                            },
                            {
                                title: "Date & Time",
                                dataIndex: "date",
                                key: "date",
                                render: (date: string) => (
                                    <span className="text-[#9A9595] font-medium text-[14px]">{date}</span>
                                ),
                            },
                            {
                                title: "Amount",
                                dataIndex: "amount",
                                key: "amount",
                                render: (amount: string) => (
                                    <span className="text-[#232323] font-medium text-[14px]">{amount}</span>
                                ),
                            },
                            {
                                title: "Category",
                                dataIndex: "category",
                                key: "category",
                                render: (category: string) => (
                                    <span className="text-[#232323] font-medium text-[14px]">{category}</span>
                                ),
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "status",
                                render: (status: string) => (
                                    <span className="text-[#0BA82F] font-medium bg-[#0BA82F36] px-2 py-1 rounded-2xl text-[12px]">
                                        {status}
                                    </span>
                                ),
                            },
                        ]}
                        pagination={false}
                        bordered={false}
                        loading={statementLoading /* false when no balance_id */}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
