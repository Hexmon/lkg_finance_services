"use client";

import React from "react";
import { Card, Typography, Input, Button, Alert } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";

import {
  useBbpsBillerListQuery,
  useBbpsPlanPullQuery,
  useBbpsBillerFetchMutation,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";

import {
  Biller,
  BillerInputParam,
  Plan,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";
import BillerSelect from "@/components/bbps/BillerSelect";
import BillPreviewCard from "@/components/bbps/BillPreviewCard";
import DynamicParamsForm from "@/components/bbps/DynamicParamsForm";
import PlanChooserModal from "@/components/bbps/PlanChooserModal";

const { Title, Text } = Typography;

export default function BillerPage() {
  const { service_id, bbps_category_id } = useParams() as {
    service_id: string;
    bbps_category_id: string;
  };

  /** ── data: billers ─────────────────────────────── */
  const billerList = useBbpsBillerListQuery({
    service_id,
    bbps_category_id,
    is_offline: false,
    mode: "ONLINE",
  });
  const billers: Biller[] = billerList.data?.data ?? [];

  /** ── local state ───────────────────────────────── */
  const [billerId, setBillerId] = React.useState<string>();
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  const [mobile, setMobile] = React.useState("");
  const [selectedPlan, setSelectedPlan] = React.useState<Plan>();
  const [planModalOpen, setPlanModalOpen] = React.useState(false);
  const [planEnabled, setPlanEnabled] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string>();

  const selectedBiller = billers.find((b) => b.biller_id === billerId);
  const isActive = (selectedBiller?.biller_status ?? "INACTIVE") === "ACTIVE";
  const planReq = (selectedBiller?.planMdmRequirement || "NOT_SUPPORTED") as
    | "MANDATORY" | "OPTIONAL" | "NOT_SUPPORTED";
  const fetchReq = (selectedBiller?.biller_fetch_requiremet || "NOT_REQUIRED") as
    | "MANDATORY" | "OPTIONAL" | "NOT_REQUIRED";
  const paymentExactness = (selectedBiller?.biller_payment_exactness || null) as "EXACT" | "RANGE" | null;

  /** ── plans (enabled on demand) ─────────────────── */
  const planPull = useBbpsPlanPullQuery(
    { service_id, billerId: billerId || "", mode: "ONLINE" },
    { query: { enabled: !!billerId && planEnabled } }
  );
  const plans = React.useMemo(() => {
    const now = new Date();
    return (planPull.data?.data?.planDetails ?? []).filter((p) => {
      if (p.status !== "ACTIVE") return false;
      const fromOK = !p.effectiveFrom || new Date(p.effectiveFrom) <= now;
      const toOK = !p.effectiveTo || new Date(p.effectiveTo) >= now;
      return fromOK && toOK;
    });
  }, [planPull.data]);

  /** ── bill fetch ─────────────────────────────────── */
  const billFetch = useBbpsBillerFetchMutation({
    onError: (e) => setFetchError((e as any)?.message || "Failed to fetch bill."),
    onSuccess: () => setFetchError(undefined),
  });

  /** ── effects ───────────────────────────────────── */
  // pick first ACTIVE biller once
  React.useEffect(() => {
    if (!billerId && billers.length) {
      const first = billers.find((b) => (b.biller_status ?? "INACTIVE") === "ACTIVE") ?? billers[0];
      setBillerId(first.biller_id);
    }
  }, [billers, billerId]);

  // when biller changes, reset & decide plan behavior
  React.useEffect(() => {
    setFormValues({});
    setSelectedPlan(undefined);
    setFetchError(undefined);
    billFetch.reset();

    if (!billerId) return;
    if (planReq === "MANDATORY") {
      setPlanEnabled(true);
      setPlanModalOpen(true);
    } else {
      setPlanEnabled(false);
      setPlanModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billerId, planReq]);

  /** ── validation ─────────────────────────────────── */
  const inputs: BillerInputParam[] = (selectedBiller?.inputParams ?? []).filter((p) => p.is_visible);
  const isInputValid = (v: string, pattern?: string | null) => {
    if (!pattern) return true;
    try { return new RegExp(pattern).test(v ?? ""); } catch { return true; }
  };
  const formValid = React.useMemo(() => {
    if (!selectedBiller || !isActive) return false;
    for (const p of inputs) {
      const v = formValues[p.param_name] ?? "";
      if (!p.is_optional && !v) return false;
      if (v && !isInputValid(v, p.regex_pattern ?? undefined)) return false;
      if (p.min_length != null && v.length < p.min_length) return false;
      if (p.max_length != null && v.length > p.max_length) return false;
    }
    if (!/^\d{10}$/.test(mobile)) return false;
    if (planReq === "MANDATORY" && !selectedPlan) return false;
    return true;
  }, [selectedBiller, isActive, inputs, formValues, mobile, planReq, selectedPlan]);

  /** ── actions ───────────────────────────────────── */
  const handleFetch = () => {
    if (!formValid || !selectedBiller) return;
    const payloadInputs = inputs.map((p) => ({ paramName: p.param_name, paramValue: formValues[p.param_name] ?? "" }));
    billFetch.mutate({
      service_id,
      mode: "ONLINE",
      body: {
        billerId: selectedBiller.biller_id,
        customerInfo: { customerMobile: mobile },
        inputParams: { input: payloadInputs.length === 1 ? payloadInputs[0] : payloadInputs },
      },
    });
  };

  /** ── UI ─────────────────────────────────────────── */
  const billerErr =
    billerList.isError ? ((billerList.error as any)?.data?.error?.message ?? "Failed to load billers.") : undefined;

  return (
    <DashboardLayout
      activePath="/bill_payment"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Payment"
      isLoading={billerList.isLoading}
    >
      <div className="min-h-screen w-full mb-3">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader title="Broadband Postpaid" subtitle="Recharge" showBack />
          <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
        </div>

        <Card className="rounded-2xl shadow-md w-full">
          <div className="flex items-center gap-2 mb-8">
            <Image src="/wifi.svg" alt="wifi" width={21} height={21} />
            <Title level={5} className="!mb-0">Select Broadband Biller</Title>
          </div>

          {billerErr && <Alert type="error" showIcon message={billerErr} className="mb-4" />}

          <div className="flex flex-col gap-4 ml-6">
            <BillerSelect
              billers={billers}
              value={billerId}
              onChange={setBillerId}
              showInactiveWarning={!!billerId && !isActive}
            />

            {/* <div>
              <Text strong>Mobile Number *</Text>
              <Input
                placeholder="10-digit mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                className="mt-1 !h-[54px]"
              />
              {mobile && !/^\d{10}$/.test(mobile) && (
                <div className="text-xs text-red-600 mt-1">Enter a valid 10-digit number.</div>
              )}
            </div> */}

            {planReq === "OPTIONAL" && (
              <Button className="!h-[40px] !rounded-[10px]" onClick={() => { setPlanEnabled(true); setPlanModalOpen(true); }}>
                Choose Plan (optional)
              </Button>
            )}

            <DynamicParamsForm
              inputs={inputs}
              values={formValues}
              onChange={(name, val) => setFormValues((prev) => ({ ...prev, [name]: val }))}
            />

            <Button
              type="primary"
              block
              disabled={!formValid || billFetch.isPending}
              loading={billFetch.isPending}
              className={`!h-[45px] !rounded-[12px] !text-white ${formValid ? "!bg-[#3386FF]" : "!bg-[#3386FF] !cursor-not-allowed !opacity-60"}`}
              onClick={handleFetch}
            >
              Fetch Bill Details
            </Button>

            {fetchReq === "MANDATORY" && fetchError && (
              <Alert className="mt-3" type="error" showIcon message={fetchError} />
            )}

            {billFetch.data?.billFetchResponse && (
              <BillPreviewCard
                resp={billFetch.data.billFetchResponse}
                exactness={paymentExactness}
              />
            )}
          </div>
        </Card>
      </div>

      <PlanChooserModal
        open={planModalOpen}
        mandatory={planReq === "MANDATORY"}
        loading={planPull.isFetching}
        plans={plans}
        onCancel={() => { if (planReq !== "MANDATORY") setPlanModalOpen(false); }}
        onSelect={(p) => { setSelectedPlan(p); setPlanModalOpen(false); }}
      />
    </DashboardLayout>
  );
}
