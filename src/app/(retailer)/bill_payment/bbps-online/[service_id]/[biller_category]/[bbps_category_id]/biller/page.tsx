/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Card, Typography, Button, Alert } from "antd";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
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
import AddCustomerModal from "@/components/bbps/AddCustomerModal"; // NEW

const { Title } = Typography;

export default function BillerPage() {
    const { service_id, bbps_category_id, biller_category } = useParams() as {
        service_id: string;
        biller_category: string;
        bbps_category_id: string;
    };
    const decodedCategory = decodeURIComponent(biller_category);
    // ── biller list
    const {
        data: { data: billers = [] } = {},
        isError,
        error,
        isLoading,
    } = useBbpsBillerListQuery({
        service_id,
        bbps_category_id,
        is_offline: false,
        mode: "ONLINE",
    });

    // ── local state
    const [billerId, setBillerId] = React.useState<string | undefined>(undefined);
    const [formValues, setFormValues] = React.useState<Record<string, string>>({});
    const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(undefined);
    const [planModalOpen, setPlanModalOpen] = React.useState(false);

    // NEW: Customer modal + local preview/error
    const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
    const [fetchErrorText, setFetchErrorText] = React.useState<string | null>(null);
    const [previewResp, setPreviewResp] = React.useState<BillFetchResponse | null>(null);

    // ── selected biller + flags
    const selectedBiller: Biller | undefined = React.useMemo(
        () => billers.find((b) => b.biller_id === billerId),
        [billers, billerId]
    );

    const {
        biller_status = "INACTIVE",
        biller_payment_exactness = null,
        planMdmRequirement: planReqRaw = "NOT_SUPPORTED",
        biller_fetch_requiremet: fetchReqRaw = "NOT_REQUIRED",
        inputParams: rawInputs = [],
    } = selectedBiller ?? ({} as Biller);

    const isActive = biller_status === "ACTIVE";
    const planReq = (planReqRaw || "NOT_SUPPORTED") as "MANDATORY" | "OPTIONAL" | "NOT_SUPPORTED";
    const fetchReq = (fetchReqRaw || "NOT_REQUIRED") as "MANDATORY" | "OPTIONAL" | "NOT_REQUIRED";
    const paymentExactness = (biller_payment_exactness || null) as "EXACT" | "RANGE" | null;
    const inputs: BillerInputParam[] = (rawInputs || []).filter((p) => p?.is_visible);

    // ── plan pull
    const {
        data: { data: { planDetails: planDetailsRaw = [] } = {} } = {},
        isFetching: isPlanFetching,
    } = useBbpsPlanPullQuery(
        { service_id, billerId: billerId || "", mode: "ONLINE" },
        { query: { enabled: !!billerId && planReq === "MANDATORY" } }
    );

    const plans: Plan[] = React.useMemo(() => {
        const now = new Date();
        return planDetailsRaw.filter((p) => {
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
            const val = formValues[p.param_name] ?? "";
            if (!p.is_optional && !val) return false;
            if (val && !isInputValid(val, p.regex_pattern ?? undefined)) return false;
            if (p.min_length != null && val.length < p.min_length) return false;
            if (p.max_length != null && val.length > p.max_length) return false;
        }
        return true;
    }, [selectedBiller, isActive, inputs, formValues]);

    const planSatisfied = planReq !== "MANDATORY" || !!selectedPlan;
    const canOpenModal = baseFormValid && isActive && fetchReq === "MANDATORY";

    // Prepare inputParams payload for modal
    const payloadInputs = React.useMemo(
        () =>
            inputs.map((p) => ({
                paramName: p.param_name,
                paramValue: formValues[p.param_name] ?? "",
            })),
        [inputs, formValues]
    );

    // CTA
    const handleFetch = () => {
        if (fetchReq !== "MANDATORY" || !selectedBiller || !isActive) return;
        if (!baseFormValid) return;
        if (planReq === "MANDATORY" && !selectedPlan) {
            setPlanModalOpen(true);
            return;
        }
        // Open customer modal; API call happens inside it
        setCustomerModalOpen(true);
    };

    // Errors
    const billerErr =
        isError ? ((error as any)?.data?.error?.message ?? "Failed to load billers.") : undefined;

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
                            <BillPreviewCard
                                resp={previewResp.billFetchResponse}
                                exactness={paymentExactness}
                            />
                        )}
                    </div>
                </Card>
            </div>

            {/* Full-screen Plan MDM modal (unchanged) */}
            <PlanMDMFullScreenModal
                open={planModalOpen}
                mandatory={planReq === "MANDATORY"}
                loading={isPlanFetching}
                plans={plans}
                onCancel={() => setPlanModalOpen(false)}
                onSelect={(p) => {
                    setSelectedPlan(p);
                    setPlanModalOpen(false);
                    // After choosing plan, allow opening the customer modal
                    if (baseFormValid && isActive && fetchReq === "MANDATORY") {
                        setCustomerModalOpen(true);
                    }
                }}
                title="Select a Broadband Plan"
            />

            {/* NEW: Customer Details Modal (does the API call) */}
            <AddCustomerModal
                open={customerModalOpen}
                onClose={() => setCustomerModalOpen(false)}
                serviceId={service_id}
                billerId={selectedBiller?.biller_id || ""}
                inputParams={payloadInputs}
                bbps_category_id={bbps_category_id}
                biller_category={decodedCategory}
                onSuccess={(resp) => {
                    // Show preview on the page after success
                    setPreviewResp(resp);
                    setFetchErrorText(null);
                }}
            />
        </DashboardLayout>
    );
}
