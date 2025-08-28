"use client"
import OnboardingMain from "@/components/auth/Onboarding";
import SignupMain from "@/components/auth/Signup";
import AuthLayout from "@/lib/layouts/AuthLayout";
import { useState } from "react";

export default function Page() {
    const [step, setStep] = useState<number>(0);
    
      const [urn, setURN] = useState<string>();
    return (
        <AuthLayout>
            {
                step === 0 ? <SignupMain setStep={setStep} urn={urn ?? ""} setURN={setURN} /> : <OnboardingMain setStep={setStep} urn={urn ?? ""} />
            }
        </AuthLayout>
    );
}