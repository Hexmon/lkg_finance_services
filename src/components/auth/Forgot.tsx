"use client";

import Image from "next/image";
import { Card, Typography, Form, Input, Button, Radio, Space } from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import { useMessage } from "@/hooks/useMessage";

// ---- Forgot Password: hooks & utils (from your provided hooks file) ----
import { useLoginMutation, useResetPasswordMutation, extractUserIdFromApiError } from "@/features/auth";

// ---- Forgot Username: hooks & utils (already correct) ----
import {
  useForgotUsernameInitiateMutation,
  useVerifyOtpForgotUsernameMutation,
  extractRefIdFromForgotUsernameInit,
  extractUsernamesFromVerifyResponse,
} from "@/features/auth";

const { Text, Title } = Typography;

/* ================================
 * FORGOT PASSWORD (initiate OTP)
 * ================================ */
type LoginFormValues = {
  username: string;
  password: string;
  notificationMethod?: "sms" | "email" | "both";
};

export const ForgotPasswordMain = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const { success, error, warning } = useMessage();

  // probe login to extract user_id from ApiError
  const { mutateAsync: login } = useLoginMutation();

  // ✅ correct hook name from your code: useResetPasswordMutation
  const { mutateAsync: resetPassword, isPending: isResetLoading } =
    useResetPasswordMutation();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      // UI requires both fields; backend only needs user_id for reset
      await form.validateFields(["username", "notificationMethod"]);

      // 1) Resolve user_id via intentional login failure (ApiError carries user_id)
      let userId: string | null = null;
      try {
        await login({
          username: values.username ?? "",
          password: "__wrong_password_probe__", // guaranteed fail
        });
        error("Unexpected sign-in success. Please retry the forgot password flow.");
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (probeErr: any) {
        userId = extractUserIdFromApiError(probeErr);
      }

      if (!userId) {
        error("We couldn’t find this username. Please check and try again.");
        return;
      }

      // 2) Initiate reset password (API expects { user_id, purpose: 'password_reset' })
      await resetPassword({
        user_id: userId,
        purpose: "password_reset",
      });

      success("OTP sent to your registered contact.");
      // Optionally store / route for verify screen
      // sessionStorage.setItem("reset_ref_id", String(resp.ref_id));
      // sessionStorage.setItem("reset_user_id", userId);
      // router.push("/auth/reset-password/verify");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const fallback =
        err?.data?.message ||
        err?.data?.error?.message ||
        err?.message ||
        "Failed to start password reset. Please try again.";
      error(fallback);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    warning("Please fill in all required fields.");
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh p-4">
      <Card
        className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md border-[10px] p-6 z-4"
        styles={{ body: { padding: 24 } }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="LKG Infosolution" width={240} height={45} priority />
        </div>

        {/* Title + subtitle */}
        <div className="text-center mb-6">
          <Title
            level={4}
            className="!mb-1 text-[#4E4E4E] font-semibold text-[22px] leading-[141%] tracking-normal text-center"
          >
            Welcome,
          </Title>
          <Text type="secondary" className="text-[#4E4E4E] text-[16px] tracking-normal text-center">
            Sign in to continue!
          </Text>
        </div>

        <h1 className="text-[#232323] font-semibold text-[16px] mb-5">Forget Password</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={false}
        >
          {/* Username */}
          <Form.Item
            label={<span className="text-gray-500">Username</span>}
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input
              size="large"
              placeholder="Enter Username"
              prefix={<UserOutlined />}
              className="!rounded-xl"
              autoComplete="username"
            />
          </Form.Item>

          {/* REQUIRED Radio group with no default selection */}
          <Form.Item
            name="notificationMethod"
            rules={[{ required: true, message: "Please select a notification method" }]}
            validateTrigger={["onChange", "onBlur"]}
            className="text-center !mb-1"
          >
            <Radio.Group className="flex gap-6">
              <Radio value="sms" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">SMS</Radio>
              <Radio value="email" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">Email</Radio>
              <Radio value="both" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">Both</Radio>
            </Radio.Group>
          </Form.Item>
          <span className="text-[#9A9595] flex justify-center mb-8">
            Please select your password retrieve option
          </span>

          {/* Submit */}
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              loading={loading || isResetLoading}
              className="!h-11 !rounded-xl !bg-[#FFC107] !font-semibold !text-black"
            >
              Send
            </Button>
          </Form.Item>

          <div className="text-center">
            <Space size={6}>
              <Text type="secondary" className="text-xs !text-[#232323]">
                Don&apos;t have an account?
              </Text>
              <Link href="/signup">
                <span className="text-xs text-[#FFC107] font-bold">Sign Up</span>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
      <div className="h-4 relative bottom-1 z-2 bg-[#D9D9D9B2] rounded-b-xl w-[492px] max-w-[432px]" />
      <div className="h-5 relative bottom-4 z-1 bg-[#D9D9D9B2] rounded-b-2xl w-[492px] max-w-[426px]" />

    </div>
  );
};

