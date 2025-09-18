// src/components/money-transfer/AddBeneficiariesModal.tsx
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Form, Input, Button, Alert } from "antd";
import SmartModal from "@/components/ui/SmartModal";
import { debounce } from "@/utils/debounce";
import { useVerifyIfsc } from "@/features/retailer/dmt/beneficiaries/data/hooks";
import { useAepsBankList } from "@/features/retailer/cash_withdrawl/data/hooks";

export type AddBeneficiaryFormValues = {
  beneficiaryAccountNo: string;
  confirmAccountNo: string;
  bankName: string;
  ifscCode: string;
  mobileNo: string;
  address: string;
  beneficiaryName: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: AddBeneficiaryFormValues) => void | Promise<void>;
  initialValues?: Partial<AddBeneficiaryFormValues>;
  loading?: boolean;
  service_id: string;
};

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function AddBeneficiariesModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading,
  service_id,
}: Props) {
  const [form] = Form.useForm<AddBeneficiaryFormValues>();

  // IFSC verify hook
  const {
    verifyIfscAsync,
    data: verifyIFCCData,
    isLoading: isVerifying,
    error: verifyErr,
  } = useVerifyIfsc();

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "ok" | "fail">("idle");
  const lastVerifiedIfscRef = useRef<string>("");

  // watch fields
  const ifsc: string | undefined = Form.useWatch("ifscCode", form);
  const bankNameField: string | undefined = Form.useWatch("bankName", form);

  // --- NEW: controlled query value for bank list (derived from Bank Name field)
  const [bankQuery, setBankQuery] = useState<string>("");

  // --- NEW: keep bankQuery in sync with Bank Name field
  useEffect(() => {
    const v = (bankNameField ?? "").trim();
    // only fire queries when we have at least 2 chars to avoid noisy upstream calls
    setBankQuery(v.length >= 2 ? v : "");
  }, [bankNameField]);

  // --- NEW: call useAepsBankList with { service_id, bank_name }
  const {
    data: bankListData,
    error: bankListError,
    isLoading: bankListLoading,
  } = useAepsBankList(
    {
      service_id,
      bank_name: bankQuery, // required by your updated schema
    },
    Boolean(service_id && bankQuery) // enable only when both present
  );

  // debounced IFSC verify
  const debouncedVerify = useMemo(
    () =>
      debounce(async (code: string) => {
        try {
          const payload = await verifyIfscAsync({ ifsc_code: code });

          // Be defensive about shape: some hooks return {data,...}, some return raw
          const root = (payload as any) ?? {};
          const data = root.data ?? root;

          // Determine success using real fields from your sample response
          const ok =
            data?.responseCode === "000" ||
            data?.success === true ||
            /success/i.test(String(data?.respDesc ?? data?.responseReason ?? ""));

          const bankFromApi =
            data?.bankName ?? data?.bank ?? ""; // prefer bankName as per your sample

          if (form.getFieldValue("ifscCode") === code) {
            lastVerifiedIfscRef.current = code;
            setVerifyStatus(ok ? "ok" : "fail");

            if (ok && bankFromApi) {
              // Fill Bank Name -> also triggers bank list fetch
              form.setFieldsValue({ bankName: bankFromApi });
            }
          }
        } catch (e) {
          // only flip to fail if user hasn't changed IFSC in the meantime
          if (form.getFieldValue("ifscCode") === code) {
            setVerifyStatus("fail");
          }
        }
      }, 500),
    [form, verifyIfscAsync]
  );


  // trigger on valid IFSC
  useEffect(() => {
    if (!ifsc || !IFSC_REGEX.test(ifsc)) {
      setVerifyStatus("idle");
      return;
    }
    if (ifsc !== lastVerifiedIfscRef.current) {
      setVerifyStatus("idle");
      debouncedVerify(ifsc);
    }
  }, [ifsc, debouncedVerify]);

  // --- NEW: when bank list arrives, find and log the exact matching bank object
  useEffect(() => {
    const bn = (bankNameField ?? "").trim();
    if (!bn || !bankListData?.bankList?.length) return;

    // Upstream item key is "Bank Name"
    const match = bankListData.bankList.find(
      (it: any) => (it?.["Bank Name"] ?? "").toLowerCase() === bn.toLowerCase()
    );

    if (match) {
      // For now, just log the matched object as requested
      // You can extend this to set hidden fields like IIN, etc., later.
      // eslint-disable-next-line no-console
      console.log("[AEPS bank match]", match);
    } else {
      // eslint-disable-next-line no-console
      console.log("[AEPS bank match] No exact match for:", bn);
    }
  }, [bankListData, bankNameField]);

  // Disable other fields while verifying
  const disableOthers = isVerifying;

  const handleFinish = async (values: AddBeneficiaryFormValues) => {
    await Promise.resolve(onSubmit?.(values));
  };

  return (
    <SmartModal
      open={open}
      onClose={onClose}
      ariaLabel="Add Beneficiary"
      centered
      animation="scale"
      closeOnBackdrop={false}
      closeOnEsc={false}
      contentClassName="w-full max-w-[560px]"
      bodyClassName="px-4 py-4"
    >
      <SmartModal.Header className="flex items-center justify-between">
        <span className="text-lg font-semibold">Add Beneficiary</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-full p-1 leading-none hover:bg-gray-100"
        >
          ×
        </button>
      </SmartModal.Header>

      <SmartModal.Body className="flex justify-center">
        <Form
          form={form}
          layout="vertical"
          className="w-[527px]"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          <Form.Item
            label="IFSC Code *"
            name="ifscCode"
            normalize={(v: unknown) =>
              typeof v === "string" ? v.toUpperCase() : String(v ?? "").toUpperCase()
            }
            rules={[
              { required: true, message: "Please enter IFSC Code" },
              { pattern: IFSC_REGEX, message: "Enter valid IFSC (e.g., HDFC0001234)" },
            ]}
            extra={
              (isVerifying
                ? "Verifying IFSC..."
                : verifyStatus === "ok"
                  ? "IFSC verified ✅"
                  : verifyStatus === "fail"
                    ? "IFSC verification failed"
                    : null) as React.ReactNode
            }
            className="w-[444px]"
          >
            <Input placeholder="Enter IFSC Code" className="h-[39px]" maxLength={11} />
          </Form.Item>

          {verifyStatus === "fail" && (
            <Alert
              type="error"
              showIcon
              message="IFSC verification failed"
              description="Please check IFSC code and try again."
              style={{ marginBottom: 12 }}
            />
          )}


          <Form.Item
            label="Beneficiary Account No *"
            name="beneficiaryAccountNo"
            rules={[{ required: true, message: "Please enter Beneficiary Account Number" }]}
            className="w-[444px]"
          >
            <Input
              autoFocus
              placeholder="Enter Beneficiary Account Number"
              inputMode="numeric"
              className="h-[39px]"
              disabled={disableOthers}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Account No *"
            name="confirmAccountNo"
            dependencies={["beneficiaryAccountNo"]}
            rules={[
              { required: true, message: "Please confirm Account Number" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value === getFieldValue("beneficiaryAccountNo")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Account numbers do not match"));
                },
              }),
            ]}
            className="w-[444px]"
          >
            <Input
              placeholder="Confirm Account Number"
              inputMode="numeric"
              className="h-[39px]"
              disabled={disableOthers}
            />
          </Form.Item>

          {/* Auto-filled from IFSC verify response OR typed by user; drives bank list fetch */}
          <Form.Item
            label="Bank Name *"
            name="bankName"
            rules={[{ required: true, message: "Please enter Bank Name" }]}
            className="w-[444px]"
            extra={
              (bankQuery && bankListLoading
                ? "Fetching bank list..."
                : bankListError
                  ? "Could not fetch bank list"
                  : null) as React.ReactNode
            }
          >
            <Input placeholder="Enter Bank Name" className="h-[39px]" disabled={disableOthers} />
          </Form.Item>

          <Form.Item
            label="Mobile No *"
            name="mobileNo"
            rules={[
              { required: true, message: "Please enter Mobile Number" },
              { pattern: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
            ]}
            className="w-[444px]"
          >
            <Input
              placeholder="Enter Mobile Number"
              maxLength={10}
              inputMode="numeric"
              className="h-[39px]"
              disabled={disableOthers}
            />
          </Form.Item>

          <Form.Item
            label="Address *"
            name="address"
            rules={[{ required: true, message: "Please enter Address" }]}
            className="w-[444px]"
          >
            <Input placeholder="Enter Address" className="h-[39px]" disabled={disableOthers} />
          </Form.Item>

          <Form.Item
            label="Beneficiary Name *"
            name="beneficiaryName"
            rules={[{ required: true, message: "Please enter Beneficiary Name" }]}
            className="w-[444px]"
          >
            <Input placeholder="Enter Beneficiary Name" className="h-[39px]" disabled={disableOthers} />
          </Form.Item>

          <div className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
              disabled={isVerifying}
            >
              Submit
            </Button>
          </div>
        </Form>
      </SmartModal.Body>
    </SmartModal>
  );
}
