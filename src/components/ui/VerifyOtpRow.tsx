"use client";

import { Form, Input, Button } from "antd";

type VerifyOtpRowProps = {
  visible: boolean;
  name: string;              // form field name (e.g., "mobileOtp" | "emailOtp")
  loading?: boolean;
  disabled?: boolean;
  labelText?: string;        // defaults to "Verify OTP:"
  onSubmit: () => void;
};

export default function VerifyOtpRow({
  visible,
  name,
  loading,
  disabled,
  labelText = "Verify OTP:",
  onSubmit,
}: VerifyOtpRowProps) {
  return (
    <div
      className={[
        "overflow-hidden transition-all duration-300 ease-out mb-4",
        visible
          ? "opacity-100 translate-y-0 max-h-24"
          : "opacity-0 -translate-y-1 max-h-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 justify-between">
        <label className="text-[#232323] text-[14px] whitespace-nowrap">{labelText}</label>
        <Form.Item
          name={name}
          className="!mb-0 flex-1"
          rules={[
            { required: true, message: "Enter the 6-digit OTP" },
            { len: 6, message: "OTP must be 6 digits" },
          ]}
        >
          <Input.OTP
            length={6}
            className="otp-dashed w-full"
            formatter={(str) => str.replace(/\D/g, "")}
            disabled={disabled}
          />
        </Form.Item>
        <Button
          type="default"
          onClick={onSubmit}
          loading={loading}
          disabled={disabled}
          className="!rounded-full !bg-[#FFC107] !text-black !border-none px-4 h-9"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
