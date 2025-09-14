"use client";

import React from "react";
import { Form, Input, Button } from "antd";
import SmartModal from "@/components/ui/SmartModal";

export type AddBeneficiaryFormValues = {
    beneficiaryAccountNo: string;
    confirmAccountNo: string;
    bankName: string;
    ifscCode: string;
    mobileNo: string;
    address: string;
    beneficiaryName: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: AddBeneficiaryFormValues) => void | Promise<void>;
    initialValues?: Partial<AddBeneficiaryFormValues>;
    loading?: boolean;
};

export default function AddBeneficiariesModal({
    open,
    onClose,
    onSubmit,
    initialValues,
    loading,
}: Props) {
    const [form] = Form.useForm<AddBeneficiaryFormValues>();

    const handleFinish = async (values: AddBeneficiaryFormValues) => {
        await Promise.resolve(onSubmit?.(values));
    };

    return (
        <SmartModal
            open={open}
            onClose={onClose}
            ariaLabel="Add Beneficiary"
            centered
            animation="scale"
            closeOnBackdrop={false}
            closeOnEsc={false}
            contentClassName="w-full max-w-[560px]"
            bodyClassName="px-4 py-4"
        >
            <SmartModal.Header className="flex items-center justify-between">
                <span className="text-lg font-semibold">Add Beneficiary</span>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="rounded-full p-1 leading-none hover:bg-gray-100"
                >
                    ×
                </button>
            </SmartModal.Header>

            <SmartModal.Body className="flex justify-center">
                <Form
                    form={form}
                    layout="vertical"
                    className="w-[527px]"
                    initialValues={initialValues}
                    onFinish={handleFinish}
                >
                    <Form.Item
                        label="Beneficiary Account No *"
                        name="beneficiaryAccountNo"
                        rules={[{ required: true, message: "Please enter Beneficiary Account Number" }]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input
                            autoFocus
                            placeholder="Enter Beneficiary Account Number"
                            inputMode="numeric"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Account No *"
                        name="confirmAccountNo"
                        dependencies={["beneficiaryAccountNo"]}
                        rules={[
                            { required: true, message: "Please confirm Account Number" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value === getFieldValue("beneficiaryAccountNo")) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Account numbers do not match"));
                                },
                            }),
                        ]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Confirm Account Number" inputMode="numeric" />
                    </Form.Item>

                    <Form.Item
                        label="Bank Name *"
                        name="bankName"
                        rules={[{ required: true, message: "Please enter Bank Name" }]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Enter Bank Name" />
                    </Form.Item>

                    <Form.Item
                        label="IFSC Code *"
                        name="ifscCode"
                        normalize={(v) => (typeof v === "string" ? v.toUpperCase() : v)}
                        rules={[
                            { required: true, message: "Please enter IFSC Code" },
                            { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Enter valid IFSC (e.g., HDFC0001234)" },
                        ]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Enter IFSC Code" />
                    </Form.Item>

                    <Form.Item
                        label="Mobile No *"
                        name="mobileNo"
                        rules={[
                            { required: true, message: "Please enter Mobile Number" },
                            { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
                        ]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Enter Mobile Number" maxLength={10} inputMode="numeric" />
                    </Form.Item>

                    <Form.Item
                        label="Address *"
                        name="address"
                        rules={[{ required: true, message: "Please enter Address" }]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Enter Address" />
                    </Form.Item>

                    <Form.Item
                        label="Beneficiary Name *"
                        name="beneficiaryName"
                        rules={[{ required: true, message: "Please enter Beneficiary Name" }]}
                        className="w-[444px] h-[39px]"
                    >
                        <Input placeholder="Enter Beneficiary Name" />
                    </Form.Item>

                    <div className="flex justify-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </SmartModal.Body>
        </SmartModal>
    );
}
