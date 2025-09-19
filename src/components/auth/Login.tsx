// src/components/auth/LoginMain.tsx
'use client';

import Image from 'next/image';
import { Card, Typography, Form, Input, Button, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation } from '@/features/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMessage } from '@/hooks/useMessage';
import type { LoginRequest } from '@/features/auth/domain/types';
import { ApiError } from '@/lib/api/client';

const { Text, Link, Title } = Typography;

type LoginFormValues = {
  username: string;
  password: string;
};

export const LoginMain = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameFromQuery = searchParams.get('username') || '';

  const { success, error, warning } = useMessage();
  const { mutateAsync: login, isPending } = useLoginMutation();

  const onFinish = async (values: LoginFormValues) => {
    const payload: LoginRequest = {
      username: values.username.trim(),
      password: values.password,
    };
    // const payload: LoginRequest = {
    //   username: "RA175900435",
    //   password: "Asdf@1234",
    // };

    try {
      const res = await login(payload);

      if (res.status === 1001) {
        // server cleared any cookies; guide user to reset flow
        warning(res.message || 'Password reset required.');
        // router.replace(
        //   `/reset-password?userId=${encodeURIComponent(res.userId)}&username=${encodeURIComponent(payload.username)}`
        // );
        return;
      }

      // status === 200
      success('Signed in successfully');
      router.replace('/');
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        error(e.message || 'Unable to sign in. Please try again.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
        error((e as { message: string }).message);
      } else {
        error('Something went wrong. Please try again later.');
      }
    }
  };


  const onFinishFailed = () => {
    warning('Please fill in both username and password.');
  };

  return (
    <Card className="w-[492px] max-w-[440px] shadow-card backdrop-blur-md p-6 z-4">
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

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        initialValues={{ username: usernameFromQuery || "" }}
      // initialValues={{ username: usernameFromQuery || "RA175900435", password: "Asdf@1234" }}
      >
        {/* Username */}
        <Form.Item
          label={<span className="text-gray-500">Username</span>}
          name="username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input
            size="large"
            placeholder="Enter Username"
            prefix={<UserOutlined />}
            className="!rounded-xl"
            autoComplete="username"
          />
        </Form.Item>

        {/* Forgot username */}
        <div className="flex justify-end -mt-2 mb-3">
          <Link href="/forgot-username">
            <span className="text-xs text-[#8B8B8B]">Forget Username?</span>
          </Link>
        </div>

        {/* Password */}
        <Form.Item
          label={<span className="text-gray-500">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please enter password' }]}
        >
          <Input.Password
            size="large"
            placeholder="Enter Password"
            prefix={<LockOutlined />}
            className="!rounded-xl"
            autoComplete="current-password"
          />
        </Form.Item>

        {/* Forgot password */}
        <div className="flex justify-end -mt-2 mb-4">
          <Link href="/forgot-password">
            <span className="text-xs text-[#8B8B8B]">Forget Password?</span>
          </Link>
        </div>

        {/* Login button */}
        <Form.Item>
          <Button
            htmlType="submit"
            block
            type="primary"
            loading={isPending}
            disabled={isPending}
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
            <Link href="/signup">
              <span className="text-xs text-[#FFC107] font-semibold underline">Sign Up</span>
            </Link>
          </Space>
        </div>
      </Form>
    </Card>
  );
};
