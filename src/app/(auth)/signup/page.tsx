"use client"
import OnboardingMain from "@/components/auth/Onboarding";
import SignupMain from "@/components/auth/Signup";
import SignupSuccess from "@/components/auth/SignupSuccess";
import SignupUserdetails from "@/components/auth/SignupUserdetails";
import AuthLayout from "@/lib/layouts/AuthLayout";
import { useState } from "react";

export type UserdataProps = {
    address: string
    dob: string
    gender: string
    name_match_score: string | number
    name_on_aadhaar: string
    profile: string
    registered_name: string
    type: string
    urn: string
    email: string
    mobile: string
}

export default function Page() {
    const [step, setStep] = useState<number>(0);
    const [urn, setURN] = useState<string>();
    const [userData, setUserdata] = useState<UserdataProps>();
    const [userName, setUsername] = useState<string>();

    return (
        <AuthLayout>
            {step === 0 ? (
                <SignupMain setStep={setStep} urn={urn ?? ""} setURN={setURN} />
            ) : step === 1 ? (
                <OnboardingMain setStep={setStep} urn={urn ?? ""} setUserdata={setUserdata} />
            ) : step === 2 ? (
                <SignupUserdetails setStep={setStep} urn={urn ?? ""} user={userData} setUsername={setUsername} />
            ) : step === 3 ? (<SignupSuccess userName={userName ?? ""} />)
                : null}
        </AuthLayout>
    );
}