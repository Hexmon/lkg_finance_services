"use client";

import React from "react";
import { Form, Input, Button } from "antd";

export type SenderCheckBasicValues = {
  senderMobile: string;
};

export default function SenderCheckFormPaypoint({
  onSubmit,
  loading,
  initialMobile,
}: {
  onSubmit: (values: SenderCheckBasicValues) => void | Promise<void>;
  loading?: boolean;
  initialMobile?: string;
}) {
  const [form] = Form.useForm<SenderCheckBasicValues>();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ senderMobile: initialMobile ?? "" }}
    >
      <div className="mb-2 flex items-start gap-3">
        <Form.Item
          name="senderMobile"
          className="mb-0 flex-1"
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
            className="!h-[52px] flex-1"
            maxLength={10}
            inputMode="numeric"
            pattern="\d*"
            allowClear
            disabled={loading}
            prefix={<span className="text-gray-500 mr-1">+91</span>}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const valid = /^[6-9]\d{9}$/.test(getFieldValue("senderMobile") || "");
            return (
              <Button
                htmlType="submit"
                type="primary"
                className="!bg-[#3386FF] !h-[52px] !w-[155px] !rounded-[12px] !text-white"
                disabled={!valid}
                loading={loading}
              >
                Continue
              </Button>
            );
          }}
        </Form.Item>
      </div>
    </Form>
  );
}
