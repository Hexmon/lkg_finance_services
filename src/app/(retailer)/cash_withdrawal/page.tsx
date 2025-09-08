"use client";
import BiometricVerification from "@/components/cash-withdraw/BiometricVerification";
import IdentityVerified from "@/components/cash-withdraw/IdentityVerified";
import ScanFingerPrint from "@/components/cash-withdraw/ScanFingerPrint";
import VerificationFailed from "@/components/cash-withdraw/VerificationFailed";
import VerifyingIdentity from "@/components/cash-withdraw/VerifyingIdentity";
import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CashWithdraw() {
    const [step, setStep] = useState<number>(0);
    const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "failed">("pending");

    return (
        <DashboardLayout sections={cashWithdrawSidebarConfig} activePath="/cash_withdrawal" pageTitle="Cash Withdrawal">
            <div className="max-w-[450px] mx-auto mb-[7px]">
                <div className="flex justify-between">
                    <Button size="middle" className="!text-[10px] !border-0 !bg-white shadow-md rounded-[9px] !text-black"><ArrowLeftOutlined /> Back to Service</Button>
                    <Button size="middle" className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF]">Secure Verification</Button>
                </div>
            </div>
            {step === 0 && (
                <BiometricVerification onStart={() => setStep(1)} />
            )}

            {step === 1 && (
                <ScanFingerPrint onStart={() => setStep(2)} />
            )}
            {step === 2 && (
                verificationStatus === "failed" ? (
                    <VerificationFailed
                        onRetry={() => {
                            setVerificationStatus("pending");
                        }}
                    />
                ) : (
                    <VerifyingIdentity
                        onSuccess={() => {
                            setVerificationStatus("success");
                            setStep(3);
                        }}
                        onFailure={() => {
                            setVerificationStatus("failed");
                        }}
                    />
                )
            )}

            {step === 3 && (
                <IdentityVerified />
            )}
            <div className="!text-center h-8 flex items-center !mx-auto mt-4 shadow-xl w-fit bg-white rounded-xl">
                <span className="mx-4 text-sm"><SafetyCertificateOutlined /> Your biometric data is encrypted and secure</span> </div>
        </DashboardLayout>
    )
}