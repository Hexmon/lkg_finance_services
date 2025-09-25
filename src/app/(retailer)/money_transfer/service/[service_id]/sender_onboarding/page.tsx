// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/app/money_transfer/service/[service_id]/sender_onboarding/page.tsx
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { Button, Input } from "antd";
// import Image from "next/image";
// import DashboardLayout from "@/lib/layouts/DashboardLayout";
// import { CardLayout } from "@/lib/layouts/CardLayout";
// import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
// import { useAddSender, useVerifyOtpOnboardSender } from "@/features/retailer/dmt/sender";
// import { useMessage } from "@/hooks/useMessage";
// import { useParams, useRouter } from "next/navigation";
// import { biometricString } from "@/config/app.config";
// import SmartModal from "@/components/ui/SmartModal";

// const DRAFT_KEY = (service_id: string) => `sender:onboard:draft:${service_id}`;

// export default function SenderOnboarding() {
//     const router = useRouter();
//     const { service_id } = useParams<{ service_id: string }>();
//     const { error, info, success } = useMessage();

//     // FINO flow uses addSender (unchanged)
//     const { addSenderAsync, isLoading: addLoading } = useAddSender();

//     // ARTL flow uses verify OTP here (with Aadhaar)
//     const { verifyOtpOnboardSenderAsync, isLoading: verifyLoading } = useVerifyOtpOnboardSender();

//     const [draft, setDraft] = useState<any | null>(null);

//     // Aadhaar state
//     const [aadhaar, setAadhaar] = useState("");
//     const [touched, setTouched] = useState(false);
//     const [otpModal, setOtpModal] = useState(false)

//     useEffect(() => {
//         if (typeof window !== "undefined" && service_id) {
//             const raw = sessionStorage.getItem(DRAFT_KEY(service_id));
//             if (raw) {
//                 try {
//                     setDraft(JSON.parse(raw));
//                 } catch {
//                     // ignore parse errors
//                 }
//             }
//         }
//     }, [service_id]);

//     const userName = draft?.sender_name ?? "User";
//     const isValidAadhaar = useMemo(() => /^\d{12}$/.test(aadhaar), [aadhaar]);
//     const showError = touched && !isValidAadhaar;

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
//         setAadhaar(digitsOnly);
//     };

//     const onSubmit = async () => {
//         setTouched(true);
//         if (!isValidAadhaar) return;

//         try {
//             if (!draft) {
//                 error("Missing draft data. Please restart onboarding.");
//                 return;
//             }

//             const txnType = draft?.txnType;           // carry forward
//             const bankType = draft?.bankId;           // carry forward
//             const mobile_no = draft?.mobile_no;

//             // FINO flow (unchanged except URL adds txnType & bankType)
//             if (draft.bankId === "FINO") {
//                 const res = await addSenderAsync({
//                     ...draft,
//                     aadharNumber: aadhaar,
//                     bioPid: biometricString,
//                 });
//                 success(res?.message ?? "Verification started. OTP sent if required.");
// setOtpModal(true)
//                 // const nextUrl = `/money_transfer/service/${service_id}/${mobile_no}${txnType || bankType
//                 //         ? `?${[
//                 //             txnType ? `txnType=${encodeURIComponent(txnType)}` : "",
//                 //             bankType ? `bankType=${encodeURIComponent(bankType)}` : "",
//                 //         ]
//                 //             .filter(Boolean)
//                 //             .join("&")}`
//                 //         : ""
//                 //     }`;
//                 // router.push(nextUrl);
//                 return;
//             }

//             // ARTL flow: verify OTP here with Aadhaar
//             if (draft.bankId === "ARTL") {
//                 const {
//                     ref_id,
//                     otp,
//                     sender_name,
//                     pincode,
//                     email_address,
//                 } = draft;

//                 if (!ref_id || !otp) {
//                     error("Missing OTP session. Please go back and resend OTP.");
//                     return;
//                 }

