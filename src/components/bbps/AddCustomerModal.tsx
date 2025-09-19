"use client";

import React from "react";
import { Form, Input, Button, Alert } from "antd";
import Image from "next/image";
import SmartModal from "@/components/ui/SmartModal";
import { useBbpsBillerFetchMutation } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";
import type { BillFetchResponse } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";
import { useRouter } from "next/navigation";

type CustomerFormValues = {
    customerName: string;
    mobileNumber: string;
    email?: string;
    idNumber?: string;
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
    onSuccess?: (resp: BillFetchResponse) => void;
    bbps_category_id: string;
};

const STORAGE_KEY = "bbps:lastBillFetch"; // <- namespaced sessionStorage key

export default function AddCustomerModal({
    open,
    onClose,
    serviceId,
    billerId,
    inputParams,
    mode = "ONLINE",
    onSuccess,
    biller_category,
    bbps_category_id,
}: AddCustomerModalProps) {
    const [form] = Form.useForm<CustomerFormValues>();
    const [errText, setErrText] = React.useState<string | null>(null);
    const router = useRouter();

    const { mutateAsync: billFetchAsync, isPending } = useBbpsBillerFetchMutation({
        onError: (e: any) => {
            const raw =
                e?.data ?? e?.response?.data ?? e?.body ?? e?.payload ?? e?.raw ?? e;

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
                    (typeof raw === "object" && raw?.data && pick(raw.data, "respReason")) ||
                    (typeof raw === "string" ? raw : undefined) ||
                    e?.message;
            }

            setErrText(msg || "Something went wrong");
        },
        onSuccess: (data: BillFetchResponse) => {
            // We also call onSuccess from the awaited submit for symmetry; keeping this doesn't hurt.
            onSuccess?.(data);
        },
    });

    const submit = async (values: CustomerFormValues) => {
        setErrText(null);
        try {
            const payloadInput = inputParams.length === 1 ? inputParams[0] : inputParams;

            // Await async mutation
            const resp = await billFetchAsync({
                service_id: serviceId,
                mode,
                body: {
                    billerId,
                    customerInfo: { customerMobile: values.mobileNumber },
                    inputParams: { input: payloadInput },
                },
            });

            const nextScreenPayload = {
                ...resp,
                customerMobile: values.mobileNumber,
                billerId,
                customerPan: values.idNumber,
            }
            if (typeof window !== "undefined") {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextScreenPayload));
            }

            onSuccess?.(resp);   // optional callback up to parent
            onClose();           // close modal
            // Navigate to the next screen
            router.push(`/bill_payment/bbps-online/${serviceId}/${biller_category}/${bbps_category_id}`);
        } catch (error) {
            // error UI already handled in onError above (via setErrText)
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
                {!!errText && <Alert className="mb-3" type="error" showIcon message={errText} />}

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
                            { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter Mobile Number" />
                    </Form.Item>

                    <Form.Item label="Customer Email" name="email" rules={[{ type: "email", message: "Enter a valid email" }]}>
                        <Input size="large" placeholder="Enter Email Address" />
                    </Form.Item>

                    <Form.Item label="PAN / Aadhaar Number" name="idNumber">
                        <Input size="large" placeholder="Enter PAN / Aadhaar Number" />
                    </Form.Item>

                    {/* Hidden submit for footer button */}
                    <button type="submit" className="hidden" />
                </Form>
            </SmartModal.Body>

            <SmartModal.Footer>
                <Button onClick={onClose} disabled={isPending}>Cancel</Button>
                <Button type="primary" className="!bg-[#3386FF]" loading={isPending} onClick={() => form.submit()}>
                    Proceed
                </Button>
            </SmartModal.Footer>
        </SmartModal>
    );
}
