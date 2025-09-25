// src/components/money-transfer/NewTransfer.tsx
"use client";

import { Card, Button, Input, Typography, message } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"; // <-- add useRouter
import React from "react";

import type { Beneficiary } from "@/features/retailer/dmt/sender";
import { useFundTransfer } from "@/features/retailer/dmt/fund-transfer/data/hooks";
import { useVerifyTransferOtp } from "@/features/retailer/dmt/fund-transfer/data/hooks";
import { useCheckSender } from "@/features/retailer/dmt/sender"; // <-- to get sender_name (no UI change)

const { Text, Title } = Typography;

type NewTransferProps = {
  sender_id?: string;
  beneficiary?: Beneficiary;
};

export default function NewTransfer({ sender_id, beneficiary }: NewTransferProps) {
  const router = useRouter(); // <-- router
  const { service_id, mobile_no } = useParams<{ service_id: string; mobile_no: string }>(); // <-- get mobile for sender fetch

  const [amountStr, setAmountStr] = React.useState<string>("");
  const [otp, setOtp] = React.useState<string>("");
  const [txnId, setTxnId] = React.useState<string | null>(null);

  // handy ids
  const beneficiary_id = beneficiary?.beneficiary_id;

  // hooks
  const { fundTransferAsync, isLoading: isSendingOtp } = useFundTransfer();
  const { verifyTransferOtpAsync, isLoading: isVerifyingOtp } = useVerifyTransferOtp();

  // fetch sender (to show sender_name on success page)
  const { checkSenderAsync, data: senderData } = useCheckSender();
  React.useEffect(() => {
    if (service_id && mobile_no) {
      checkSenderAsync({ service_id, mobile_no }).catch(() => {});
    }
  }, [service_id, mobile_no, checkSenderAsync]);

  const sender_name = senderData?.sender?.sender_name ?? "Sender";

  // display (unchanged)
  const displayName = beneficiary?.b_name ?? "";
  const displayBank = beneficiary?.bankname ?? "SBI";
  const maskedAccount = beneficiary?.lastfour ? `*****${beneficiary.lastfour}` : "*****1234";
  const displayIfsc = "—";

  const parseAmount = (v: string) => {
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  };

  const extractTxnId = (res: any): string | null =>
    res?.txn_id ?? res?.data?.txn_id ?? null;

  const handleSendOtp = async () => {
    const amt = parseAmount(amountStr);

    if (!service_id) return message.error("Missing service_id.");
    if (!sender_id) return message.error("Missing sender_id.");
    if (!beneficiary_id) return message.error("Missing beneficiary_id.");
    if (!Number.isFinite(amt) || amt <= 0) return message.error("Please enter a valid amount.");

    try {
      const res = await fundTransferAsync({
        service_id,
        sender_id,
        beneficiary_id,
        amount: amt,
      });

      const tx = extractTxnId(res);
      if (tx) setTxnId(tx);
      message.success(res?.message ?? "OTP sent successfully.");
    } catch (e: any) {
      message.error(e?.message ?? "Failed to send OTP.");
    }
  };

  const handleVerifyAndTransfer = async () => {
    if (!service_id) return message.error("Missing service_id.");
    if (!txnId) return message.error("Please send OTP first.");
    if (!otp || !otp.trim()) return message.error("Please enter OTP.");

    try {
      const res = await verifyTransferOtpAsync({
        service_id,
        txn_id: txnId,
        otp: otp.trim(),
      });

      // Persist minimal success payload for success page
      try {
        const amt = parseAmount(amountStr);
        sessionStorage.setItem(
          "mt:last_success",
          JSON.stringify({
            txn_id: txnId,
            amount: Number.isFinite(amt) ? amt : undefined,
            sender_name,
            ts: Date.now(),
            // keep anything else you’d like to show later:
            // beneficiary_name: beneficiary?.b_name,
            // raw: res,
          })
        );
      } catch { /* ignore */ }

      message.success(res?.message ?? "Transfer successful.");
      router.push("/money_transfer/payment_success"); // <-- navigate
    } catch (e: any) {
      message.error(e?.message ?? "OTP verification failed. Please try again.");
    }
  };

  return (
    <div className=" min-h-screen w-full">
      <Card className="rounded-2xl shadow-md mb-6">
        <div className="mb-8">
          <Title level={4} className="!mb-1">Transfer</Title>
          <Text type="secondary">Choose the best option for your transfer</Text>
        </div>

        <div className="flex items-center justify-center">
          <div className="p-4 rounded-[15px] shadow-xl grid items-start gap-4 w-fit bg-white">
            <div className="flex items-start gap-4">
              <div className="bg-[#5298FF54] rounded-full w-[55px] h-[55px] flex items-center justify-center shrink-0">
                <Image src="/person-blue.svg" alt="person image" width={28} height={28} className="object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <Text strong className="text-[15px]">{displayName}</Text>
                    <Text type="secondary" className="text-[14px]">{displayBank}</Text>
                  </div>
                  <a className="text-blue-600 text-[14px] ml-6">Sender → Receiver</a>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between">
                    <Text type="secondary">Account:</Text>
                    <Text className="font-semibold">{maskedAccount}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">IFSC Code:</Text>
                    <Text strong>{displayIfsc}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Text className="text-[#232323] font-semibold">Transfer Amount</Text>
          <Input
            prefix="₹"
            placeholder="0.00"
            className="mt-1"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            suffix={<span className="text-xs text-gray-400">Min: ₹100 | Max: ₹2,00,000</span>}
          />
        </div>

        <div className="mb-6">
          <Text className="text-[#232323] font-semibold">OTP</Text>
          <div className="flex gap-2 mt-1">
            <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button loading={isSendingOtp} onClick={handleSendOtp}>Send OTP</Button>
          </div>
        </div>

        <Button
          type="primary"
          className="!bg-[#3386FF] w-full h-[44px] text-white rounded-[9px] !text-[12px] !font-medium"
          loading={isVerifyingOtp}
          onClick={handleVerifyAndTransfer}
        >
          Transfer Money
        </Button>
      </Card>
    </div>
  );
}