//                 await verifyOtpOnboardSenderAsync({
//                     ref_id,
//                     otp,
//                     sender_name,
//                     pincode,
//                     email_address,
//                     mobile_no,
//                     service_id,
//                     bioPid: biometricString,
//                     aadharNumber: aadhaar, // required by backend
//                 });

//                 success("Sender verification completed!");

//                 const nextUrl = `/money_transfer/service/${service_id}/${mobile_no}${txnType || bankType
//                         ? `?${[
//                             txnType ? `txnType=${encodeURIComponent(txnType)}` : "",
//                             bankType ? `bankType=${encodeURIComponent(bankType)}` : "",
//                         ]
//                             .filter(Boolean)
//                             .join("&")}`
//                         : ""
//                     }`;
//                 router.push(nextUrl);
//                 return;
//             }

//             // Unknown bank path safeguard
//             info("Unknown bank path. Please restart onboarding.");
//         } catch (e: any) {
//             error(e?.message ?? "Verification failed. Please try again.");
//         }
//     };

//     const isWorking = addLoading || verifyLoading;

//     return (
//         <DashboardLayout
//             sections={moneyTransferSidebarConfig}
//             activePath="/sender_onboarding"
//             pageTitle="Money Transfer"
//         >
//             <div className="max-w-[450px] mx-auto mb-[7px]">
//                 <div className="flex justify-between">
//                     <Button
//                         size="middle"
//                         className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF] ml-84"
//                     >
//                         Secure Verification
//                     </Button>
//                 </div>
//             </div>

//             <CardLayout
//                 variant="info"
//                 size="lg"
//                 width="w-full max-w-md"
//                 height="min-h-[440px]"
//                 divider
//                 className="mx-auto bg-white shadow-xl"
//                 header={
//                     <div className="text-center">
//                         <h2 className="text-xl text-black font-medium">Sender Onboarding</h2>
//                         <span className="text-xs text-[#9A9595]">
//                             Verification session timed out. Please start again.
//                         </span>
//                         <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
//                             <Image
//                                 src="/remaining.svg"
//                                 alt="time remaining"
//                                 width={122}
//                                 height={24}
//                                 className="object-contain"
//                             />
//                         </div>
//                     </div>
//                 }
//                 body={
//                     <div className="grid place-items-center gap-3 py-6 !mb-0">
//                         <div className="h-24 w-24 rounded-full bg-white shadow-inner grid place-items-center">
//                             <Image
//                                 src="/biometric.svg"
//                                 alt="Biometric Verification"
//                                 width={100}
//                                 height={100}
//                                 className="object-contain"
//                             />
//                         </div>

//                         <div className="flex items-center gap-2 bg-[#E6F0FF] text-[#3386FF] font-medium text-sm rounded-full px-4 py-2 w-[164px] h-[24px]">
//                             <Image src="/person.svg" alt="person logo" height={16} width={16} />
//                             <span className="text-[10px]">Ready for Verification</span>
//                         </div>

//                         <div className="text-[12px] text-[#9A9595]">
//                             Verifying: <strong className="text-[#232323]">{draft?.sender_name ?? "User"}</strong>
//                         </div>

//                         {/* Aadhaar number input */}
//                         <div className="w-full flex flex-col justify-center items-center !h-[30px]">
//                             <div className="!relative !bg-[#6E6E6E1C] !rounded-xl !px-4 !py-2 !flex !items-center !shadow-sm h-[30px] w-[286px]">
//                                 <div className="w-2/3 text-sm text-[#B6B6B6] font-medium text-center">
//                                     Aadhaar No.
//                                 </div>
//                                 <div>
//                                     <Input
//                                         id="aadhaar"
//                                         name="aadhaar"
//                                         type="tel"
//                                         placeholder=""
//                                         value={aadhaar}
//                                         onChange={handleChange}
//                                         onBlur={() => setTouched(true)}
//                                         maxLength={12}
//                                         inputMode="numeric"
//                                         pattern="[0-9]*"
//                                         aria-invalid={showError}
//                                         aria-describedby="aadhaar-help"
//                                         status={showError ? "error" : undefined}
//                                         autoComplete="off"
//                                         allowClear
//                                         className="!h-[30px] !bg-transparent !border-none !shadow-none !text-base !font-medium !tracking-wider"
//                                     />
//                                 </div>
//                             </div>

