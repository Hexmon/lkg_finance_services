"use client";

import Image from "next/image";
import { Card, Typography, Form, Input, Button } from "antd";
import { UserOutlined, IdcardOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMessage } from "@/hooks/useMessage";
import { useAadhaarOtpGenerateMutation, useAadhaarOtpVerifyMutation, usePanVerifyMutation } from "@/features/auth";
import { UserdataProps } from "@/app/(auth)/signup/page";

const { Title } = Typography;

type FormValues = {
  aadhar?: string;
  pan?: string;
  otpAadhar?: string;
  otpPan?: string;
};

export default function OnboardingMain({
  setStep,
  urn,
  setUserdata
}: {
  setStep: (step: number) => void;
  urn: string;
  setUserdata: React.Dispatch<React.SetStateAction<UserdataProps | undefined>>;
}) {
  const [form] = Form.useForm<FormValues>();
  const { success, error } = useMessage();

  const { mutateAsync: sendAadhaarOtp, isPending: isSendingAadhaarOtp, } = useAadhaarOtpGenerateMutation();
  const { mutateAsync: verifyAadhaarOtp } = useAadhaarOtpVerifyMutation();
  const { mutateAsync: verifyPan } = usePanVerifyMutation();


  // track per-field state
  const [sent, setSent] = useState<{ aadhar: boolean; pan: boolean }>({
    aadhar: false,
    pan: false,
  });
  const [verified, setVerified] = useState<{ aadhar: boolean; pan: boolean }>({
    aadhar: false,
    pan: false,
  });
  const [otpVisible, setOtpVisible] = useState<{ aadhar: boolean; pan: boolean }>({
    aadhar: false,
    pan: false,
  });
  const [otpLoading, setOtpLoading] = useState<{ aadhar: boolean; pan: boolean }>({
    aadhar: false,
    pan: false,
  });

  const [aadhaarRefId, setAadhaarRefId] = useState<string | number | null>(null);

  // Helper: sanitize Aadhaar to digits before submit
  const getAadhaarDigits = () => {
    const raw = form.getFieldValue("aadhar") || "";
    return (raw as string).replace(/\D/g, "");
  };

  const sendOtp = async (target: "aadhar" | "pan") => {
    try {
      await form.validateFields([target]);

      if (target === "aadhar") {
        const aadhaar_number = getAadhaarDigits();
        // Safety: re-validate length after sanitization
        if (!/^\d{12}$/.test(aadhaar_number)) {
          throw new Error("Please enter a valid 12-digit Aadhaar number.");
        }

        // Call your provided hook + API
        const res = await sendAadhaarOtp({ urn, aadhaar_number });
        setAadhaarRefId(res?.ref_id ?? null);
        setOtpVisible((v) => ({ ...v, [target]: true }));
      } else {
        const pan_number = form.getFieldValue("pan");
        const res = await verifyPan({ urn, pan_number });
        const preview = res?.preview_data as UserdataProps | undefined;
        if (preview) setUserdata(preview);
        setVerified((v) => ({ ...v, pan: true }));
        success(res?.message || "PAN verified successfully");
      }

      setSent((s) => ({ ...s, [target]: true }));
      success(`OTP sent to verify ${target === "aadhar" ? "Aadhaar" : "PAN"}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        error(e?.data?.error?.message  || "Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async (target: "aadhar") => {
    const otpField = target === "aadhar" ? "otpAadhar" : "otpPan";
    try {
      await form.validateFields([otpField]);
      setOtpLoading((l) => ({ ...l, [target]: true }));

      if (!aadhaarRefId) throw new Error("Missing ref_id. Please resend OTP.");

      const otp = form.getFieldValue("otpAadhar");
      const res = await verifyAadhaarOtp({
        urn,
        ref_id: String(aadhaarRefId),
        otp,
      });

      // success UI
      setVerified((v) => ({ ...v, aadhar: true }));
      setOtpVisible((vis) => ({ ...vis, aadhar: false }));
      form.resetFields(["otpAadhar"]);
      success(res?.message || "Aadhaar verified");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (!(e?.errorFields?.length > 0)) error(e?.message || "OTP verification failed");
    } finally {
      setOtpLoading((l) => ({ ...l, [target]: false }));
    }
  };

  const CheckPill = () => (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFC107]">
      <CheckOutlined className="text-white text-[10px]" />
    </span>
  );

  return (
    <>
      <Card
        className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md p-6 z-4"
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="LKG Infosolution" width={160} height={40} priority />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <Title level={3} className="!mb-1 text-[#232323] font-semibold text-center">
            Onboarding Application
            <br />
            Form
          </Title>
        </div>

        <Form<FormValues> form={form} layout="vertical" requiredMark={false} initialValues={{}}>
          {/* Aadhaar No. */}
          <Form.Item
            label={<span className="text-[#9A9595]">Aadhaar No.</span>}
            name="aadhar"
            normalize={(v) => (v || "").replace(/\D/g, "")} // keep only digits in model
            rules={[
              { required: true, message: "Please enter Aadhaar number" },
              { pattern: /^\d{12}$/, message: "Enter a valid 12-digit Aadhaar" },
            ]}
          >
            <Input
              size="large"
              placeholder="1234 5678 9012"
              prefix={<UserOutlined />}
              disabled={verified.aadhar}
              inputMode="numeric"
              maxLength={12}
              className="!rounded-[16px] !bg-[#F6F6F6] !border-0 !h-12 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
              suffix={
                verified.aadhar ? (
                  <CheckPill />
                ) : (
                  <Button
                    type="text"
                    onClick={() => sendOtp("aadhar")}
                    loading={isSendingAadhaarOtp}
                    disabled={isSendingAadhaarOtp}
                    className="!text-[14px] !font-medium !text-[#FFC107] !hover:opacity-80"
                  >
                    {sent.aadhar ? "Resend OTP" : "Send OTP"}
                  </Button>
                )
              }
            />
          </Form.Item>

          {/* OTP Aadhaar */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out mb-4",
              otpVisible.aadhar && !verified.aadhar
                ? "opacity-100 translate-y-0 max-h-24"
                : "opacity-0 -translate-y-1 max-h-0 pointer-events-none",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 justify-between">
              <label className="text-[#232323] text-[14px] whitespace-nowrap">Verify OTP:</label>
              <Form.Item
                name="otpAadhar"
                className="!mb-0 flex-1"
                rules={[
                  { required: true, message: "Enter the 6-digit OTP" },
                  { len: 6, message: "OTP must be 6 digits" },
                ]}
              >
                <Input.OTP length={6} className="otp-dashed w-full" formatter={(str) => str.replace(/\D/g, "")} />
              </Form.Item>
              <Button
                type="default"
                onClick={() => verifyOtp("aadhar")}
                loading={otpLoading.aadhar}
                className="!rounded-full !bg-[#FFC107] !text-black !border-none px-4 h-9"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* PAN No. */}
          <Form.Item
            label={<span className="text-[#9A9595]">PAN No.</span>}
            name="pan"
            rules={[
              { required: true, message: "Please enter PAN number" },
              { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Enter a valid PAN (ABCDE1234F)" },
            ]}
          >
            <Input
              size="large"
              placeholder="ABCDE1234F"
              prefix={<IdcardOutlined />}
              disabled={verified.pan}
              className="!rounded-[16px] !bg-[#F6F6F6] !border-0 !h-12 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
              suffix={
                verified.pan ? (
                  <CheckPill />
                ) : (
                  <Button
                    type="text"
                    onClick={() => sendOtp("pan")}
                    className="!text-[14px] !font-medium !text-[#FFC107] !hover:opacity-80"
                  >
                    {sent.pan ? "Resend OTP" : "Send OTP"}
                  </Button>
                )
              }
            />
          </Form.Item>

          {/* Next */}
          <Form.Item className="mt-2">
            <Button
              type="primary"
              block
              onClick={() => {
                if (verified.aadhar && verified.pan) {
                  setStep(2);
                }
              }}
              className="!h-12 !rounded-[16px] !bg-[#FFC107] !text-black !text-[16px] !font-semibold"
            >
              Next
            </Button>
          </Form.Item>
        </Form>

        {/* <div className="text-center">
          <Space size={6}>
            <Text type="secondary" className="text-xs !text-[#232323]">
              Already have an account?
            </Text>
            <Link href="/signup">
              <span className="text-xs text-[#FFC107] font-bold">Sign Up</span>
            </Link>
          </Space>
        </div> */}
      </Card>
      {/* OTP styling */}
      <style jsx global>{`
        .otp-dashed .ant-input {
          width: 38px;
          height: 36px;
          text-align: center;
          border: none;
          border-bottom: 2px dashed #bdbdbd;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }
        .otp-dashed .ant-input:focus {
          border-bottom-color: #ffc107;
          box-shadow: none;
        }
        .otp-dashed .ant-input-otp-input {
          margin-right: 12px;
        }
        .otp-dashed .ant-input-otp-input:last-child {
          margin-right: 0;
        }
      `}</style>
    </>
  );
}
