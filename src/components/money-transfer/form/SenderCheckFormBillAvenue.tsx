"use client";

import React from "react";
import { Form, Input, Button, Select } from "antd";

export const TXN_TYPE = {
  IMPS: "IMPS",
  NEFT: "NEFT",
} as const;
export type TxnType = keyof typeof TXN_TYPE;

export const BANK_ID = {
  ARTL: "ARTL",
  FINO: "FINO",
} as const;
export type BankId = keyof typeof BANK_ID;

export type SenderCheckWithOptionsValues = {
  senderMobile: string;
  txnType: TxnType;
  bankId: BankId;
};

export default function SenderCheckFormBillAvenue({
  onSubmit,
  loading,
  initialMobile,
  defaultTxnType = "IMPS",
  defaultBankId = "ARTL",
}: {
  onSubmit: (values: SenderCheckWithOptionsValues) => void | Promise<void>;
  loading?: boolean;
  initialMobile?: string;
  defaultTxnType?: TxnType;
  defaultBankId?: BankId;
}) {
  const [form] = Form.useForm<SenderCheckWithOptionsValues>();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        senderMobile: initialMobile ?? "",
        txnType: defaultTxnType,
        bankId: defaultBankId,
      }}
    >
      {/* Phone input (standalone row) */}
      <Form.Item
        name="senderMobile"
        label="Sender Mobile"
        rules={[
          { required: true, message: "Enter mobile number" },
          {
            pattern: /^[6-9]\d{9}$/,
            message: "Enter valid 10-digit number starting with 6–9",
          },
        ]}
      >
        <Input
          placeholder="Enter Sender Mobile Number"
          className="!h-[52px]"
          maxLength={10}
          inputMode="numeric"
          pattern="\d*"
          allowClear
          disabled={loading}
          prefix={<span className="text-gray-500 mr-1">+91</span>}
        />
      </Form.Item>

      <div className="">
        <Form.Item
          name="txnType"
          label="Txn Type"
          rules={[{ required: true, message: "Please select Txn Type" }]}
        >
          <Select
            placeholder="Select Txn Type"
            options={[
              { label: "IMPS", value: "IMPS" },
              { label: "NEFT", value: "NEFT" },
            ]}
            disabled={loading}
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="bankId"
          label="Bank"
          rules={[{ required: true, message: "Please select Bank" }]}
        >
          <Select
            placeholder="Select Bank"
            options={[
              { label: "ARTL", value: "ARTL" }, // maps to ARTL internally
              { label: "FINO", value: "FINO" },
            ]}
            disabled={loading}
            className="w-full"
          />
        </Form.Item>
      </div>

      {/* Continue button AFTER dropdowns */}
      <Form.Item shouldUpdate className="flex justify-end">
        {() => (
          <div className="flex justify-start">
            <Button
              htmlType="submit"
              type="primary"
              className="!bg-[#3386FF] !h-[52px] !w-[155px] !rounded-[12px] !text-white text-right"
              loading={loading}
            >
              Continue
            </Button>
          </div>
        )}
      </Form.Item>
    </Form>
  );
}