/* ===============================================
 * FORGOT USERNAME (initiate + verify OTP)
 * =============================================== */
type NotificationMethod = "sms" | "email" | "both";
type ForgotUsernameValues = {
  mobile: string;
  notificationMethod: NotificationMethod;
  otp?: string;
};

const USER_TYPE = "RETAILER"; // backend expects upper-case; UI unchanged

export const ForgotUsernameMain = () => {
  const [form] = Form.useForm<ForgotUsernameValues>();
  const { success, error, warning } = useMessage();

  const { mutateAsync: initiateForgotUsername, isPending: isInitiateLoading } =
    useForgotUsernameInitiateMutation();
  const { mutateAsync: verifyForgotUsername, isPending: isVerifyLoading } =
    useVerifyOtpForgotUsernameMutation();

  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const [savedMethod, setSavedMethod] = useState<NotificationMethod | null>(null);

  const loading = isInitiateLoading;
  const otpLoading = isVerifyLoading;

  const onFinishFailed = () => {
    warning("Please fill in all required fields.");
  };

  const handleSend = async () => {
    try {
      await form.validateFields(["mobile", "notificationMethod"]);
      const mobile = form.getFieldValue("mobile") as string;
      const method = form.getFieldValue("notificationMethod") as NotificationMethod;

      const resp = await initiateForgotUsername({
        mobile,
        purpose: "USERNAME_FORGOT",
        user_type: USER_TYPE,
      });

      const newRefId = extractRefIdFromForgotUsernameInit(resp);
      setRefId(newRefId);
      setSavedMethod(method);
      setShowOtp(true);

      success("OTP sent");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg =
        e?.data?.message ||
        e?.data?.error?.message ||
        e?.message ||
        "Failed to send OTP. Please try again.";
      error(msg);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await form.validateFields(["otp"]);
      const otp = (form.getFieldValue("otp") as string)?.trim();
      if (!refId) {
        error("Missing reference ID. Please send OTP again.");
        return;
      }

      const method = (savedMethod ?? form.getFieldValue("notificationMethod")) as NotificationMethod;
      const type: "mobile" | "email" | "both" =
        method === "sms" ? "mobile" : method === "email" ? "email" : "both";

      const verifyResp = await verifyForgotUsername({ ref_id: refId, type, otp });

      const usernames = extractUsernamesFromVerifyResponse(verifyResp);
      setIsVerified(true);

      if (usernames.length) {
        success(`Verified. Username${usernames.length > 1 ? "s" : ""}: ${usernames.join(", ")}`);
      } else {
        success("Verified successfully.");
      }
      // router.replace("/signin"); // optional
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg =
        e?.data?.message ||
        e?.data?.error?.message ||
        e?.message ||
        "Invalid or expired OTP. Please try again.";
      error(msg);
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh p-4">
      <Card
        className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md border-[10px] p-6 z-4"
        styles={{ body: { padding: 24 } }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image src="/logo.png" alt="LKG Infosolution" width={240} height={45} priority />
        </div>

        {/* Title + subtitle */}
        <div className="text-center mb-6">
          <Title
            level={4}
            className="!mb-1 text-[#4E4E4E] font-semibold text-[22px] leading-[141%] tracking-normal text-center"
          >
            Welcome,
          </Title>
          <Text type="secondary" className="text-[#4E4E4E] text-[16px] tracking-normal text-center">
            Sign in to continue!
          </Text>
        </div>

        <h1 className="text-[#232323] font-semibold text-[16px] mb-5">Forget Username</h1>

        <Form form={form} layout="vertical" onFinishFailed={onFinishFailed} requiredMark={false}>
          {/* Mobile Number */}
          <Form.Item
            label={<span className="text-gray-500">Mobile Number</span>}
            name="mobile"
            rules={[
              { required: true, message: "Please enter mobile number" },
              { pattern: /^\d{10}$/, message: "Mobile must be 10 digits" },
            ]}
          >
            <Input
              size="large"
              placeholder=""
              prefix={<PhoneOutlined />}
              className="!rounded-xl"
              autoComplete="mobile"
              disabled={showOtp}
              inputMode="numeric"
            />
          </Form.Item>

          {/* Radios */}
          <Form.Item
            name="notificationMethod"
            rules={[{ required: true, message: "Please select a notification method" }]}
            validateTrigger={["onChange", "onBlur"]}
            className="text-center !mb-1"
          >
            <Radio.Group className="flex gap-6" disabled={showOtp}>
              <Radio value="sms" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">SMS</Radio>
              <Radio value="email" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">Email</Radio>
              <Radio value="both" className="!m-0 !p-0 text-[14px] text-[#4E4E4E]">Both</Radio>
            </Radio.Group>
          </Form.Item>

          <span className="text-[#9A9595] flex justify-center mb-6">
            Please select your password retrieve option
          </span>

          {/* OTP SECTION (hidden initially, shows after Send) */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-out mb-4",
              showOtp
                ? "opacity-100 translate-y-0 max-h-24"
                : "opacity-0 -translate-y-1 max-h-0 pointer-events-none",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 justify-between">
              <label className="text-[#232323] text-[14px] whitespace-nowrap">Verify OTP:</label>

              <Form.Item
                name="otp"
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
                  disabled={isVerified}
                />
              </Form.Item>

              <Button
                type="default"
                onClick={handleVerifyOtp}
                loading={otpLoading}
                disabled={isVerified}
                className="!rounded-full !bg-[#FFC107] !text-black !border-none px-4 h-9"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* SEND / RESEND */}
          <Form.Item>
            <Button
              type="primary"
              block
              loading={loading}
              onClick={handleSend}
              disabled={isVerified}
              className="!h-11 !rounded-xl !bg-[#FFC107] !font-semibold !text-black"
            >
              {showOtp ? "Resend OTP" : "Send"}
            </Button>
          </Form.Item>

          {/* Footer link */}
          <div className="text-center mt-2">
            <Space size={6}>
              <Text type="secondary" className="text-xs !text-[#232323]">
                Don&apos;t have an account?
              </Text>
              <Link href="/signup">
                <span className="text-xs text-[#FFC107] font-bold">Sign Up</span>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
            <div className="h-4 relative bottom-1 z-2 bg-[#D9D9D9B2] rounded-b-xl w-[492px] max-w-[432px]" />
            <div className="h-5 relative bottom-4 z-1 bg-[#D9D9D9B2] rounded-b-2xl w-[492px] max-w-[426px]" />

      {/* Inline global CSS for dashed OTP inputs */}
      <style jsx global>{`
        .otp-dashed .ant-input {
          width: 36px;
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
          margin-right: 10px;
        }
        .otp-dashed .ant-input-otp-input:last-child {
          margin-right: 0;
        }
      `}</style>
    </div>
  );
};