//                             <div
//                                 id="aadhaar-help"
//                                 className={`mt-1 text-[11px] ${showError ? "text-red-500" : "text-[#9A9595]"}`}
//                             >
//                                 {showError
//                                     ? "Please enter a valid 12-digit Aadhaar number."
//                                     : "Enter digits only."}
//                             </div>
//                         </div>

//                         <Button
//                             className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]"
//                             onClick={onSubmit}
//                             disabled={!isValidAadhaar || isWorking}
//                         >
//                             {isWorking ? "Starting…" : "Start Verification"}
//                         </Button>
//                     </div>
//                 }
//                 footer={
//                     <ul className="text-center text-[#9A9595] text-[12px] font-medium">
//                         <li>• Ensure your finger is clean and dry</li>
//                         <li>• Place finger firmly on the scanner</li>
//                         <li>• Hold still during scanning process</li>
//                     </ul>
//                 }
//             />
//             <SmartModal open={otpModal}  />
//         </DashboardLayout>
//     );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/money_transfer/service/[service_id]/sender_onboarding/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input } from "antd";
import Image from "next/image";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { CardLayout } from "@/lib/layouts/CardLayout";
import { moneyTransferSidebarConfig } from "@/config/sidebarconfig";
import { useAddSender, useVerifyOtpOnboardSender } from "@/features/retailer/dmt/sender";
import { useMessage } from "@/hooks/useMessage";
import { useParams, useRouter } from "next/navigation";
import { biometricString } from "@/config/app.config";
import SmartModal from "@/components/ui/SmartModal";

const DRAFT_KEY = (service_id: string) => `sender:onboard:draft:${service_id}`;

