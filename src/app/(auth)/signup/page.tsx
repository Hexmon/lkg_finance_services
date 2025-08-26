"use client"
import OnboardingMain from "@/components/auth/Onboarding";
import SignupMain from "@/components/auth/Signup";
import AuthLayout from "@/lib/layouts/AuthLayout";
import { useState } from "react";

export default function Page() {
    const [step, setStep] = useState<number>(0);
    return (
        <AuthLayout>
            {
                step === 1 ? <SignupMain setStep={setStep} /> : <OnboardingMain setStep={setStep} />
            }


        </AuthLayout>
    );
}