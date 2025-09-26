/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Form, Input, Button, Alert } from "antd";
import Image from "next/image";
import SmartModal from "@/components/ui/SmartModal";
import {
    useBbpsBillerFetchMutation,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import type {
    BillFetchRequest,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";
import { useRouter } from "next/navigation";
import { useBbpsBillValidationMutation } from "@/features/retailer/retailer_bbps/bbps-online/bill_validation/data/hooks";

type CustomerFormValues = {
    customerName: string;
    mobileNumber: string;
    email?: string;
    idNumber?: string; // PAN or Aadhaar (optional)
};

type InputParam = { paramName: string; paramValue: string };

type AddCustomerModalProps = {
    open: boolean;
    onClose: () => void;
    biller_category: string;
    serviceId: string;
    billerId: string;
    inputParams: InputParam[];
    mode?: "ONLINE" | "OFFLINE";
    /** now raw/unknown by default; you can narrow at call site if you want */
    onSuccess?: (resp: unknown) => void;
    bbps_category_id: string;
    fetchReq: string;             // e.g. "MANDATORY" | "NOT_REQUIRED" | "NOT_SUPPORTED"
    billValidation: string;
    billerAdhoc: boolean;
    ccf1Config?: {
        feeCode?: string;
        flatFee?: string | number;
        feeMaxAmt?: string | number;
        feeMinAmt?: string | number;
        percentFee?: string | number;
        feeDirection?: string;
    } | null;
};

const STORAGE_KEY = "bbps:lastBillFetch";

const MOBILE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
const AADHAAR_REGEX = /^\d{12}$/;

export default function AddCustomerModal({
    open,
    onClose,
    serviceId,
    billerId,
    inputParams,
    mode = "ONLINE",
    onSuccess,
    biller_category,
    bbps_category_id, fetchReq, billValidation, ccf1Config, billerAdhoc
}: AddCustomerModalProps) {
    const [form] = Form.useForm<CustomerFormValues>();
    const [errText, setErrText] = React.useState<string | null>(null);
    const router = useRouter();

    // ⬇️ mutation returns unknown by default; callers can supply a generic later if they want
    const { mutateAsync: billFetchAsync, isPending } = useBbpsBillerFetchMutation<unknown>({
        onError: (e: any) => {
            const raw = e?.data ?? e?.response?.data ?? e?.body ?? e?.payload ?? e?.raw ?? e;
            const pick = (obj: any, key: string) =>
                obj && typeof obj === "object" && typeof obj[key] === "string" ? obj[key] : undefined;

            let msg: string | undefined =
                (typeof raw === "object" && pick(raw, "errorMessage")) ||
                (typeof raw === "object" && raw?.data && pick(raw.data, "errorMessage")) ||
                (typeof raw === "object" && raw?.errorInfo && pick(raw.errorInfo, "errorMessage")) ||
                (typeof raw === "object" && raw?.data?.errorInfo && pick(raw.data.errorInfo, "errorMessage"));

            if (!msg) {
                msg =
                    (typeof raw === "object" && pick(raw, "message")) ||
                    (typeof raw === "object" && raw?.data && pick(raw.data, "message")) ||
                    (typeof raw === "object" && raw?.errorInfo && pick(raw.errorInfo, "message")) ||
                    (typeof raw === "object" && raw?.data?.errorInfo && pick(raw.data.errorInfo, "message")) ||
                    (typeof raw === "object" && pick(raw, "responseMessage")) ||
                    (typeof raw === "object" && raw?.data && pick(raw.data, "responseMessage")) ||
                    (typeof raw === "object" && pick(raw, "respReason")) ||
                    (typeof raw === "string" ? raw : undefined) ||
                    e?.message;
            }

            setErrText(msg || "Something went wrong");
        },
        onSuccess: (data: unknown) => {
            onSuccess?.(data);
        },
    });

    const { mutateAsync: billValidationAsync } = useBbpsBillValidationMutation<unknown>({
        onError: (e: any) => {
            const raw = e?.data ?? e?.response?.data ?? e?.body ?? e?.payload ?? e?.raw ?? e;
            const msg =
                (typeof raw === "object" && (raw?.responseReason || raw?.message)) ||
                (typeof raw === "string" ? raw : undefined) ||
                "Bill validation failed";
            setErrText(String(msg));
        },
    });


    const buildPreflightErrors = (values: CustomerFormValues): string[] => {
        const errors: string[] = [];

        if (!serviceId) errors.push("Missing service ID.");
        if (!billerId) errors.push("Please select a biller.");
        if (!inputParams || (Array.isArray(inputParams) && inputParams.length === 0)) {
            errors.push("Missing biller input parameters.");
        }

        if (!values.mobileNumber || !MOBILE_REGEX.test(values.mobileNumber)) {
            errors.push("Enter a valid 10-digit mobile number.");
        }

        if (values.email && !EMAIL_REGEX.test(values.email)) {
            errors.push("Enter a valid email address.");
        }

        if (values.idNumber) {
            const isPan = PAN_REGEX.test(values.idNumber);
            const isAadhaar = AADHAAR_REGEX.test(values.idNumber);
            if (!isPan && !isAadhaar) {
                errors.push("Enter a valid PAN (e.g., ABCDE1234F) or 12-digit Aadhaar.");
            }
        }

        return errors;
    };

    const submit = async (values: CustomerFormValues) => {
        setErrText(null);

        try {
            await form.validateFields();
        } catch {
            return;
        }

        const errors = buildPreflightErrors(values);
        if (errors.length > 0) {
            setErrText(errors.join("\n"));
            return;
        }

        // Always normalize to an array for both APIs
        const payloadInput: InputParam[] = inputParams.map((p) => ({
            paramName: String(p.paramName ?? ""),
            paramValue: String(p.paramValue ?? ""),
        }));

        // Build customer info (for Bill Fetch only)
        const customerInfo: BillFetchRequest["customerInfo"] = {
            customerMobile: values.mobileNumber,
        };
        if (values.email) customerInfo.customerEmail = values.email;
        if (values.idNumber) customerInfo.customerPan = values.idNumber;
        if (values.customerName) customerInfo.customerName = values.customerName;

        // this will be saved to session — prefer Bill Validation resp if it ran
        let respObj: Record<string, unknown> = {};

        try {
            // 1) If bill fetch is mandatory → Call Bill Fetch first
            if (fetchReq === "MANDATORY") {
                const fetchResp = await billFetchAsync({
                    service_id: serviceId,
                    mode,
                    body: {
                        billerId,
                        customerInfo,
                        inputParams: { input: payloadInput }, // ALWAYS array
                    },
                });
                respObj = (fetchResp ?? {}) as Record<string, unknown>;

                // if Bill Validation is mandatory → run it after bill fetch
                if (billValidation === "MANDATORY") {
                    const validateResp = await billValidationAsync({
                        serviceId,  // BFF needs this to route to `/.../bill-validation/{serviceId}`
                        mode: "ONLINE",
                        body: {
                            billerId,
                            inputParams: { input: payloadInput }, // object | array supported by BFF; we send array
                        },
                    });
                    // per your requirement: store validation response if present
                    respObj = (validateResp ?? {}) as Record<string, unknown>;
                }
            } else {
                // 2) Fetch is NOT mandatory → do NOT call Bill Fetch
                //    Only call Bill Validation if it's mandatory
                if (billValidation === "MANDATORY") {
                    const validateResp = await billValidationAsync({
                        serviceId,
                        mode: "ONLINE",
                        body: {
                            billerId,
                            inputParams: { input: payloadInput },
                        },
                    });
                    respObj = (validateResp ?? {}) as Record<string, unknown>;
                } else {
                    // neither fetch nor validation ran; keep respObj as {}
                }
            }

            // 3) Build a robust payload for the next screen (even if no API was mandatory)
            const requestIdFromApis =
                (respObj as any)?.requestId ??
                (respObj as any)?.data?.requestId ??
                null;

            const fallbackRequestId =
                typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `req_${Date.now()}`;

            const normalizedCcf1 = ccf1Config
                ? {
                    feeCode: ccf1Config.feeCode ?? "CCF1",
                    flatFee: String(ccf1Config.flatFee ?? "0"),
                    percentFee: String(ccf1Config.percentFee ?? "0"),
                    feeMinAmt: String(ccf1Config.feeMinAmt ?? "0"),
                    feeMaxAmt: String(ccf1Config.feeMaxAmt ?? "0"),
                    feeDirection: ccf1Config.feeDirection ?? "C2B",
                }
                : undefined;

            const nextScreenPayload = {
                ...respObj,
                billerAdhoc,
                // baseline fields you already store
                service_id: serviceId,
                billerId,
                customerMobile: values.mobileNumber,
                customerPan: values.idNumber || undefined,
                customerName: values.customerName,
                customerInfo: { customerEmail: values.email || undefined },
                inputParams: { input: payloadInput },
                requestId: requestIdFromApis || fallbackRequestId,

                // 👇 NEW: carry full CCF1 object
                interchangeFeeCCF1: normalizedCcf1,

                // 👇 NEW: also expose flat/percent via amountInfo for the next screen’s existing logic
                amountInfo: {
                    ...(respObj as any)?.amountInfo,             // keep anything API might have set
                    ...(respObj as any)?.data?.amountInfo,       // or nested
                    flatFee: (respObj as any)?.amountInfo?.flatFee
                        ?? (respObj as any)?.data?.amountInfo?.flatFee
                        ?? normalizedCcf1?.flatFee,
                    percentFee: (respObj as any)?.amountInfo?.percentFee
                        ?? (respObj as any)?.data?.amountInfo?.percentFee
                        ?? normalizedCcf1?.percentFee,
                },

                source:
                    fetchReq === "MANDATORY"
                        ? billValidation === "MANDATORY"
                            ? "fetch+validation"
                            : "fetch"
                        : billValidation === "MANDATORY"
                            ? "validation"
                            : "manual",
            };

            if (typeof window !== "undefined") {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextScreenPayload));
            }

            // 4) Bubble up success (so parent can optionally preview)
            onSuccess?.(respObj);

            // 5) Close & navigate
            onClose();
            const safeCategory = encodeURIComponent(biller_category);
            router.push(`/bill_payment/bbps-online/${serviceId}/${safeCategory}/${bbps_category_id}`);

        } catch {
            // onError already handled by hooks → setErrText
        }
    };

    return (
        <SmartModal
            open={open}
            onClose={onClose}
            ariaLabel="add-customer-details"
            centered
            placement="center"
            animation="scale"
            contentClassName="max-w-[40rem]"
            headerClassName="!px-6 !py-4"
            bodyClassName="!px-6 !py-4"
            footerClassName="!px-6 !py-4"
        >
            <SmartModal.Header>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-semibold">Customer Details</h2>
                        <p className="text-[12px] text-[#666]">Customer Input Details</p>
                    </div>
                    <Image src="/logo.svg" alt="logo" width={48} height={48} />
                </div>
            </SmartModal.Header>

            <SmartModal.Body>
                {!!errText && (
                    <Alert className="mb-3 whitespace-pre-line" type="error" showIcon message={errText} />
                )}

                <Form<CustomerFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={submit}
                    initialValues={{ customerName: "", mobileNumber: "", email: "", idNumber: "" }}
                    preserve
                    className="!text-[12px]"
                >
                    <Form.Item
                        label="Customer Name *"
                        name="customerName"
                        rules={[{ required: true, message: "Please enter customer name" }]}
                    >
                        <Input size="large" placeholder="Enter Customer Name" />
                    </Form.Item>

                    <Form.Item
                        label="Customer Mobile Number *"
                        name="mobileNumber"
                        rules={[
                            { required: true, message: "Please enter mobile number" },
                            { pattern: MOBILE_REGEX, message: "Enter a valid 10-digit number" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter Mobile Number" />
                    </Form.Item>

                    <Form.Item
                        label="Customer Email"
                        name="email"
                        rules={[{ type: "email", message: "Enter a valid email" }]}
                    >
                        <Input size="large" placeholder="Enter Email Address" />
                    </Form.Item>

                    <Form.Item label="PAN" name="idNumber">
                        <Input size="large" placeholder="Enter PAN" />
                    </Form.Item>

                    <button type="submit" className="hidden" />
                </Form>
            </SmartModal.Body>

            <SmartModal.Footer>
                <Button onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    type="primary"
                    className="!bg-[#3386FF]"
                    loading={isPending}
                    onClick={() => form.submit()}
                >
                    Proceed
                </Button>
            </SmartModal.Footer>
        </SmartModal>
    );
}
