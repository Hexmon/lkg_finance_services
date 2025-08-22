'use client';

import React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useChangePasswordMutation } from '../data/hooks';

export default function ChangePasswordForm() {
  const { mutateAsync, isPending } = useChangePasswordMutation();

  async function onFinish(values: { oldpassword: string; password: string; confirm: string }) {
    if (values.password !== values.confirm) {
      message.error('Passwords do not match');
      return;
    }
    try {
      await mutateAsync({ oldpassword: values.oldpassword, password: values.password });
      message.success('Password updated successfully');
    } catch (e) {
      message.error('Failed to change password');
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded-2xl shadow">
      <Typography.Title level={4} className="!mb-4">Change Password</Typography.Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="oldpassword" label="Current password" rules={[{ required: true }]}>
          <Input.Password placeholder="Current password" />
        </Form.Item>
        <Form.Item name="password" label="New password" rules={[{ required: true, min: 8 }]}>
          <Input.Password placeholder="New password" />
        </Form.Item>
        <Form.Item name="confirm" label="Confirm new password" rules={[{ required: true, min: 8 }]}>
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block>
          Update Password
        </Button>
      </Form>
    </div>
  );
}
