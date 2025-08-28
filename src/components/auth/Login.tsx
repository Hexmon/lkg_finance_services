"use client";

import Image from "next/image";
import { Card, Typography, Form, Input, Button, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLoginMutation } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";

const { Text, Link, Title } = Typography;

type LoginFormValues = {
    username: string;
    password: string;
};

export const LoginMain = () => {
    const [form] = Form.useForm<LoginFormValues>();
    const router = useRouter();

    const { success, error, warning } = useMessage();
    const { mutateAsync: login } = useLoginMutation();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            await login({
                username: values.username ?? "",
                password: values.password ?? "",
            });
            // Token/cookie is set in onSuccess of the hook.
            success("Signed in successfully");
            router.replace("/");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const fallback = err?.data?.error?.message || "Something went wrong !! Try again later.";
            error(fallback);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = () => {
        warning("Please fill in both username and password.");
    };

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh pt-4 px-4">
            <Card
                className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md  border-[10px] p-6 z-4"
            >
                {/* Logo */}
                <div className="flex justify-center mb-3">
                    <Image
                        src="/logo.png"
                        alt="LKG Infosolution"
                        width={240}
                        height={45}
                        priority
                    />
                </div>

                {/* Title + subtitle */}
                <div className="text-center mb-6">
                    <Title
                        level={4}
                        className="!mb-1 text-[#4E4E4E] font-semibold text-[22px] leading-[141%] tracking-normal text-center"
                    >
                        Welcome,
                    </Title>

                    <Text type="secondary" className="text-[#4E4E4E] text-[16px] tracking-normal text-center">Sign in to continue!</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    requiredMark={false}
                    initialValues={{ username: "" }}
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

                    {/* Forgot username small link (aligned right) */}
                    <div className="flex justify-end -mt-2 mb-3">
                        <Link href="/forgot-username"><span className="text-xs text-[#8B8B8B]">Forget Username?</span></Link>
                    </div>

                    {/* Password */}
                    <Form.Item
                        label={<span className="text-gray-500">Password</span>}
                        name="password"
                        rules={[{ required: true, message: "Please enter password" }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Enter Password"
                            prefix={<LockOutlined />}
                            className="!rounded-xl"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    {/* Forgot password small link (aligned right) */}
                    <div className="flex justify-end -mt-2 mb-4">
                        <Link href="/forgot-password"><span className="text-xs text-[#8B8B8B]">Forget Password?</span></Link>
                    </div>

                    {/* Login button */}
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            block
                            type="primary"
                            loading={loading}
                            className="!h-11 !rounded-xl !bg-[#FFC107] !text-black"
                        >
                            Login
                        </Button>
                    </Form.Item>

                    {/* Sign up hint */}
                    <div className="text-center">
                        <Space size={6}>
                            <Text type="secondary" className="text-xs !text-[#232323]">
                                Don&apos;t have an account?
                            </Text>
                            <Link href="/signup"><span className="text-xs text-[#FFC107] font-bold">Sign Up</span></Link>
                        </Space>
                    </div>
                </Form>
            </Card>
            <div className="h-4 relative bottom-1 z-2 bg-[#D9D9D9B2] rounded-b-xl w-[492px] max-w-[432px]" />
            <div className="h-5 relative bottom-4 z-1 bg-[#D9D9D9B2] rounded-b-2xl w-[492px] max-w-[426px]" />

        </div>
    )
}