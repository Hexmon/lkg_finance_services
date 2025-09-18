"use client";

import React, { useState, useMemo, useRef } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import Image from "next/image";
import { services } from "@/config/app.config";
import { useRouter } from "next/navigation";
import { apiAepsBankList } from "@/features/retailer/cash_withdrawl/data/endpoints";
import { useAepsTransaction } from "@/features/retailer/cash_withdrawl/data/hooks";
import { useAppSelector } from "@/lib/store"; // to get user_id
import SmartSelect, { SmartOption } from "../ui/SmartSelect";

const { Title, Text } = Typography;

export default function AEPSFormPage() {
  const router = useRouter();
  const { aepsTransactionAsync, isLoading } = useAepsTransaction();

  // profile → user_id
  const profileData = useAppSelector((s) => s.profile.data);
  const userId = profileData?.user_id ?? "";

  // form state
  const [customerName, setCustomerName] = useState("");
  const [bank, setBank] = useState<string | undefined>(undefined); // stores IIN as string
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");

  // biometric (placeholder: replace with your scanner output)
  const [biometricString, setBiometricString] = useState("Base64EncodedBiometricDataHere==");

  // fingerprint UI state (toggle)
  const [fingerCaptured, setFingerCaptured] = useState(false);

  // validations
  const isValidName = customerName.trim().length >= 2;
  const isValidBank = !!bank;
  const isValidAadhaar = /^\d{12}$/.test(aadhaar);
  const isValidMobile = /^[6-9]\d{9}$/.test(mobile);
  const isValidAmount = Number(amount) > 0;

  const canProcess = useMemo(
    () =>
      fingerCaptured &&
      isValidName &&
      isValidBank &&
      isValidAadhaar &&
      isValidMobile &&
      isValidAmount,
    [fingerCaptured, isValidName, isValidBank, isValidAadhaar, isValidMobile, isValidAmount]
  );

  const handleScanToggle = () => {
    setFingerCaptured((prev) => !prev);
    // setBiometricString(...) ← set this from your scanner SDK when available
  };

  // AEPS service id (you can also fetch dynamically via useServiceList)
  const AEPS_SERVICE_ID = "2a249a83-d924-4bae-8976-5e12c52dea30";

  // SmartSelect → remote bank search (no dropdown until user types)
  const banksCacheRef = useRef<SmartOption<string>[] | null>(null);
  const searchBanks = async (term: string): Promise<SmartOption<string>[]> => {
    const cleaned = term.trim().toLowerCase();
    if (!cleaned) return [];
    if (!banksCacheRef.current) {
      const resp = await apiAepsBankList({ service_id: AEPS_SERVICE_ID });
      const mapped: SmartOption<string>[] = (resp.bankList ?? [])
        .map((row: any) => {
          const bankName = String(row["Bank Name"] ?? "").trim();
          const iinRaw = row["IIN"];
          const iin = iinRaw == null ? "" : String(iinRaw);
          if (!bankName || !iin) return null;
          return {
            value: iin, // <- we store IIN in "bank" state
            label: `${bankName} (${iin})`,
            meta: { bankName, iin, ifsc: row["IFSC"], micr: row["MICR"], bankCode: row["Bank Code"] },
          } as SmartOption<string>;
        })
        .filter(Boolean) as SmartOption<string>[];
      banksCacheRef.current = mapped;
    }
    const all = banksCacheRef.current!;
    return all.filter((opt) => {
      const m = (opt.meta as any) || {};
      const text = `${opt.label ?? ""} ${m.bankName ?? ""} ${m.iin ?? ""} ${m.ifsc ?? ""} ${m.bankCode ?? ""}`.toLowerCase();
      return text.includes(cleaned);
    });
  };

  const handleProcess = async () => {
    if (!canProcess) return;

    try {
      // Build AEPS transaction payload
      // - using request_type 'W' for withdrawal
      // - iin from selected bank
      // - service_id optional but recommended
      // - amount must be number
      const payload = {
        user_id: userId,
        service_id: AEPS_SERVICE_ID,
        iin: bank!, // IIN (6 digits) stored in "bank"
        request_type: "W" as const, // or use transaction_type: 'CASH_WITHDRAWAL'
        aadhaar_number: aadhaar,
        biometric_data: biometricString,
        cust_mobile: mobile,
        amount: Number(amount),
        latlng: "12.252~45.521", // replace with actual location if available
      };

      const res = await aepsTransactionAsync(payload);
      message.success(res?.message || "Transaction initiated");
      router.push("/cash_withdrawal/payment_successful");
    } catch (err: any) {
      message.error(err?.message || "AEPS transaction failed");
    }
  };

  return (
    <div className=" bg-transparent space-y-3 ml-0">
      {/* AEPS Services */}
      <div className="bg-white rounded-2xl shadow-md p-6 !w-full">
        <Title level={5}>Select AEPS Service</Title>
        <Text type="secondary">Choose the service you want to provide</Text>

        <div className="flex justify-center gap-6 flex-wrap mt-4">
          {services.map(({ key, label, icon }) => (
            <Image
              key={key}
              src={icon}
              alt={label}
              width={139}
              height={137}
              className="object-contain"
              priority
            />
          ))}
        </div>
      </div>

      {/* AEPS Transaction Form */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="mb-11">
          <div className="flex items-center">
            <Image src="/aeps.svg" alt="aeps" width={26} height={28} className="object-contain" />
            <Title level={5} className="mt-1 ml-1.5">AEPS Transaction Details</Title>
          </div>
          <Text type="secondary" className="ml-8">
            Fill in the customer and transaction information
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-4 ml-8">
          <div className="flex flex-col w-full max-w-[444px]">
            <label className="text-sm font-medium">Customer Name *</label>
            <Input
              placeholder="Enter Customer Name"
              className="rounded-lg h-11 mt-1"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              status={customerName && !isValidName ? "error" : undefined}
            />
          </div>

          {/* Smart searchable bank select (initially empty) */}
          <div className="flex flex-col w-full max-w-[444px]">
            <label className="text-sm font-medium">Select Bank *</label>
            <SmartSelect<string>
              placeholder="Choose Bank"
              className="w-full rounded-lg h-11 mt-1"
              remote
              debounceMs={300}
              initialRemoteOptions={[]}
              searchFn={searchBanks}
              allowClear
              value={bank ?? null}
              onChange={(val) => setBank(val ?? undefined)}
              dropdownMatchSelectWidth
            />
            <Text type="secondary" className="text-xs mt-1">
              Start typing to search bank by name, IIN or IFSC
            </Text>
          </div>

          <div className="flex flex-col w-full max-w={[444px].join(' ')">
            <label className="text-sm font-medium">Aadhaar number *</label>
            <Input.Password
              placeholder="Enter 12-digit Aadhaar number"
              className="rounded-lg h-11 mt-1"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
              status={aadhaar && !isValidAadhaar ? "error" : undefined}
            />
            <Text type="secondary" className="text-xs mt-1">Digits only, 12 characters</Text>
          </div>

          <div className="flex flex-col w-full max-w-[444px]">
            <label className="text-sm font-medium">Mobile Number *</label>
            <Input
              placeholder="+91 **********"
              className="rounded-lg h-11 mt-1"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              status={mobile && !isValidMobile ? "error" : undefined}
            />
          </div>

          <div className="md:col-span-2 flex flex-col w-full max-w-[444px]">
            <label className="text-sm font-medium">Enter Amount *</label>
            <Input.Password
              placeholder="Enter amount"
              className="rounded-lg h-11 mt-1"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              status={amount && !isValidAmount ? "error" : undefined}
            />
          </div>
        </div>

        {/* Fingerprint Capture */}
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="w-20 h-20 bg-white shadow-inner rounded-full flex items-center justify-center">
            <Image src="/biometric.svg" alt="fingerprint" width={90} height={90} />
          </div>
          <Text className="mt-2 font-medium">
            {fingerCaptured ? "Fingerprint Captured ✓" : "Capture Fingerprint"}
          </Text>
          <Text type="secondary" className="text-xs">Ask customer to place finger on scanner</Text>
          <Button
            className="!mt-4 !bg-[#3386FF] !text-white !rounded-lg !px-10 !h-10 !w-[219px]"
            onClick={handleScanToggle}
          >
            <Image src="/scanner-w.svg" alt="biometric" width={15} height={15} className="object-contain mr-2" />
            {fingerCaptured ? "Recapture" : "Scan Now"}
          </Button>
        </div>

        {/* Process Button → calls AEPS transaction hook */}
        <Button
          block
          className={`!mt-6 h-12 !rounded-lg ${
            canProcess ? "!bg-[#3386FF] !text-white" : "!bg-[#5298FF54] !text-white"
          }`}
          disabled={!canProcess || isLoading}
          onClick={handleProcess}
        >
          <Image src="/aeps-white.svg" alt="aeps" width={15} height={15} className="object-contain mr-2" />
          {isLoading ? "Processing..." : "Process AEPS Transaction"}
        </Button>
      </div>
    </div>
  );
}
