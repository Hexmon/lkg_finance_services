"use client";

import React, { useMemo, useRef, useState } from "react";
import { Typography, Button, Input, Modal, Form, Tag } from "antd";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { useParams, useRouter } from "next/navigation";
import { useCheckSender } from "@/features/retailer/dmt/sender/data/hooks";
import { useMessage } from "@/hooks/useMessage";
import AddsenderModal from "@/components/money-transfer/AddsenderModal";
import { useTransactionSummaryQuery } from "@/features/retailer/general";
import TransactionsPaged from "@/components/money-transfer/Transaction";

const { Title } = Typography;

export default function MoneyTransferServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const [senderMobile, setSenderMobile] = useState("");
  const router = useRouter();
  const [form] = Form.useForm();
  type RouteParams = { service_id: string };
  const { service_id } = useParams<RouteParams>();
  const { error, info, success } = useMessage()

  const { checkSender, checkSenderAsync, data: { status: checkSenderRegStatus, message: checkSenderRegMsg } = {}, error: checkSenderRegError, isLoading: checkSenderRegLoading } = useCheckSender();
  const { data: { data: transactionData } = {}, isLoading: transactionLoading } = useTransactionSummaryQuery({
    page: 1,
    per_page: 5,
    order: "desc",
  })

  const onSubmit = async (values: { senderMobile: string }) => {
    try {
      const res = await checkSenderAsync({
        mobile_no: values.senderMobile,
        service_id,
      });

      // Open onboarding modal when no sender present
      if (!res?.sender) {
        info(res?.message ?? "Sender not found. Please verify to onboard.");
        setIsModalOpen(true);
        return;
      }

      // else: you have a sender; proceed (e.g., navigate or load beneficiaries)
      // success("Sender verified");
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 400) {
        info(err?.message ?? "Sender not found. Please verify to onboard.");
        setIsModalOpen(true);
      } else {
        error(err?.message ?? "Something went wrong while checking sender.");
      }
    }
  };

  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="" pageTitle="Dashboards" isLoading={transactionLoading}>
      <DashboardSectionHeader
        title="Money Transfer Service"
        titleClassName="!text-[#3386FF] !font-semibold !text-[32px]"
        arrowClassName="!text-[#3386FF]"
      />

      <div className="p-6 !h-16 !w-full">
        <CardLayout
          elevation={2}
          rounded="rounded-2xl"
          padding="p-6"
          bgColor="bg-white"
          width="w-full"
          className="!w-full"
          header={
            <Title level={5} className="!mb-6 !font-medium !text-[20px]">
              Transfer payment anytime anywhere and to any Indian banks.
            </Title>
          }
          body={
            <>
              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
              >
                <div className="mb-2 flex items-start gap-3">
                  <Form.Item
                    name="senderMobile"
                    className="mb-0 flex-1"
                    rules={[
                      { required: true, message: "Enter mobile number" },
                      { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit number starting with 6–9" },
                    ]}
                  >
                    <Input
                      placeholder="Enter Sender Mobile Number"
                      className="!h-[52px] flex-1"
                      maxLength={10}
                      inputMode="numeric"
                      pattern="\d*"
                      allowClear
                      disabled={checkSenderRegLoading}
                      prefix={<span className="text-gray-500 mr-1">+91</span>}
                    />
                  </Form.Item>

                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      const valid = /^[6-9]\d{9}$/.test(getFieldValue("senderMobile") || "");
                      return (
                        <Button
                          htmlType="submit"
                          type="primary"
                          className="!bg-[#3386FF] !h-[52px] !w-[155px] !rounded-[12px] !text-white"
                          disabled={!valid}
                          loading={checkSenderRegLoading}
                        >
                          Continue
                        </Button>
                      );
                    }}
                  </Form.Item>
                </div>
              </Form>
              <>
                <h2 className="font-medium text-[20px]">Recent Transactions</h2>
                <TransactionsPaged />
              </>
            </>
          }
          footer={
            <div className="flex justify-end">
              <Button
                type="primary"
                className="!bg-[#3386FF] w-[111px] !rounded-[9px] !text-[10px]"
                onClick={() => setIsBeneficiaryModalOpen(true)}
              >
                + Add Beneficiary
              </Button>
            </div>
          }
        />

        {/* Add Beneficiary Modal */}
        <Modal
          title="Add Beneficiary"
          open={isBeneficiaryModalOpen}
          footer={null}
          onCancel={() => setIsBeneficiaryModalOpen(false)}
          className="custom-modal"
        >
          <Form layout="vertical" className="w-[527px]">
            <Form.Item
              label="Beneficiary Account No *"
              name="beneficiaryAccountNo"
              rules={[{ required: true, message: "Please enter Beneficiary Account Number" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Beneficiary Account Number" />
            </Form.Item>

            <Form.Item
              label="Confirm Account No *"
              name="confirmAccountNo"
              dependencies={["beneficiaryAccountNo"]}
              rules={[
                { required: true, message: "Please confirm Account Number" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value === getFieldValue("beneficiaryAccountNo")) return Promise.resolve();
                    return Promise.reject(new Error("Account numbers do not match"));
                  },
                }),
              ]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Confirm Account Number" />
            </Form.Item>

            <Form.Item
              label="Bank Name *"
              name="bankName"
              rules={[{ required: true, message: "Please enter Bank Name" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Bank Name" />
            </Form.Item>

            <Form.Item
              label="IFSC Code *"
              name="ifscCode"
              rules={[
                { required: true, message: "Please enter IFSC Code" },
                { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Enter valid IFSC (e.g., HDFC0001234)" },
              ]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter IFSC Code" />
            </Form.Item>

            <Form.Item
              label="Mobile No *"
              name="mobileNo"
              rules={[
                { required: true, message: "Please enter Mobile Number" },
                { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
              ]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Mobile Number" maxLength={10} inputMode="numeric" />
            </Form.Item>

            <Form.Item
              label="Address *"
              name="address"
              rules={[{ required: true, message: "Please enter Address" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Address" />
            </Form.Item>

            <Form.Item
              label="Beneficiary Name *"
              name="beneficiaryName"
              rules={[{ required: true, message: "Please enter Beneficiary Name" }]}
              className="w-[444px] h-[39px]"
            >
              <Input placeholder="Enter Beneficiary Name" />
            </Form.Item>

            <div className="flex justify-center">
              <Button
                type="primary"
                block
                className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Add Sender Modal */}
        <AddsenderModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service_id={service_id}
        />

      </div>
      <div className="bg-transparent"></div>
    </DashboardLayout>
  );
}
