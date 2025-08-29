"use client";

import Image from "next/image";
import { Card, Typography, Form, Input, Button, Checkbox, Select } from "antd";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "@/features/auth";
import { useMessage } from "@/hooks/useMessage";
import type { UserdataProps } from "@/app/(auth)/signup/page";

const { Title, Text } = Typography;

type FormValues = {
  name?: string;
  address?: string;
  email?: string;
  mobile?: string;
  dob?: string;     // keep as string
  gender?: string;  // "male" | "female" | "other"
  accept?: boolean;
};

export default function SignupUserdetails({
  setStep,
  urn,
  user,
  setUsername,
}: {
  setStep: (step: number) => void;
  urn: string;
  user?: UserdataProps;
  setUsername: (username: string) => void 
}) {
  const [form] = Form.useForm<FormValues>();
  const [accepted, setAccepted] = useState(false);
  const { mutateAsync: register, isPending } = useRegisterMutation();
  const { success, error } = useMessage();

  const {
    address,
    dob,                // e.g. "02-02-1995"
    gender,             // "M" | "F" | "O"
    registered_name,
    email, mobile
    // name_on_aadhaar, profile, type, urn: userUrn, name_match_score
  } = user ?? {};

  const mapGender = (g?: string) =>
    g === "M" ? "male" : g === "F" ? "female" : g === "O" ? "other" : undefined;

  // hydrate form when user changes — all plain strings
  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: registered_name ?? "",
      address: address ?? "",
      email: email ?? "",
      mobile: mobile ?? "",
      dob: dob ?? "",                 // keep as-is string
      gender: mapGender(gender),
    });
  }, [user, form, address, dob, gender, registered_name, email, mobile]);

  const handleSignup = async () => {

    try {
      if (!accepted) {
        error("Please accept Terms & Conditions before signing up.");
        return;
      } else {
        const res = await register({ urn, accepted_terms: true });
        success("Account created successfully");
        setUsername(res?.username ?? "")
        setStep(3);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error(e?.data?.error?.message ?? "Failed to register. Please try again.");
    }
  };

  return (
    <Card className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md p-6 z-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo.png" alt="LKG Infosolution" width={160} height={40} priority />
      </div>

      <div className="text-center mb-6">
        <Title level={3} className="!mb-1 text-[#232323] font-semibold text-center">
          Onboarding Application
          <br />
          Form
        </Title>
      </div>

      <Form<FormValues> form={form} layout="vertical" requiredMark={false}>
        {/* Applicant Name */}
        <Form.Item
          label={<span className="text-black">Applicant Name:</span>}
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" disabled readOnly className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8" />
        </Form.Item>

        {/* Address */}
        <Form.Item
          label={<span className="text-black">Address:</span>}
          name="address"
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input size="large" disabled readOnly className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8" />
        </Form.Item>

        {/* Email + Mobile (not provided by preview_data) */}
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={<span className="text-black">Email:</span>}
            name="email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input size="large" disabled readOnly className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8" />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Mobile No.</span>}
            name="mobile"
            rules={[{ required: true, message: "Enter mobile number" }]}
          >
            <Input size="large" disabled readOnly className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8" />
          </Form.Item>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-2 gap-3">
          {/* DOB as plain Input to avoid any date lib */}
          <Form.Item
            label={<span className="text-black">DOB</span>}
            name="dob"
            rules={[{ required: true, message: "Select Date of Birth" }]}
          >
            <Input size="large" disabled readOnly className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8" />
          </Form.Item>

          <Form.Item
            label={<span className="text-black">Gender</span>}
            name="gender"
            rules={[{ required: true, message: "Select gender" }]}
          >
            <Select
              disabled
              className="!rounded-[8px] !border-1 !border-[#E0E0E0] !bg-white !h-8"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
          </Form.Item>
        </div>

        {/* T&C */}
        <Form.Item
          name="accept"
          valuePropName="checked"
          className="!mb-4"
          rules={[{ validator: () => (accepted ? Promise.resolve() : Promise.reject("Please accept T&C")) }]}
        >
          <Checkbox onChange={(e) => setAccepted(e.target.checked)}>
            <Text className="!text-[#FFC107] !text-[12px]">
              I Accept LKF <a href="#" className="!text-[#FFC107]">[T&amp;C]</a> |{" "}
              <a href="#" className="!text-[#FFC107]">[Privacy Policy]</a>
            </Text>
          </Checkbox>
        </Form.Item>

        {/* Sign Up */}
        <Form.Item className="mt-2">
          <Button
            type="primary"
            block
            disabled={!accepted}
            loading={isPending}
            onClick={handleSignup}
            className="!h-10 !rounded-[8px] !bg-[#FFC107] !text-black !font-semibold"
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