export default function SenderOnboarding() {
    const router = useRouter();
    const { service_id } = useParams<{ service_id: string }>();
    const { error, info, success } = useMessage();

    // FINO flow uses addSender
    const { addSenderAsync, isLoading: addLoading } = useAddSender();

    // ARTL flow & FINO OTP verification use the same verify API
    const { verifyOtpOnboardSenderAsync, isLoading: verifyLoading } = useVerifyOtpOnboardSender();

    const [draft, setDraft] = useState<any | null>(null);

    // Aadhaar state
    const [aadhaar, setAadhaar] = useState("");
    const [touched, setTouched] = useState(false);

    // OTP modal state (FINO path)
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [finoRefId, setFinoRefId] = useState<string | null>(null); // ref_id returned by FINO addSender

    useEffect(() => {
        if (typeof window !== "undefined" && service_id) {
            const raw = sessionStorage.getItem(DRAFT_KEY(service_id));
            if (raw) {
                try {
                    setDraft(JSON.parse(raw));
                } catch {
                    // ignore parse errors
                }
            }
        }
    }, [service_id]);

    const userName = draft?.sender_name ?? "User";
    const isValidAadhaar = useMemo(() => /^\d{12}$/.test(aadhaar), [aadhaar]);
    const showError = touched && !isValidAadhaar;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12);
        setAadhaar(digitsOnly);
    };

    const buildNextUrl = (mobile_no?: string, txnType?: string, bankType?: string) => {
        const base = `/money_transfer/service/${service_id}/${mobile_no}`;
        const qs = [
            txnType ? `txnType=${encodeURIComponent(txnType)}` : "",
            bankType ? `bankType=${encodeURIComponent(bankType)}` : "",
        ]
            .filter(Boolean)
            .join("&");
        return qs ? `${base}?${qs}` : base;
    };

    const onSubmit = async () => {
        setTouched(true);
        if (!isValidAadhaar) return;

        try {
            if (!draft) {
                error("Missing draft data. Please restart onboarding.");
                return;
            }

            const txnType = draft?.txnType; // carry forward
            const bankType = draft?.bankId; // carry forward
            const mobile_no = draft?.mobile_no;

            // FINO flow: trigger addSender to start OTP; then open OTP modal
            if (draft.bankId === "FINO") {
                const res = await addSenderAsync({
                    ...draft,
                    aadharNumber: aadhaar,
                    bioPid: biometricString,
                });

                success(res?.message ?? "Verification started. OTP sent to sender’s mobile.");
                // Try to capture ref_id from different common shapes
                const newRefId =
                    (res as any)?.ref_id ??
                    (res as any)?.data?.ref_id ??
                    (res as any)?.data?.refId ??
                    (res as any)?.refId ??
                    draft?.ref_id ??
                    null;

                setFinoRefId(newRefId);
                setOtp(""); // reset OTP field
                setOtpModal(true);
                return;
            }

            // ARTL flow: verify OTP here with Aadhaar (expects ref_id & otp already in draft)
            if (draft.bankId === "ARTL") {
                const { ref_id, otp, sender_name, pincode, email_address } = draft;

                if (!ref_id || !otp) {
                    error("Missing OTP session. Please go back and resend OTP.");
                    return;
                }

                await verifyOtpOnboardSenderAsync({
                    ref_id,
                    otp,
                    sender_name,
                    pincode,
                    email_address,
                    mobile_no,
                    service_id,
                    bioPid: biometricString,
                    aadharNumber: aadhaar, // required by backend
                });

                success("Sender verification completed!");
                router.push(buildNextUrl(mobile_no, txnType, bankType));
                return;
            }

            // Unknown bank path safeguard
            info("Unknown bank path. Please restart onboarding.");
        } catch (e: any) {
            error(e?.message ?? "Verification failed. Please try again.");
        }
    };

    // FINO OTP submit handler
    const onSubmitFinoOtp = async () => {
        try {
            if (!draft) {
                error("Missing draft data. Please restart onboarding.");
                return;
            }
            if (!finoRefId) {
                error("Missing OTP session (ref_id). Please resend OTP.");
                return;
            }
            if (!otp?.trim()) {
                error("Please enter the OTP.");
                return;
            }
            const txnType = draft?.txnType;
            const bankType = draft?.bankId;
            const mobile_no = draft?.mobile_no;

            const { sender_name, pincode, email_address } = draft;

            await verifyOtpOnboardSenderAsync({
                ref_id: finoRefId,
                otp: otp.trim(),
                sender_name,
                pincode,
                email_address,
                mobile_no,
                service_id,
                bioPid: biometricString,
                aadharNumber: aadhaar,
            });

            success("Sender verification completed!");
            setOtpModal(false);
            router.push(buildNextUrl(mobile_no, txnType, bankType));
        } catch (e: any) {
            error(e?.message ?? "OTP verification failed. Please try again.");
        }
    };

    const isWorking = addLoading || verifyLoading;

    return (
        <DashboardLayout
            sections={moneyTransferSidebarConfig}
            activePath="/sender_onboarding"
            pageTitle="Money Transfer"
        >
            <div className="max-w-[450px] mx-auto mb-[7px]">
                <div className="flex justify-between">
                    <Button
                        size="middle"
                        className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF] ml-84"
                    >
                        Secure Verification
                    </Button>
                </div>
            </div>

            <CardLayout
                variant="info"
                size="lg"
                width="w-full max-w-md"
                height="min-h-[440px]"
                divider
                className="mx-auto bg-white shadow-xl"
                header={
                    <div className="text-center">
                        <h2 className="text-xl text-black font-medium">Sender Onboarding</h2>
                        <span className="text-xs text-[#9A9595]">
                            Verification session timed out. Please start again.
                        </span>
                        <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
                            <Image
                                src="/remaining.svg"
                                alt="time remaining"
                                width={122}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                    </div>
                }
                body={
                    <div className="grid place-items-center gap-3 py-6 !mb-0">
                        <div className="h-24 w-24 rounded-full bg-white shadow-inner grid place-items-center">
                            <Image
                                src="/biometric.svg"
                                alt="Biometric Verification"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-[#E6F0FF] text-[#3386FF] font-medium text-sm rounded-full px-4 py-2 w-[164px] h-[24px]">
                            <Image src="/person.svg" alt="person logo" height={16} width={16} />
                            <span className="text-[10px]">Ready for Verification</span>
                        </div>

                        <div className="text-[12px] text-[#9A9595]">
                            Verifying: <strong className="text-[#232323]">{userName}</strong>
                        </div>

                        {/* Aadhaar number input */}
                        <div className="w-full flex flex-col justify-center items-center !h-[30px]">
                            <div className="!relative !bg-[#6E6E6E1C] !rounded-xl !px-4 !py-2 !flex !items-center !shadow-sm h-[30px] w-[286px]">
                                <div className="w-2/3 text-sm text-[#B6B6B6] font-medium text-center">
                                    Aadhaar No.
                                </div>
                                <div>
                                    <Input
                                        id="aadhaar"
                                        name="aadhaar"
                                        type="tel"
                                        placeholder=""
                                        value={aadhaar}
                                        onChange={handleChange}
                                        onBlur={() => setTouched(true)}
                                        maxLength={12}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        aria-invalid={showError}
                                        aria-describedby="aadhaar-help"
                                        status={showError ? "error" : undefined}
                                        autoComplete="off"
                                        allowClear
                                        className="!h-[30px] !bg-transparent !border-none !shadow-none !text-base !font-medium !tracking-wider"
                                    />
                                </div>
                            </div>

                            <div
                                id="aadhaar-help"
                                className={`mt-1 text-[11px] ${showError ? "text-red-500" : "text-[#9A9595]"}`}
                            >
                                {showError ? "Please enter a valid 12-digit Aadhaar number." : "Enter digits only."}
                            </div>
                        </div>

                        <Button
                            className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]"
                            onClick={onSubmit}
                            disabled={!isValidAadhaar || isWorking}
                        >
                            {isWorking ? "Starting…" : "Start Verification"}
                        </Button>
                    </div>
                }
                footer={
                    <ul className="text-center text-[#9A9595] text-[12px] font-medium">
                        <li>• Ensure your finger is clean and dry</li>
                        <li>• Place finger firmly on the scanner</li>
                        <li>• Hold still during scanning process</li>
                    </ul>
                }
            />

            {/* FINO OTP Modal (uses SmartModal as-is; no changes to its implementation) */}
            <SmartModal
                open={otpModal}
                onClose={() => {
                    if (!verifyLoading) setOtpModal(false);
                }}
                ariaLabel="FINO OTP Verification"
                headerClassName="!py-2"
                bodyClassName="!py-3"
                footerClassName="!py-2"
            >
                <SmartModal.Header>
                    <div className="w-full text-center font-semibold">Enter OTP</div>
                </SmartModal.Header>

                <SmartModal.Body>
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-gray-600">
                            Please enter the OTP sent to <strong>{draft?.mobile_no ?? "your mobile"}</strong>.
                        </div>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="e.g. 123456"
                            maxLength={8}
                            disabled={verifyLoading}
                        />
                    </div>
                </SmartModal.Body>

                <SmartModal.Footer>
                    <Button onClick={() => setOtpModal(false)} disabled={verifyLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={onSubmitFinoOtp}
                        loading={verifyLoading}
                        disabled={!otp?.trim()}
                    >
                        Submit
                    </Button>
                </SmartModal.Footer>
            </SmartModal>
        </DashboardLayout>
    );
}
