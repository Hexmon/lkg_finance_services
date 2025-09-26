/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Card, Typography, Button, Alert } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

import {
  useBbpsBillerListQuery,
  useBbpsPlanPullQuery,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";

import type {
  Biller,
  BillerInputParam,
  Plan,
  BillFetchResponse,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

import BillerSelect from "@/components/bbps/BillerSelect";
import BillPreviewCard from "@/components/bbps/BillPreviewCard";
import DynamicParamsForm from "@/components/bbps/DynamicParamsForm";
import PlanMDMFullScreenModal from "@/components/bbps/PlanMDMFullScreenModal";
import AddCustomerModal from "@/components/bbps/AddCustomerModal";
import { BillValidationRequest } from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue";
import { useBbpsBillValidationMutation } from "@/features/retailer/retailer_bbps/bbps-online/bill_validation/data/hooks";

const { Title } = Typography;
const STORAGE_KEY = "bbps:lastBillFetch";

export default function BillerPage() {
  const { service_id, bbps_category_id, biller_category } = useParams() as {
    service_id: string;
    biller_category: string;
    bbps_category_id: string;
  };
  const decodedCategory = decodeURIComponent(biller_category);
  const router = useRouter();

  const {
    data: billersRaw = [],
    isError,
    error,
    isLoading,
  } = useBbpsBillerListQuery({
    service_id,
    bbps_category_id,
    is_offline: false,
    mode: "ONLINE",
  });

  // Normalize unknown → Biller[]
  const billers = React.useMemo(() => {
    const d: any = billersRaw;
    if (Array.isArray(d)) return d as Biller[];
    if (Array.isArray(d?.data)) return d.data as Biller[];
    return [];
  }, [billersRaw]);

  const [billerId, setBillerId] = React.useState<string | undefined>(undefined);
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(undefined);
  const [planModalOpen, setPlanModalOpen] = React.useState(false);
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
  const [fetchErrorText, setFetchErrorText] = React.useState<string | null>(null);
  const [previewResp, setPreviewResp] = React.useState<BillFetchResponse | null>(null);

  const selectedBiller: Biller | undefined = React.useMemo(
    () =>
      billers.find(
        (b) => (b as any)?.biller_id === billerId || (b as any)?.billerId === billerId
      ),
    [billers, billerId]
  );
  console.log({ billers });

  // read both snake_case and camelCase to be resilient to upstream shape
  const billerStatus = selectedBiller?.billerStatus ?? "INACTIVE";
  const billerPaymentExactness = selectedBiller?.billerPaymentExactness ?? null;
  const planReq = selectedBiller?.planMdmRequirement ?? "NOT_SUPPORTED";
  const fetchReq = selectedBiller?.billerFetchRequiremet ?? "NOT_REQUIRED";
  const billValidation = selectedBiller?.billerSupportBillValidation ?? "NOT_REQUIRED";
  const rawInputs: BillerInputParam[] = (selectedBiller as any)?.inputParams ?? [];

  const isActive = billerStatus === "ACTIVE";

  const paymentExactness = (billerPaymentExactness || null) as "EXACT" | "RANGE" | null;
  const inputs: BillerInputParam[] = (rawInputs || []).filter((p) => p?.is_visible);

  const {
    data: { data: { planDetails: planDetailsRaw = [] } = {} } = {},
    isFetching: isPlanFetching,
  } = useBbpsPlanPullQuery(
    { service_id, billerId: billerId || "", mode: "ONLINE" },
    { query: { enabled: !!billerId && planReq === "MANDATORY" } }
  );

  const plans: Plan[] = React.useMemo(() => {
    const now = new Date();
    return planDetailsRaw.filter((p: any) => {
      if (p.status !== "ACTIVE") return false;
      const fromOK = !p.effectiveFrom || new Date(p.effectiveFrom) <= now;
      const toOK = !p.effectiveTo || new Date(p.effectiveTo) >= now;
      return fromOK && toOK;
    });
  }, [planDetailsRaw]);

  // Reset on biller change
  useEffect(() => {
    setFormValues({});
    setSelectedPlan(undefined);
    setFetchErrorText(null);
    setPlanModalOpen(false);
    setPreviewResp(null);
  }, [billerId]);

  // Validation (no Redux/mobile check here; mobile captured in modal)
  const isInputValid = (v: string, pattern?: string | null) => {
    if (!pattern) return true;
    try {
      return new RegExp(pattern).test(v ?? "");
    } catch {
      return true;
    }
  };

  const baseFormValid = React.useMemo(() => {
    if (!selectedBiller || !isActive) return false;

    for (const p of inputs) {
      const val = formValues[p?.param_name] ?? "";
      if (!p.is_optional && !val) return false;
      if (val && !isInputValid(val, p.regex_pattern ?? undefined)) return false;
      if (p.min_length != null && val.length < p.min_length) return false;
      if (p.max_length != null && val.length > p.max_length) return false;
    }
    return true;
  }, [selectedBiller, isActive, inputs, formValues]);

  const planSatisfied = planReq !== "MANDATORY" || !!selectedPlan;
  const canOpenModal = baseFormValid && isActive && planSatisfied;

  // Prepare inputParams payload for modal
  const payloadInputs = React.useMemo(
    () =>
      inputs.map((p) => ({
        paramName: p.param_name,
        paramValue: formValues[p.param_name] ?? "",
      })),
    [inputs, formValues]
  );

  console.log({ payloadInputs });

  const { mutateAsync: billValidationAsync } = useBbpsBillValidationMutation<unknown>({
    onError: (e: any) => {
      const raw = e?.data ?? e?.response?.data ?? e?.body ?? e?.payload ?? e?.raw ?? e;
      const pick = (obj: any, key: string) =>
        obj && typeof obj === "object" && typeof obj[key] === "string" ? obj[key] : undefined;
      const msg =
        (typeof raw === "object" && (pick(raw, "responseReason") || pick(raw, "message"))) ||
        (typeof raw === "string" ? raw : undefined) ||
        "Bill validation failed";
      setFetchErrorText(String(msg));
    },
    onSuccess: () => {
      setFetchErrorText(null);
    },
  });

  // ⬇️ NEW: helpers to derive validation inputs (no guesses beyond common keys)
  const deriveCustomerId = React.useCallback((): string | null => {
    // Use the single visible param value as customerId (e.g., Prepaid Meter Number)
    if (payloadInputs.length === 1) {
      const v = payloadInputs[0]?.paramValue?.trim();
      return v ? v : null;
    }
    return null;
  }, [payloadInputs]);

  const deriveAmountFromPlan = React.useCallback((): string | null => {
    if (!selectedPlan) return null;
    const raw =
      (selectedPlan as any)?.amountInRupees ??
      (selectedPlan as any)?.amount ??
      (selectedPlan as any)?.rechargeAmount ??
      (selectedPlan as any)?.price ??
      (selectedPlan as any)?.mrp ??
      null;
    if (raw == null) return null;
    return String(raw);
  }, [selectedPlan]);

  const handleFetch = () => {
    if (!selectedBiller || !isActive) return;
    if (!baseFormValid) return;

    // Enforce plan selection when required (auto-open also happens elsewhere)
    if (planReq === "MANDATORY" && !selectedPlan) {
      setPlanModalOpen(true);
      return;
    }

    // Always open the customer modal; pipeline runs inside the modal now
    setCustomerModalOpen(true);
  };

const ccf1Config =
  (selectedBiller as any)?.interchangeFeeCCF1 ??
  (selectedBiller as any)?.interchange_fee_ccf1 ??
  null;

  // Errors
  const billerErr =
    isError ? ((error as any)?.data?.error?.message ?? "Failed to load billers.") : undefined;

  // ---- Plan modal auto-open sentinel to avoid reopen loops ----
  const planAutoOpenedForRef = React.useRef<string | null>(null);

  useEffect(() => {
    planAutoOpenedForRef.current = null;
  }, [billerId]);

  useEffect(() => {
    if (!billerId) return;

    const alreadyOpenedForThisBiller = planAutoOpenedForRef.current === billerId;

    if (
      planReq === "MANDATORY" &&
      !selectedPlan &&
      !planModalOpen &&
      !isPlanFetching &&
      plans.length > 0 &&
      !alreadyOpenedForThisBiller
    ) {
      planAutoOpenedForRef.current = billerId;
      setPlanModalOpen(true);
    }
  }, [billerId, planReq, selectedPlan, planModalOpen, isPlanFetching, plans]);

  return (
    <DashboardLayout
      activePath="/bill_payment"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
      isLoading={isLoading}
    >
      <div className="min-h-screen w-full mb-3">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader title={decodedCategory} subtitle="Recharge" showBack />
          <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
        </div>

        <Card className="rounded-2xl shadow-md w-full">
          <div className="flex items-center gap-2 mb-8">
            <Image src="/wifi.svg" alt="wifi" width={21} height={21} />
            <Title level={5} className="!mb-0">
              Select {decodedCategory}
            </Title>
          </div>

          {billerErr && <Alert type="error" showIcon message={billerErr} className="mb-4" />}

          <div className="flex flex-col gap-4 ml-6">
            <BillerSelect
              billers={billers}
              value={billerId}
              onChange={setBillerId}
              showInactiveWarning={!!billerId && !isActive}
            />

            <DynamicParamsForm
              inputs={inputs}
              values={formValues}
              onChange={(name, val) => setFormValues((prev) => ({ ...prev, [name]: val }))}
            />

            <Button
              type="primary"
              block
              disabled={!canOpenModal}
              className={`!h-[45px] !rounded-[12px] !text-white ${canOpenModal ? "!bg-[#3386FF]" : "!bg-[#3386FF] !cursor-not-allowed !opacity-60"
                }`}
              onClick={handleFetch}
            >
              Fetch Bill Details
            </Button>

            {fetchReq === "MANDATORY" && fetchErrorText && (
              <Alert className="mt-3" type="error" showIcon message={fetchErrorText} />
            )}

            {/* Preview from modal's successful billFetch */}
            {previewResp?.billFetchResponse && (
              <BillPreviewCard resp={previewResp.billFetchResponse} exactness={paymentExactness} />
            )}
          </div>
        </Card>
      </div>

      {/* Full-screen Plan MDM modal */}
      <PlanMDMFullScreenModal
        open={planModalOpen}
        mandatory={planReq === "MANDATORY"}
        loading={isPlanFetching}
        plans={plans}
        onCancel={() => setPlanModalOpen(false)}
        onSelect={(p) => {
          setSelectedPlan(p);
          setPlanModalOpen(false);
          // lock auto-open for this biller
          planAutoOpenedForRef.current = billerId ?? planAutoOpenedForRef.current;
          // After choosing plan, proceed to customer modal (Bill Fetch happens after customer submit)
          if (baseFormValid && isActive) {
            setCustomerModalOpen(true);
          }
        }}
        title={`Select a ${decodedCategory} Plan`}
      />

      {/* Customer Details Modal (does Bill Fetch on submit) */}
      <AddCustomerModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        serviceId={service_id}
        billerId={(selectedBiller as any)?.biller_id || (selectedBiller as any)?.billerId || ""}
        inputParams={payloadInputs}
        bbps_category_id={bbps_category_id}
        biller_category={decodedCategory}
        fetchReq={fetchReq}
        ccf1Config={ccf1Config}
        billValidation={billValidation}
        onSuccess={(resp) => {
          // Show preview on the page after success
          setPreviewResp(resp as any);
          setFetchErrorText(null);
        }}
      />
    </DashboardLayout>
  );
}
