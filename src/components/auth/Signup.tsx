"use client";

import Image from "next/image";
import { Card, Typography, Form, Input, Button, Space } from "antd";
import { UserOutlined, MailOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMessage } from "@/hooks/useMessage";
import Link from "next/link";
import { useSendOtpMutation, useVerifyEmailOtpMutation, useGenerateEmailOtpMutation } from "@/features/auth";

const { Title, Text } = Typography;

type FormValues = {
  mobile?: string;
  email?: string;
  otpMobile?: string;
  otpEmail?: string;
};

export default function SignupMain({ setStep, urn, setURN }: { setStep: (step: number) => void, urn: string, setURN: (urn: string) => void }) {
  const [form] = Form.useForm<FormValues>();
  const { success, error } = useMessage();
  const { mutateAsync: sendOtpMut } = useSendOtpMutation();
  const { mutateAsync: verifyOtpMut } = useVerifyEmailOtpMutation();
  const { mutateAsync: genEmailOtp } = useGenerateEmailOtpMutation();

  // track per-field state
  const [sent, setSent] = useState<{ mobile: boolean; email: boolean }>({
    mobile: false,
    email: false,
  });
  const [verified, setVerified] = useState<{ mobile: boolean; email: boolean }>({
    mobile: false,
    email: false,
  });

  // show/hide OTP row per field
  const [otpVisible, setOtpVisible] = useState<{ mobile: boolean; email: boolean }>({
    mobile: false,
    email: false,
  });

  // loading per OTP verify
  const [otpLoading, setOtpLoading] = useState<{ mobile: boolean; email: boolean }>({
    mobile: false,
    email: false,
  });
  const [refId, setRefId] = useState<{ mobile?: string; email?: string }>({});

  const sendOtp = async (target: "mobile" | "email") => {
    try {
      await form.validateFields([target]); // validate only that field

      if (target === "mobile") {
        const mobile = form.getFieldValue("mobile")?.toString().trim();
        // NOTE: Supply purpose/user_type that match your backend contracts
        const resp = await sendOtpMut({
          mobile,
          purpose: "REGISTRATION",
          user_type: "RETAILER",
        });

        // Save ref_id for later verify
        const newRefId = String(resp.ref_id);
        setRefId((r) => ({ ...r, mobile: newRefId }));
        setSent((s) => ({ ...s, mobile: true }));
        setOtpVisible((v) => ({ ...v, mobile: true }));
        success(`OTP sent to mobile`);
        return;
      }

      const email = form.getFieldValue("email")?.toString().trim();
      const respEmail = await genEmailOtp({ email, urn });

      setRefId((r) => ({ ...r, email: String(respEmail.ref_id) }));
      setSent((s) => ({ ...s, [target]: true }));
      setOtpVisible((v) => ({ ...v, [target]: true }));
      success(`OTP sent to ${target}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const fallback = e?.data?.error?.message || "Something went wrong !! Try again later.";
      error(fallback);
    }
  };

  const verifyOtp = async (target: "mobile" | "email") => {
    const otpField = target === "mobile" ? "otpMobile" : "otpEmail";
    try {
      await form.validateFields([otpField]);
      setOtpLoading((l) => ({ ...l, [target]: true }));

      const otp = form.getFieldValue(otpField)?.toString().trim();

      if (target === "mobile") {
        const currentRefId = refId.mobile;
        if (!currentRefId) {
          error?.("Please request an OTP first");
          return;
        }

        const resp = await verifyOtpMut({ ref_id: currentRefId, otp });
        setURN(resp.urn ?? "");

        const ok =
          resp?.status === 200 ||
          resp?.status === 201 ||
          String(resp?.status).toUpperCase() === "SUCCESS" ||
          /verified|success/i.test(resp?.message ?? "");

        if (!ok) {
          error?.(resp?.message || "OTP verification failed");
          return;
        }

        setVerified((v) => ({ ...v, mobile: true }));
        setOtpVisible((vis) => ({ ...vis, mobile: false }));
        form.resetFields([otpField]);
        success(`Mobile verified`);
        return;
      }

      // -------- EMAIL flow --------
      const emailRef = refId.email;
      if (!emailRef) {
        error?.("Please request an OTP first");
        return;
      }

      const respEmail = await verifyOtpMut({ ref_id: emailRef, otp });

      const okEmail =
        respEmail?.status === 200 ||
        respEmail?.status === 201 ||
        String(respEmail?.status).toUpperCase() === "SUCCESS" ||
        /verified|success/i.test(respEmail?.message ?? "");

      if (!okEmail) {
        error?.(respEmail?.message || "OTP verification failed");
        return;
      }

      setVerified((v) => ({ ...v, email: true }));
      setOtpVisible((vis) => ({ ...vis, email: false }));
      form.resetFields([otpField]);
      success(`Email verified`);
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
          {/* Aadhaar/Mobile row (you can change the label text as needed) */}
          <Form.Item
            label={<span className="text-[#9A9595]">Mobile No.</span>}
            name="mobile"
            rules={[
              { required: true, message: "Please enter Mobile number" },
              // adjust pattern/validation to your real rule:
              { pattern: /^[0-9\s\-A-Za-z]+$/, message: "Enter a valid value" },
            ]}
          >
            <Input
              size="large"
              placeholder="1234567890"
              prefix={<UserOutlined />}
              disabled={verified.mobile}
              className="!rounded-[16px] !bg-[#F6F6F6] !border-0 !h-12 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
              suffix={
                verified.mobile ? (
                  <div className="text-white font-bold">
                    <CheckPill />
                  </div>
                ) : (
                  <Button
                    type="text"
                    onClick={() => sendOtp("mobile")}
                    className="!text-[14px] !font-medium !text-[#FFC107] !hover:opacity-80"
                  >
                    {sent.mobile ? "Resend OTP" : "Send OTP"}
                  </Button>
                )
              }
            />
          </Form.Item>

          {/* OTP row directly BELOW the Aadhaar/Mobile field */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out mb-4",
              otpVisible.mobile && !verified.mobile
                ? "opacity-100 translate-y-0 max-h-24"
                : "opacity-0 -translate-y-1 max-h-0 pointer-events-none",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 justify-between">
              <label className="text-[#232323] text-[14px] whitespace-nowrap">Verify OTP:</label>
              <Form.Item
                name="otpMobile"
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
                />
              </Form.Item>
              <Button
                type="default"
                onClick={() => verifyOtp("mobile")}
                loading={otpLoading.mobile}
                className="!rounded-full !bg-[#FFC107] !text-black !border-none px-4 h-9"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* PAN row (or Email if you prefer) */}
          <Form.Item
            label={<span className="text-[#9A9595]">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter PAN/Email" },
              // if using Email, swap with { type: "email", message: "Enter a valid email" }
            ]}
          >
            <Input
              size="large"
              placeholder="Enter Email ID."
              prefix={<MailOutlined />}
              disabled={verified.email}
              className="!rounded-[16px] !bg-[#F6F6F6] !border-0 !h-12 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
              suffix={
                verified.email ? (
                  <div className="text-white font-bold">
                    <CheckPill />
                  </div>
                ) : (
                  <Button
                    type="text"
                    onClick={() => sendOtp("email")}
                    className="!text-[14px] !font-medium !text-[#FFC107] !hover:opacity-80"
                  >
                    {sent.email ? "Resend OTP" : "Send OTP"}
                  </Button>
                )
              }
            />
          </Form.Item>

          {/* OTP row directly BELOW the PAN/Email field */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out mb-2",
              otpVisible.email && !verified.email
                ? "opacity-100 translate-y-0 max-h-24"
                : "opacity-0 -translate-y-1 max-h-0 pointer-events-none",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 justify-between">
              <label className="text-[#232323] text-[14px] whitespace-nowrap">Verify OTP:</label>
              <Form.Item
                name="otpEmail"
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
                />
              </Form.Item>
              <Button
                type="default"
                onClick={() => verifyOtp("email")}
                loading={otpLoading.email}
                className="!rounded-full !bg-[#FFC107] !text-black !border-none px-4 h-9"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Next */}
          <Form.Item className="mt-2">
            <Button
              type="primary"
              block
              disabled={!verified.mobile || !verified.email}
              onClick={() => {
                if (verified.mobile && verified.email) {
                  setStep(1);   // move to step 1
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
              Don&apos;t have an account?
            </Text>
            <Link href="/signin"><span className="text-xs text-[#FFC107] font-bold">Sign In</span></Link>
          </Space>
        </div> */}
      </Card>

      {/* OTP dashed underline styling */}
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