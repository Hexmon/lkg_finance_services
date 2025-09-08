// src/app/(retailer)/bbps/bbps-online/[service_id]/bbps-customer-dtls/page.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { useAppDispatch, useAppSelector, selectCustomer } from "@/lib/store";
import { setCustomerDetails } from "@/lib/store/slices/customerSlice";
import { useMessage } from "@/hooks/useMessage";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
const { Title, Text } = Typography;

type FormValues = {
  customerName: string;
  mobileNumber: string;
  email?: string;
  idNumber?: string;
};

export default function CustomerDetailsForm() {
  const { service_id, bbps_category_id } = useParams() as {
    service_id: string;
    bbps_category_id: string;
  };

  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const { success } = useMessage();
  const dispatch = useAppDispatch();

  // 👇 Grab any previously-saved customer details from Redux (persisted)
  const saved = useAppSelector(selectCustomer);

  // Avoid recreating object on each render
  const initialValues = useMemo<FormValues | undefined>(() => {
    return saved ?? undefined;
  }, [saved]);

  // 👇 Ensure the form is hydrated if saved updates later (e.g., after rehydration)
  useEffect(() => {
    if (saved) {
      form.setFieldsValue(saved);
    }
  }, [saved, form]);

  // (Optional) Live autosave while typing — remove if you only want save on submit
  const handleValuesChange = (_: Partial<FormValues>, all: FormValues) => {
    dispatch(setCustomerDetails(all));
  };

  const onFinish = (values: FormValues) => {
    // Save once more on submit
    dispatch(setCustomerDetails(values));
    success("Customer details saved");
    // ✅ carry both IDs forward in the URL:
    router.push(
      `/bill_payment/bbps-online/${service_id}/bbps-broadband-postpaid/${bbps_category_id}/biller`
    );
  };

  return (
    <DashboardLayout
      activePath="/bbps"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
    >
      <div className="p-8 min-h-screen ">
        <DashboardSectionHeader
          title={<h1 className="!text-black !font-semibold !text-[20px]">Customer Details</h1>}
          subtitle={<span className="text-[#1D1D1D] font-normal text-[12px]">Customer Input Details</span>}
          showBack
        />
        <Card className="!rounded-2xl !shadow-md !w-full !mt-4">
        <Text className="!font-medium !text-[15px] !ml-7 !mb-8">Customer Details</Text>
          <Form<FormValues>
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onValuesChange={handleValuesChange}
            // ⬇️ This pre-fills when the page first mounts
            initialValues={initialValues}
            // keep Ant Form instance state when the component unmounts
            preserve
            className="!ml-7 !mt-6 !text-[12px]"
          >
            <Form.Item
              label="Customer Name *"
              name="customerName"
              rules={[{ message: "Please enter customer name" }]}
            >
              <Input size="large" placeholder="Enter Customer Name" />
            </Form.Item>

            <Form.Item
              label="Customer Mobile Number *"
              name="mobileNumber"
              rules={[
                { message: "Please enter mobile number" },
                { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
              ]}
            >
              <Input size="large" placeholder="Enter Mobile Number" />
            </Form.Item>

            <Form.Item
              label="Customer Email"
              name="email"
              rules={[{ type: "email", message: "Enter a valid email" }]}
            >
              <Input size="large" placeholder="Enter Email Address" />
            </Form.Item>

            <Form.Item label="PAN / Aadhaar Number" name="idNumber">
              <Input size="large" placeholder="Enter PAN / Aadhaar Number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" size="large" block htmlType="submit" className="!bg-[#3386FF] !text-[12px] !mt-6">
                Proceed
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
