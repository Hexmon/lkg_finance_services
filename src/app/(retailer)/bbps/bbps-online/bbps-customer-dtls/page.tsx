"use client";

import React from "react";
import { Card, Typography, Form, Input, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";

const { Title, Text } = Typography;

export default function CustomerDetailsForm() {
  return (

    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Back + Title */}
        <div className="flex items-center gap-2 mb-6 text-blue-700">
          <LeftOutlined />
          <Title level={3} className="!mb-0">
            Customer Details
          </Title>
        </div>
        <Text type="secondary" className="block mb-4">
          Customer Input Details
        </Text>

        {/* Card Form */}
        <Card className="rounded-2xl shadow-md w-full">
          <Form layout="vertical">
            <Form.Item
              label="Customer Name"
              name="customerName"
              rules={[{ required: true, message: "Please enter customer name" }]}
            >
              <Input size="large" placeholder="Enter Customer Name" />
            </Form.Item>

            <Form.Item
              label="Customer Mobile Number"
              name="mobileNumber"
              rules={[{ required: true, message: "Please enter mobile number" }]}
            >
              <Input size="large" placeholder="Enter Mobile Number" />
            </Form.Item>

            <Form.Item label="Customer Email" name="email">
              <Input size="large" placeholder="Enter Email Address" />
            </Form.Item>

            <Form.Item label="PAN / Aadhaar Number" name="idNumber">
              <Input size="large" placeholder="Enter PAN / Aadhaar Number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" size="large" block>
                Proceed
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
