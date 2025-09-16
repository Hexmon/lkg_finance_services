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
    useBbpsBillerFetchMutation,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch";

import type {
    Biller,
    BillerInputParam,
    Plan,
    BillFetchResponse,
} from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

import { useAppSelector, selectCustomer } from "@/lib/store";
import BillerSelect from "@/components/bbps/BillerSelect";
import BillPreviewCard from "@/components/bbps/BillPreviewCard";
import DynamicParamsForm from "@/components/bbps/DynamicParamsForm";
import PlanMDMFullScreenModal from "@/components/bbps/PlanMDMFullScreenModal";

const { Title } = Typography;

export default function BillerPage() {
    const router = useRouter()
    /** ── route params ─────────────────────────────── */
    const { service_id, bbps_category_id } = useParams() as {
        service_id: string;
        bbps_category_id: string;
    };

    /** ── customer from Redux ──────────────────────── */
    const customer = useAppSelector(selectCustomer);
    const customerMobile = customer?.mobileNumber ?? "";

    /** ── biller list ──────────────────────────────── */
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

    /** ── local state ─────────────────────────────── */
    const [billerId, setBillerId] = React.useState<string | undefined>(undefined);
    const [formValues, setFormValues] = React.useState<Record<string, string>>({});
    const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>(undefined);
    const [planModalOpen, setPlanModalOpen] = React.useState(false);

    // Show only text message from backend (prefer "errorMessage")
    const [fetchErrorText, setFetchErrorText] = React.useState<string | null>(null);

    /** ── selected biller + flags ─────────────────── */
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

    /** ── plan pull (enabled only when biller chosen & plan is mandatory) ─ */
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

    /** ── bill fetch mutation ─────────────────────── */
    const {
        mutate: billFetch,
        data: billFetchData,
        isPending: isBillFetching,
        reset: resetBillFetch,
    } = useBbpsBillerFetchMutation({
        onError: (e: any) => {
            // Extract only "errorMessage" (with sensible fallbacks if missing)
            const raw =
                e?.data ??
                e?.response?.data ??
                e?.body ??
                e?.payload ??
                e?.raw ??
                e;

            const pick = (obj: any, key: string) =>
                obj && typeof obj === "object" && typeof obj[key] === "string" ? obj[key] : undefined;

            // Prefer errorMessage in common locations
            let msg: string | undefined =
                (typeof raw === "object" && pick(raw, "errorMessage")) ||
                (typeof raw === "object" && raw?.data && pick(raw.data, "errorMessage")) ||
                (typeof raw === "object" && raw?.errorInfo && pick(raw.errorInfo, "errorMessage")) ||
                (typeof raw === "object" && raw?.data?.errorInfo && pick(raw.data.errorInfo, "errorMessage"));

            // Fallbacks (only if errorMessage missing)
            if (!msg) {
                msg =
                    (typeof raw === "object" && pick(raw, "message")) ||
                    (typeof raw === "object" && raw?.data && pick(raw.data, "message")) ||
                    (typeof raw === "object" && raw?.errorInfo && pick(raw.errorInfo, "message")) ||
                    (typeof raw === "object" && raw?.data?.errorInfo && pick(raw.data.errorInfo, "message")) ||
                    (typeof raw === "object" && pick(raw, "responseMessage")) ||
                    (typeof raw === "object" && raw?.data && pick(raw.data, "responseMessage")) ||
                    (typeof raw === "object" && pick(raw, "respReason")) ||
                    (typeof raw === "object" && raw?.data && pick(raw.data, "respReason")) ||
                    (typeof raw === "string" ? raw : undefined) ||
                    e?.message;
            }

            setFetchErrorText(msg || "Something went wrong");
        },
        onSuccess: () => setFetchErrorText(null),
    });

    const { billFetchResponse: preview } =
        (billFetchData ?? ({} as BillFetchResponse)) as BillFetchResponse;

    /** ── effects ─────────────────────────────────── */
    useEffect(() => {
        // reset on biller change
        setFormValues({});
        setSelectedPlan(undefined);
        setFetchErrorText(null);
        resetBillFetch();
        setPlanModalOpen(false); // no auto-open; open on button click instead
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billerId]);

    /** ── validation ──────────────────────────────── */
    const isInputValid = (v: string, pattern?: string | null) => {
        if (!pattern) return true;
        try {
            return new RegExp(pattern).test(v ?? "");
        } catch {
            return true;
        }
    };

    // Base validity (does NOT enforce plan selection)
    const baseFormValid = React.useMemo(() => {
        if (!selectedBiller || !isActive) return false;

        for (const p of inputs) {
            const val = formValues[p.param_name] ?? "";
            if (!p.is_optional && !val) return false;
            if (val && !isInputValid(val, p.regex_pattern ?? undefined)) return false;
            if (p.min_length != null && val.length < p.min_length) return false;
            if (p.max_length != null && val.length > p.max_length) return false;
        }

        // Enforce customer mobile from Redux (no input on UI)
        if (!/^\d{10}$/.test(customerMobile)) return false;

        return true;
    }, [selectedBiller, isActive, inputs, formValues, customerMobile]);

    const planSatisfied = planReq !== "MANDATORY" || !!selectedPlan;
    const canFetchNow = baseFormValid && isActive && fetchReq === "MANDATORY" && planSatisfied;

    /** ── actual fetch trigger ────────────────────── */
    const doBillFetch = React.useCallback(() => {
        if (!selectedBiller) return;

        const payloadInputs = inputs.map((p) => ({
            paramName: p.param_name,
            paramValue: formValues[p.param_name] ?? "",
        }));

        try {
            billFetch({
                service_id,
                mode: "ONLINE",
                body: {
                    billerId: selectedBiller.biller_id,
                    customerInfo: { customerMobile },
                    inputParams: {
                        input: payloadInputs.length === 1 ? payloadInputs[0] : payloadInputs,
                    },
                },
            });
            router.push(`http://localhost:3000/bill_payment/bbps-online/${service_id}/bbps-broadband-postpaid/{}/biller`)
        } catch (error) {
            
        }

    }, [billFetch, inputs, formValues, selectedBiller, service_id, customerMobile]);

    /** ── CTA behavior ────────────────────────────── */
    const handleFetch = () => {
        // Only in MANDATORY fetch mode
        if (fetchReq !== "MANDATORY" || !selectedBiller || !isActive) return;

        // Check base validity (inputs/mobile/biller)
        if (!baseFormValid) return;

        // If plan is mandatory but not chosen -> open full-screen modal instead of mutating
        if (planReq === "MANDATORY" && !selectedPlan) {
            setPlanModalOpen(true);
            return;
        }

        // All green -> fetch
        doBillFetch();
    };

    /** ── UI errors ───────────────────────────────── */
    const billerErr =
        isError ? ((error as any)?.data?.error?.message ?? "Failed to load billers.") : undefined;

    const missingReduxMobile = !customerMobile || !/^\d{10}$/.test(customerMobile);

    /** ── render ───────────────────────────────────── */
    return (
        <DashboardLayout
            activePath="/bill_payment"
            sections={billPaymentSidebarConfig}
            pageTitle="Bill Payment"
            isLoading={isLoading}
        >
            <div className="min-h-screen w-full mb-3">
                <div className="flex justify-between items-center">
                    <DashboardSectionHeader title="Broadband Postpaid" subtitle="Recharge" showBack />
                    <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
                </div>

                <Card className="rounded-2xl shadow-md w-full">
                    <div className="flex items-center gap-2 mb-8">
                        <Image src="/wifi.svg" alt="wifi" width={21} height={21} />
                        <Title level={5} className="!mb-0">
                            Select Broadband Biller
                        </Title>
                    </div>

                    {billerErr && <Alert type="error" showIcon message={billerErr} className="mb-4" />}

                    {missingReduxMobile && (
                        <Alert
                            type="warning"
                            showIcon
                            className="mb-4"
                            message="Customer mobile number is missing."
                            description="This screen uses the mobile number from Redux (customer.details.mobileNumber). Please set it before fetching the bill."
                        />
                    )}

                    <div className="flex flex-col gap-4 ml-6">
                        {/* Biller dropdown (no auto-select) */}
                        <BillerSelect
                            billers={billers}
                            value={billerId}
                            onChange={setBillerId}
                            showInactiveWarning={!!billerId && !isActive}
                        />

                        {/* Dynamic input params */}
                        <DynamicParamsForm
                            inputs={inputs}
                            values={formValues}
                            onChange={(name, val) => setFormValues((prev) => ({ ...prev, [name]: val }))}
                        />

                        {/* Fetch Bill — enabled when base valid; if plan mandatory & not chosen, clicking opens modal */}
                        <Button
                            type="primary"
                            block
                            disabled={
                                isBillFetching || fetchReq !== "MANDATORY" || !isActive || !baseFormValid
                            }
                            loading={isBillFetching}
                            className={`!h-[45px] !rounded-[12px] !text-white ${baseFormValid && fetchReq === "MANDATORY" && isActive
                                    ? "!bg-[#3386FF]"
                                    : "!bg-[#3386FF] !cursor-not-allowed !opacity-60"
                                }`}
                            onClick={handleFetch}
                        >
                            Fetch Bill Details
                        </Button>

                        {/* Show only backend's errorMessage (or sensible fallback) */}
                        {fetchReq === "MANDATORY" && fetchErrorText && (
                            <Alert
                                className="mt-3"
                                type="error"
                                showIcon
                                message={fetchErrorText}
                            />
                        )}

                        {preview && <BillPreviewCard resp={preview} exactness={paymentExactness} />}
                    </div>
                </Card>
            </div>

            {/* Full-screen Plan MDM modal — opens on CTA when mandatory & no plan chosen */}
            <PlanMDMFullScreenModal
                open={planModalOpen}
                mandatory={planReq === "MANDATORY"}
                loading={isPlanFetching}
                plans={plans}
                onCancel={() => setPlanModalOpen(false)}
                onSelect={(p) => {
                    setSelectedPlan(p);
                    setPlanModalOpen(false);
                    // If everything else valid, continue to fetch immediately
                    if (baseFormValid && isActive && fetchReq === "MANDATORY") {
                        doBillFetch();
                    }
                }}
                title="Select a Broadband Plan"
            />
        </DashboardLayout>
    );
}
