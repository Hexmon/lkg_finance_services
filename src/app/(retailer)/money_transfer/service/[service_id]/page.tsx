/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Typography, Button, Input, Modal, Form } from "antd";
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
// import SenderCheckFormPaypoint from "@/components/money-transfer/form/SenderCheckFormPaypoint";
import SenderCheckFormBillAvenue, { BankId, SenderCheckWithOptionsValues } from "@/components/money-transfer/form/SenderCheckFormBillAvenue";
import AddBeneficiariesModal from "@/components/money-transfer/AddBeneficiariesModal";
import SmartModal from "@/components/ui/SmartModal";

const { Title } = Typography;

export default function MoneyTransferServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBeneficiaryModalOpen, setIsBeneficiaryModalOpen] = useState(false);
  const router = useRouter();
  const [bankType, setBankType] = useState<BankId | undefined>('ARTL')

  type RouteParams = { service_id: string };
  const { service_id } = useParams<RouteParams>();
  const { error, info } = useMessage()

  const { checkSenderAsync, data: { message: checkSenderRegMsg, bio_required } = {}, error: checkSenderRegError, isLoading: checkSenderRegLoading } = useCheckSender();
  const { data: { data: transactionData } = {}, isLoading: transactionLoading, error: transactionError } = useTransactionSummaryQuery({ page: 1, per_page: 5, order: "desc" })

  // in MoneyTransferServicePage()
  const [senderId, setSenderId] = useState<string | null>(null);

  const onSubmitWithOptions = async (values: SenderCheckWithOptionsValues) => {
    try {
      const res = await checkSenderAsync({
        mobile_no: values.senderMobile,
        bankId: values.bankId,
        txnType: values.txnType,
        service_id,
      });

      // If no sender → open onboarding modal
      if (!res?.sender) {
        info(res?.message ?? "Sender not found. Please verify to onboard.");
        setIsModalOpen(true);
        setSenderId(null);
        return;
      }

      // ✅ Extract sender_id from the response (try a few common shapes)
      const sid =
        (res as any)?.sender_id ??
        (res as any)?.sender?.sender_id ??
        (res as any)?.sender?.id ??
        (res as any)?.sender?.SenderId ??
        null;

      setSenderId(sid);
      // Optionally: info("Sender verified");
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      if (status === 400) {
        info(err?.message ?? "Sender not found. Please verify to onboard.");
        setIsModalOpen(true);
        setSenderId(null);
      } else {
        error(err?.message ?? "Something went wrong while checking sender.");
      }
    }
  };


  const handleAddBeneficiary = async () => {
    // TODO: call your API here
    // await addBeneficiaryAsync({ ...values, service_id });
    // success("Beneficiary added!");
    setIsBeneficiaryModalOpen(false);
  };


  return (
    <DashboardLayout sections={moneyTransferSidebarConfig} activePath="" pageTitle="Dashboards" error={[checkSenderRegError, transactionError]} isLoading={transactionLoading}>
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
              <SenderCheckFormBillAvenue
                onSubmit={onSubmitWithOptions}
                loading={checkSenderRegLoading}
                setBankType={(bank) => setBankType(bank)}
              />
              <h2 className="font-medium text-[20px]">Recent Transactions</h2>
              <TransactionsPaged isLoading={transactionLoading} transactionData={transactionData ?? []} />
            </>
          }
          footer={
            <div className="flex justify-end">
              <Button
                type="primary"
                className="!bg-[#3386FF] w-[111px] !rounded-[9px] !text-[10px]"
                onClick={() => {
                  if (!senderId) {
                    info("Please verify sender first.");
                    return;
                  }
                  setIsBeneficiaryModalOpen(true);
                }}
              >
                + Add Beneficiary
              </Button>

            </div>
          }
        />

        {/* Add Beneficiary Modal */}
        <AddBeneficiariesModal
          open={isBeneficiaryModalOpen}
          onClose={() => setIsBeneficiaryModalOpen(false)}
          onSubmit={handleAddBeneficiary}
          // loading={isAddingBeneficiary}
          service_id={senderId ?? ""} sender_id={senderId ?? ""}        />

        {/* Add Sender Modal */}
        <AddsenderModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service_id={service_id}
          bankType={bankType || "ARTL"}
        />

      </div>

      <div className="bg-transparent"></div>
    </DashboardLayout>

  );
}
