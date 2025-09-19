"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SmartSelect, { SmartOption } from "../ui/SmartSelect";
import { useAepsBankList } from "@/features/retailer/cash_withdrawl/data/hooks";
import { mapBankListToOptions } from "@/utils/mapBankListToOptions";
import { useAepsTransaction } from "@/features/retailer/cash_withdrawl/data/hooks"; // <- ADD
import { useMessage } from "@/hooks/useMessage";
import { useAppSelector } from "@/lib/store";
import { biometricString } from "@/config/app.config";

const { Title, Text } = Typography;

function toLatLngTilde(geo?: GeolocationPosition | null) {
  if (!geo) return "0~0";
  const { latitude, longitude } = geo.coords || {};
  const lat = typeof latitude === "number" ? latitude : 0;
  const lng = typeof longitude === "number" ? longitude : 0;
  return `${lat}~${lng}`;
}

export default function AEPSTransactionForm() {
  const [form] = Form.useForm();
  const { service_id } = useParams() as { service_id?: string };
  const { error, success } = useMessage()
  const router = useRouter()

  // bank select
  const [bankOption, setBankOption] = useState<SmartOption<string> | null>(null);

  // search + open state driven by SmartSelect (debounced term bubbled up)
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  // RD capture
  const [fingerCaptured, setFingerCaptured] = useState(false);
  const [biometricTemplate, setBiometricTemplate] = useState<string | null>(null);

  // geo
  const [geo, setGeo] = useState<GeolocationPosition | null>(null);
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeo(pos),
        () => setGeo(null), // fail silently -> fallback "0~0"
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, []);

  // BANK LIST (debounced, hook-driven)
  const canSearch = Boolean(
    open && service_id && typeof service_id === "string" && term.trim().length >= 2
  );

  const {
    data: bankResp,
    isFetching: banksLoading,
  } = useAepsBankList(
    {
      service_id: service_id || "",
      bank_name: term.trim(),
    },
    canSearch
  );

  const bankOptions: SmartOption<string>[] = useMemo(() => {
    if (!bankResp?.bankList) return [];
    return mapBankListToOptions(bankResp);
  }, [bankResp]);

  // ✅ AEPS transaction hook
  const {
    aepsTransactionAsync,
    isLoading: txLoading,
    data: txData,
    error: txErr,
    reset: resetTx,
  } = useAepsTransaction();

  // mimic device capture toggle (replace with real RD capture callback)
  const handleScanToggle = () => {
    if (fingerCaptured) {
      setFingerCaptured(false);
      setBiometricTemplate(null);
      return;
    }

    setFingerCaptured(true);
    setBiometricTemplate(biometricString);
  };

  // little helper: pick a 6-digit IIN (schema requires /^\d{6}$/)
  function deriveIIN(opt: SmartOption<string> | null): string | undefined {
    if (!opt) return undefined;
    const val = String(opt.value ?? "");
    if (/^\d{6}$/.test(val)) return val;
    const metaIIN = (opt.meta as any)?.IIN;
    if (metaIIN && /^\d{6}$/.test(String(metaIIN))) return String(metaIIN);
    return undefined;
  }

  const profileData = useAppSelector((s) => s.profile.data);
  const userId = profileData?.user_id ?? "";

  async function handleProcess(values: any) {
    try {
      if (!userId) {
        error("Missing user id. Please sign in again.");
        return;
      }
      if (!biometricTemplate) {
        error("Please capture fingerprint first.");
        return;
      }

      const iin = deriveIIN(bankOption);
      if (!iin) {
        error("Selected bank does not have a valid IIN.");
        return;
      }

      // CASH_WITHDRAWAL flow in this component (amount required)
      const amountNum = Number(values?.amount);
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        message.error("Enter a valid amount for cash withdrawal.");
        return;
      }

      const payload = {
        user_id: userId,
        // include service_id only if it's a valid UUID (schema: optional UUID)
        service_id: typeof service_id === "string" && /^[0-9a-fA-F-]{36}$/.test(service_id)
          ? service_id
          : undefined,

        iin, // 6-digit
        // either transaction_type or request_type required; we send both for clarity
        transaction_type: "CASH_WITHDRAWAL" as const,
        request_type: "W" as const,

        aadhaar_number: String(values?.aadhaar || "").trim(), // 12 digits
        biometric_data: biometricTemplate,                    // base64
        cust_mobile: String(values?.mobile || "").trim(),     // 10 digits
        amount: amountNum,                                     // number
        latlng: toLatLngTilde(geo),                            // "lat~lng"
      };

      const res = await aepsTransactionAsync(payload);
      success("AEPS transaction submitted.");

      const txId = (res as any)?.transaction_id ?? "";
      const amountForQuery = String(amountNum); // number -> string
      const customerName = String(values?.customerName || "").trim();

      success("AEPS transaction submitted.");
      router.push(
        `/cash_withdrawal/payment_successful?tx=${encodeURIComponent(txId)}&amt=${encodeURIComponent(
          amountForQuery
        )}&name=${encodeURIComponent(customerName)}`
      );

      resetTx();
      form.resetFields(["amount"]); // optional
    } catch (e: any) {
      console.error("AEPS TX Error:", e);
      error(e?.message || "Transaction failed");
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleProcess}
      className="bg-white rounded-2xl shadow-md p-6"
      preserve
    >
      {/* Header */}
      <div className="mb-11 ml-3 p-4">
        <div className="flex items-center">
          <Image src="/aeps.svg" alt="aeps" width={26} height={28} className="object-contain" />
          <Title level={5} className="mt-1 ml-1.5">AEPS Transaction Details</Title>
        </div>
        <Text type="secondary" className="ml-8">Fill in the customer and transaction information</Text>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-4 ml-8">
        <Form.Item
          name="customerName"
          label={<span className="text-sm font-medium">Customer Name *</span>}
          rules={[{ required: true, message: "Please enter customer name" }]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input placeholder="Enter Customer Name" className="rounded-lg h-11 mt-1" />
        </Form.Item>

        {/* BANK (hook-driven single-select) */}
        <Form.Item
          name="bank"
          label={<span className="text-sm font-medium">Select Bank *</span>}
          rules={[{ required: true, message: "Please select a bank" }]}
          className="flex flex-col w-full max-w-[444px]"
          getValueFromEvent={(val: string | null) => val}
        >
          <SmartSelect<string>
            options={bankOptions}
            filterOption={() => true}
            placeholder="Search bank by name"
            allowClear
            loading={banksLoading}
            value={bankOption?.value ?? null}
            onChange={(value, option) => {
              const next = option ?? null;
              setBankOption(next);
              form.setFieldsValue({
                bank: value ?? null,
                bankMeta: next?.meta ?? null,
              });
            }}
            onOpenChange={setOpen}
            onSearchTermChange={setTerm}
          />
        </Form.Item>

        {/* keep full bank record if needed */}
        <Form.Item name="bankMeta" noStyle>
          <input type="hidden" />
        </Form.Item>

        <Form.Item
          name="aadhaar"
          label={<span className="text-sm font-medium">Aadhaar number *</span>}
          rules={[
            { required: true, message: "Enter Aadhaar number" },
            { len: 12, message: "Aadhaar must be 12 digits" },
          ]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input.Password
            placeholder="Enter 12-digit Aadhaar number"
            className="rounded-lg h-11 mt-1"
            maxLength={12}
            inputMode="numeric"
            pattern="\d*"
          />
        </Form.Item>

        <Form.Item
          name="mobile"
          label={<span className="text-sm font-medium">Mobile Number *</span>}
          rules={[
            { required: true, message: "Enter mobile number" },
            { len: 10, message: "Mobile must be 10 digits" },
          ]}
          className="flex flex-col w-full max-w-[444px]"
        >
          <Input
            placeholder="+91 **********"
            className="rounded-lg h-11 mt-1"
            maxLength={10}
            inputMode="numeric"
            pattern="\d*"
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label={<span className="text-sm font-medium">Enter Amount *</span>}
          rules={[{ required: true, message: "Please enter amount" }]}
          className="md:col-span-2 flex flex-col w-full max-w-[444px]"
        >
          <Input placeholder="Enter amount" className="rounded-lg h-11 mt-1" type="number" />
        </Form.Item>
      </div>

      {/* Fingerprint Capture */}
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
          <Image src="/biometric.svg" alt="fingerprint" width={90} height={90} />
        </div>
        <Text className="mt-2 font-medium">
          {fingerCaptured ? "Fingerprint Captured ✓" : "Capture Fingerprint"}
        </Text>
        <Text type="secondary" className="text-xs">
          Ask customer to place finger on scanner
        </Text>
        <Button
          className="!mt-4 !bg-[#3386FF] !text-white !rounded-lg !px-10 !h-10 !w-[219px]"
          onClick={handleScanToggle}
        >
          <Image src="/scanner-w.svg" alt="biometric" width={15} height={15} className="object-contain mr-2" />
          {fingerCaptured ? "Recapture" : "Scan Now"}
        </Button>
      </div>

      {/* Process Button */}
      <Form.Item className="mt-6">
        <Button
          block
          htmlType="submit"
          className={`h-12 !rounded-lg mt-4 ${!fingerCaptured || txLoading ? "!bg-[#5298FF54] !text-white" : "!bg-[#3386FF] !text-white"
            }`}
          disabled={!fingerCaptured || txLoading}
        >
          <Image src="/aeps-white.svg" alt="aeps" width={15} height={15} className="object-contain mr-2" />
          {txLoading ? "Processing..." : "Process AEPS Transaction"}
        </Button>
      </Form.Item>
    </Form>
  );
}
