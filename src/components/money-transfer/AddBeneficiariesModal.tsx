// src/components/money-transfer/AddBeneficiariesModal.tsx
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Form, Input, Button, Alert, message } from "antd"; // <-- message for quick toasts
import SmartModal from "@/components/ui/SmartModal";
import { debounce } from "@/utils/debounce";
import { useVerifyIfsc } from "@/features/retailer/dmt/beneficiaries/data/hooks";
import { useAepsBankList } from "@/features/retailer/cash_withdrawl/data/hooks";
import { useAddBeneficiary } from "@/features/retailer/dmt/beneficiaries/data/hooks"; // <-- ADD THIS
import type { AddBeneficiaryRequest } from "@/features/retailer/dmt/beneficiaries/domain/types";

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
  onSubmit?: (values: AddBeneficiaryFormValues) => void | Promise<void>; // keep if parent still needs it
  initialValues?: Partial<AddBeneficiaryFormValues>;
  loading?: boolean; // deprecated by hook loading, but we’ll respect it if passed
  service_id: string;
  sender_id: string; // <-- ADD THIS (required by API)
};

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export default function AddBeneficiariesModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading,
  service_id,
  sender_id, // <-- ADD THIS
}: Props) {
  const [form] = Form.useForm<AddBeneficiaryFormValues>();

  // IFSC verify hook
  const {
    verifyIfscAsync,
    data: verifyIFCCData,
    isLoading: isVerifying,
    error: verifyErr,
  } = useVerifyIfsc();

  // ADD: add beneficiary hook
  const {
    addBeneficiaryAsync,
    isLoading: isAdding,
    error: addError,
    data: addResult,
  } = useAddBeneficiary();

  const [verifyStatus, setVerifyStatus] = useState<"idle" | "ok" | "fail">("idle");
  const lastVerifiedIfscRef = useRef<string>("");

  // watch fields
  const ifsc: string | undefined = Form.useWatch("ifscCode", form);
  const bankNameField: string | undefined = Form.useWatch("bankName", form);

  // Bank list query trigger
  const [bankQuery, setBankQuery] = useState<string>("");

  useEffect(() => {
    const v = (bankNameField ?? "").trim();
    setBankQuery(v.length >= 2 ? v : "");
  }, [bankNameField]);

  // Fetch bank list using service_id + bank_name
  const {
    data: bankListData,
    error: bankListError,
    isLoading: bankListLoading,
  } = useAepsBankList(
    { service_id, bank_name: bankQuery },
    Boolean(service_id && bankQuery)
  );

  // Track matched bank object so we can send bank_id/bank_code if available
  const [matchedBank, setMatchedBank] = useState<any | null>(null);

  useEffect(() => {
    const bn = (bankNameField ?? "").trim();
    if (!bn || !bankListData?.bankList?.length) {
      setMatchedBank(null);
      return;
    }
    const match = bankListData.bankList.find(
      (it: any) => (it?.["Bank Name"] ?? it?.bank_name ?? "").toLowerCase() === bn.toLowerCase()
    );
    setMatchedBank(match ?? null);
    // eslint-disable-next-line no-console
    console.log("[AEPS bank match]", match ?? "No exact match");
  }, [bankListData, bankNameField]);

  // debounced IFSC verify
  const debouncedVerify = useMemo(
    () =>
      debounce(async (code: string) => {
        try {
          const payload = await verifyIfscAsync({ ifsc_code: code });

          // normalize shape (works with your sample)
          const root = (payload as any) ?? {};
          const data = root.data ?? root;

          const ok =
            data?.responseCode === "000" ||
            data?.success === true ||
            /success/i.test(String(data?.respDesc ?? data?.responseReason ?? ""));

          const bankFromApi = data?.bankName ?? data?.bank ?? "";

          if (form.getFieldValue("ifscCode") === code) {
            lastVerifiedIfscRef.current = code;
            setVerifyStatus(ok ? "ok" : "fail");

            if (ok && bankFromApi) {
              form.setFieldsValue({ bankName: bankFromApi });
            }
          }
        } catch {
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

  // Disable input fields while verifying IFSC or while submitting
  const disableOthers = isVerifying || isAdding;

  // SUBMIT: build AddBeneficiaryRequest and call hook
  const handleFinish = async (values: AddBeneficiaryFormValues) => {
    // Optionally let parent observe raw form values
    if (onSubmit) {
      await Promise.resolve(onSubmit(values));
    }

    // Map form -> AddBeneficiaryRequest
    const payload: AddBeneficiaryRequest = {
      sender_id,
      service_id,
      b_mobile: values.mobileNo,
      b_name: values.beneficiaryName,
      b_account_number: values.beneficiaryAccountNo,
      ifsc_code: values.ifscCode,
      address: values.address,
      bankname: values.bankName,
      account_verification: "N", // default (change to "Y" if you add a toggle)
      // Optional enrichments from matched bank:
      bank_id:
        matchedBank?.id ??
        matchedBank?.BankId ??
        undefined,
      bank_code:
        matchedBank?.["Bank Code"] ??
        matchedBank?.bank_code ??
        undefined,
      // lat/lng optional—add if you have them
      // lat: '...',
      // lng: '...',
    };

    try {
      const res = await addBeneficiaryAsync(payload);
      message.success(res?.message ?? "Beneficiary added successfully");

      // Reset form, close modal
      form.resetFields();
      setMatchedBank(null);
      onClose?.();
    } catch (e: any) {
      // show a friendly error
      const msg =
        e?.data?.message ??
        e?.message ??
        "Failed to add beneficiary. Please check details and try again.";
      message.error(msg);
      // eslint-disable-next-line no-console
      console.error("[addBeneficiary error]", e);
    }
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

          {/* Bank Name drives bank list fetch; matchedBank harvested in effect */}
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
                  : matchedBank
                    ? `Matched: ${matchedBank?.["Bank Name"] ?? matchedBank?.bank_name ?? ""}`
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
              loading={loading || isAdding}
              className="!bg-blue-600 mt-2 !w-[155px] !h-[37px] !rounded-[10px]"
              disabled={isVerifying || isAdding}
            >
              Submit
            </Button>
          </div>

          {!!addError && (
            <Alert
              type="error"
              showIcon
              message="Failed to add beneficiary"
              description={String((addError as any)?.message ?? "Please try again.")}
              style={{ marginTop: 12 }}
            />
          )}

        </Form>
      </SmartModal.Body>
    </SmartModal>
  );
}
