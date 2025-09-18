/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/money-transfer/AddsenderModal.tsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Form, Input, Button, Select } from "antd";
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
    const { error, info, success } = useMessage();

    // Avoid destructuring nested data properties directly (can be undefined mid-flight)
    const {
        addSenderAsync,
        data: addData,
        error: addErr,
        isLoading: addLoading,
    } = useAddSender();

    const {
        verifyOtpOnboardSenderAsync,
        data: verifyData,
        error: verifyErr,
        isLoading: verifyLoading,
    } = useVerifyOtpOnboardSender();

    const ref_id = addData?.ref_id; // for ARTL OTP flow only
    const [form] = Form.useForm();

    // ---------- Error normalizer (prevents React from rendering Error objects) ----------
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

            // ARTL flow → call API here to send OTP
            const res = await addSenderAsync(draft);
            info(res?.message ?? "OTP request sent. Enter the OTP to continue.");
        } catch (err: any) {
            error(getErrorMessage(err) || "Failed to send OTP.");
        }
    }, [addSenderAsync, form, service_id, bankType, router, info, error]);

    // ---------- Verify OTP (Next) for ARTL ----------
    const handleFinish = async () => {
        const { otp, sender_name, pincode, email_address, mobile_no } = form.getFieldsValue(true);

        if (bankType !== "ARTL") return; // FINO doesn't verify OTP here

        if (!ref_id) {
            error("Please send OTP first.");
            return;
        }
        if (!otp) {
            error("Please enter OTP.");
            return;
        }

        try {
            await verifyOtpOnboardSenderAsync({
                ref_id,
                otp,
                sender_name,
                pincode,
                email_address,
                mobile_no,
                service_id,
            });

            success("OTP Verified!");
        } catch (e) {
            error("OTP verification failed. Please try again.");
        }
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
                                        { required: true, message: "Please enter OTP" },
                                        { pattern: /^\d{4,6}$/, message: "Enter 4–6 digit OTP" },
                                    ]}
                                    style={{ marginBottom: 0 }}
                                    className="flex-1"
                                >
                                    <Input placeholder="Enter OTP" maxLength={6} inputMode="numeric" className="!h-[42px]" />
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
                        loading={verifyLoading}
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
