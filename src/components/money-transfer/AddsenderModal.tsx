/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/money-transfer/AddsenderModal.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import type { InputRef } from "antd";
import { useRouter } from "next/navigation";
import SmartModal from "@/components/ui/SmartModal";
import { useAddSender, useVerifyOtpOnboardSender } from "@/features/retailer/dmt/sender";
import { useMessage } from "@/hooks/useMessage";

type BankType = "ARTL" | "FINO";

type Props = {
    open: boolean;
    onClose: () => void;
    service_id: string;
    bankType: BankType; // strictly typed
};

const TXN_OPTIONS = [
    { label: "IMPS", value: "IMPS" },
    { label: "NEFT", value: "NEFT" },
] as const;

const BANK_OPTIONS = [
    { label: "ARTL", value: "ARTL" },
    { label: "FINO", value: "FINO" },
] as const;

const draftKey = (service_id: string) => `sender:onboard:draft:${service_id}`;

export default function AddsenderModal({
    open,
    service_id,
    onClose,
    bankType,
}: Props) {
    const router = useRouter();
    const { error, info } = useMessage();

    const {
        addSenderAsync,
        data: addData,
        error: addErr,
        isLoading: addLoading,
    } = useAddSender();

    // NOTE: not used for ARTL “Next” anymore, but kept for type parity
    const {
        verifyOtpOnboardSenderAsync,
        data: verifyData,
        error: verifyErr,
        isLoading: verifyLoading,
    } = useVerifyOtpOnboardSender();

    const [form] = Form.useForm();

    // ---- helpers to read various API shapes (UAT/prod differences) ----
    const extractRefId = (r: any): string | null =>
        r?.data?.ref_id ??
        r?.ref_id ??
        r?.data?.refId ??
        r?.refId ??
        r?.data?.reference_id ??
        r?.reference_id ??
        null;

    const extractMessage = (r: any): string | undefined =>
        r?.data?.message ?? r?.message;

    const extractOtp = (r: any): string | undefined =>
        r?.otp ?? r?.data?.otp;

    // --- keep OTP/ref state locally for ARTL flow ---
    const [otpSent, setOtpSent] = useState(false);
    const [refId, setRefId] = useState<string | null>(null);
    const otpInputRef = useRef<InputRef>(null);

    // If the mutation returns a ref id later, sync it (defensive)
    useEffect(() => {
        const rid = extractRefId(addData);
        if (rid && !refId) setRefId(rid);
    }, [addData, refId]);

    // Reset local state on modal close/open toggle
    useEffect(() => {
        if (!open) {
            setOtpSent(false);
            setRefId(null);
            form.resetFields();
        }
    }, [open, form]);

    // ---------- Error normalizer ----------
    const getErrorMessage = (err: any): string => {
        if (!err) return "Something went wrong.";
        if (typeof err === "string") return err;
        if (err?.message) return err.message;
        if (err?.data?.error?.message) return err.data.error.message;
        try {
            return JSON.stringify(err);
        } catch {
            return "Something went wrong.";
        }
    };

    const hasMutationError = useMemo(() => Boolean(addErr) || Boolean(verifyErr), [addErr, verifyErr]);

    // ---------- Send OTP / or redirect for FINO ----------
    const handleSendOtp = useCallback(async () => {
        try {
            // Validate common (non-biometric) fields
            const baseFields = [
                "sender_name",
                "mobile_no",
                "address",
                "email_address",
                "pincode",
                "txnType",
                "bankId",
            ] as const;

            const values = await form.validateFields(baseFields as any);

            // Lock bank type from prop
            const draft = {
                ...values,
                bankId: bankType,
                service_id,
            };

            if (bankType === "FINO") {
                // Save draft and go to onboarding to collect Aadhaar + BioPID
                if (typeof window !== "undefined") {
                    sessionStorage.setItem(draftKey(service_id), JSON.stringify(draft));
                }
                router.push(`/money_transfer/service/${service_id}/sender_onboarding`);
                return;
            }

            // --- ARTL flow: Send OTP ---
            const res = await addSenderAsync(draft);

            // Pick data from nested shape
            const rid = extractRefId(res);
            const msg = extractMessage(res) ?? "OTP sent. Please enter the OTP.";
            const otpFromApi = extractOtp(res); // UAT often returns this

            if (rid) {
                setRefId(rid);
                setOtpSent(true); // enable OTP box
                // toast
                info(msg);

                // Autofill OTP if backend returns it (useful on UAT/dev; remove if not desired)
                if (otpFromApi) {
                    form.setFieldsValue({ otp: String(otpFromApi) });
                }

                // focus OTP input
                setTimeout(() => otpInputRef.current?.focus(), 0);
            } else {
                // Fallback if API didn't return ref id
                setOtpSent(false);
                setRefId(null);
                error("Could not retrieve reference ID. Please try sending OTP again.");
            }
        } catch (err: any) {
            setOtpSent(false);
            setRefId(null);
            error(getErrorMessage(err) || "Failed to send OTP.");
        }
    }, [addSenderAsync, form, service_id, bankType, router, info, error]);

    // ---------- Next: for ARTL, just stash and navigate (NO API CALL HERE) ----------
    const handleFinish = async () => {
        if (bankType !== "ARTL") return; // FINO doesn't verify OTP here

        const {
            otp,
            sender_name,
            pincode,
            email_address,
            mobile_no,
            address,
            txnType,
            bankId,
        } = form.getFieldsValue(true);

        if (!refId) {
            error("Please send OTP first.");
            return;
        }
        if (!otp) {
            error("Please enter OTP.");
            return;
        }

        // Stash draft + ref/otp for onboarding page (where Aadhaar will be collected)
        if (typeof window !== "undefined") {
            const draft = {
                sender_name,
                pincode,
                email_address,
                mobile_no,
                address,
                txnType,
                bankId: bankType, // lock from prop
                service_id,
                ref_id: refId,
                otp: String(otp),
            };
            sessionStorage.setItem(draftKey(service_id), JSON.stringify(draft));
        }

        // 👉 Navigate to onboarding page; it will collect Aadhaar & call verify API
        router.push(`/money_transfer/service/${service_id}/sender_onboarding`);
    };

    return (
        <SmartModal
            open={open}
            onClose={onClose}
            ariaLabel="Add Sender"
            animation="scale"
            centered
            contentClassName="max-w-[560px]"
            closeOnBackdrop={false}
            closeOnEsc={false}
        >
            <SmartModal.Header>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Add Sender</span>
                    <Button
                        type="default"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <span className="text-xl leading-none">×</span>
                    </Button>
                </div>
            </SmartModal.Header>

            <SmartModal.Body className="px-8">
                <Form
                    id="add-sender-form"
                    form={form}
                    layout="vertical"
                    className="w-full"
                    onFinish={handleFinish}
                    initialValues={{
                        txnType: "IMPS",
                        bankId: bankType || "ARTL",
                    }}
                >
                    <Form.Item
                        label="Sender Name"
                        name="sender_name"
                        rules={[{ required: true, message: "Please enter Sender Name" }]}
                    >
                        <Input placeholder="Sender Name" autoFocus />
                    </Form.Item>

                    <Form.Item
                        label="Mobile No"
                        name="mobile_no"
                        rules={[
                            { required: true, message: "Please enter Mobile No" },
                            { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
                        ]}
                    >
                        <Input placeholder="Enter Sender Mobile No" maxLength={10} inputMode="numeric" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please enter Address" }]}
                    >
                        <Input placeholder="Enter Sender address" />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email_address"
                        rules={[
                            { required: true, message: "Please enter Email Address" },
                            { type: "email", message: "Enter a valid email address" },
                        ]}
                    >
                        <Input placeholder="Enter Sender email address" />
                    </Form.Item>

                    <Form.Item
                        label="Pincode"
                        name="pincode"
                        rules={[
                            { required: true, message: "Please enter pincode" },
                            { pattern: /^\d{6}$/, message: "Enter valid 6-digit pincode" },
                        ]}
                    >
                        <Input placeholder="Enter Sender Pincode" maxLength={6} inputMode="numeric" />
                    </Form.Item>

                    <Form.Item
                        label="Transaction Type"
                        name="txnType"
                        rules={[{ required: true, message: "Please select Transaction Type" }]}
                    >
                        <Select placeholder="Select Txn Type" options={TXN_OPTIONS as any} />
                    </Form.Item>

                    <Form.Item
                        label="Bank"
                        name="bankId"
                        rules={[{ required: true, message: "Please select Bank" }]}
                    >
                        <Select placeholder="Select Bank" options={BANK_OPTIONS as any} />
                    </Form.Item>

                    {/* FINO biometric fields are moved to onboarding page */}
                    {/* OTP area only relevant for ARTL */}
                    {bankType !== "FINO" && (
                        <Form.Item label="OTP" style={{ marginBottom: 0 }}>
                            <div className="flex items-center gap-3 w-full">
                                <Form.Item
                                    name="otp"
                                    rules={[
                                        { required: otpSent, message: "Please enter OTP" }, // required only after sending
                                        { pattern: /^\d{4,6}$/, message: "Enter 4–6 digit OTP" },
                                    ]}
                                    style={{ marginBottom: 0 }}
                                    className="flex-1"
                                >
                                    <Input
                                        ref={otpInputRef}
                                        placeholder={otpSent ? "Enter OTP" : "Send OTP to enable"}
                                        maxLength={6}
                                        inputMode="numeric"
                                        className="!h-[42px]"
                                        disabled={!otpSent}
                                    />
                                </Form.Item>

                                <Button
                                    type="default"
                                    size="large"
                                    style={{ height: 42 }}
                                    disabled={addLoading}
                                    loading={addLoading}
                                    onClick={handleSendOtp}
                                >
                                    Send OTP
                                </Button>
                            </div>
                            {/* Helper text: show ref id once obtained */}
                            {otpSent && refId && (
                                <div className="mt-1 text-xs text-gray-500">Reference ID: {refId}</div>
                            )}
                        </Form.Item>
                    )}

                    {hasMutationError && (
                        <div className="mt-2 text-sm text-red-500">
                            {getErrorMessage(addErr ?? verifyErr)}
                        </div>
                    )}
                </Form>
            </SmartModal.Body>

            <SmartModal.Footer>
                {bankType !== "FINO" ? (
                    <Button
                        type="primary"
                        htmlType="submit"
                        form="add-sender-form"
                        size="large"
                        className="!bg-[#3386FF] w-[30%] !mx-auto"
                        loading={false}
                        disabled={!otpSent} // Next enabled only after OTP sent
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        className="!bg-[#3386FF] w-[30%] !mx-auto"
                        onClick={handleSendOtp}
                        loading={addLoading}
                    >
                        Continue
                    </Button>
                )}
            </SmartModal.Footer>
        </SmartModal>
    );
}
