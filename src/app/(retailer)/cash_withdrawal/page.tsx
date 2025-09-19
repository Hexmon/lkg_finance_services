"use client";

import BiometricVerification from "@/components/cash-withdraw/BiometricVerification";
import IdentityVerified from "@/components/cash-withdraw/IdentityVerified";
import VerificationFailed from "@/components/cash-withdraw/VerificationFailed";
import VerifyingIdentity from "@/components/cash-withdraw/VerifyingIdentity";
import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { useServiceList } from "@/features/retailer/services";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { useAppSelector } from "@/lib/store";
import { selectProfileName, selectProfileUsername } from "@/lib/store/slices/profileSlice";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

export default function CashWithdraw() {
    const [step, setStep] = useState<number>(0);
    const [verificationStatus, setVerificationStatus] =
        useState<"pending" | "success" | "failed">("pending");
    const username = useAppSelector(selectProfileUsername);
    const name = useAppSelector(selectProfileName);

    const profileData = useAppSelector((s) => s.profile.data);
    const userId = profileData?.user_id ?? "";

    // fetch AEPS service_id as before
    const {
        data: { data: serviceData } = {},
        isLoading: serviceLoading,
    } = useServiceList({ category: "AEPS" });

    const services = Array.isArray(serviceData) ? serviceData : [];
    const aepsId: string = services.find((s: any) => s.label === "AEPS")?.service_id ?? "";

    return (
        <DashboardLayout
            sections={cashWithdrawSidebarConfig}
            activePath="/cash_withdrawal"
            isLoading={serviceLoading}
            pageTitle="Cash Withdrawal"
        >
            <div className="max-w-[450px] mx-auto mb-[7px]">
                <div className="flex justify-between">
                    <Button
                        size="middle"
                        className="!text-[10px] !border-0 !bg-white shadow-md rounded-[9px] !text-black"
                    >
                        <ArrowLeftOutlined /> Back to Service
                    </Button>
                    <Button
                        size="middle"
                        className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF]"
                    >
                        Secure Verification
                    </Button>
                </div>
            </div>

            {/* Step 0: Enter Aadhaar + hit Start (this calls 2FA inside the component) */}
            {step === 0 && (
                <BiometricVerification
                    userName={name ?? username ?? ""}
                    service_id={aepsId}
                    user_id={userId}
                    onStart={() => {
                        // ONLY move to step 2 when 2FA API returns success from the child
                        setVerificationStatus("pending");
                        setStep(2);
                    }}
                />
            )}

            {/* We skip ScanFingerPrint (step 1) – you said go directly to step 2 */}

            {/* Step 2: Verify outcome */}
            {step === 2 &&
                <VerifyingIdentity
                    userName={name ?? username ?? ""}
                    onSuccess={() => {
                        setVerificationStatus("success");
                        setStep(3);
                    }}
                    onFailure={() => {
                        setVerificationStatus("failed");
                    }}
                />}

            {/* Step 3: Success screen */}
            {step === 3 && <IdentityVerified userName={name ?? username ?? ""} aepsId={aepsId} />}

            <div className="!text-center h-8 flex items-center !mx-auto mt-4 shadow-xl w-fit bg-white rounded-xl">
                <span className="mx-4 text-sm">
                    <SafetyCertificateOutlined /> Your biometric data is encrypted and secure
                </span>
            </div>
        </DashboardLayout>
    );
}
