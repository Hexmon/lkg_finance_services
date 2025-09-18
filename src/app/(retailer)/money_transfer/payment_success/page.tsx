// src/app/(retailer)/money_transfer/payment_success/page.tsx
"use client";

import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentSuccessPage() {
    const router = useRouter();

    const [senderName, setSenderName] = React.useState<string>("John Doe");
    const [amount, setAmount] = React.useState<string>("₹799");

    React.useEffect(() => {
        try {
            const raw = sessionStorage.getItem("mt:last_success");
            if (!raw) return;
            const parsed = JSON.parse(raw) as { sender_name?: string; amount?: number };
            if (parsed?.sender_name) setSenderName(parsed.sender_name);
            if (typeof parsed?.amount === "number") setAmount(`₹${parsed.amount}`);
        } catch {
            // ignore parse errors; keep defaults
        }
    }, []);

    return (
        <DashboardLayout
            activePath="/money_transfer"
            sections={billPaymentSidebarConfig}
            pageTitle="Money Transfer"
        >
            <DashboardSectionHeader
                title="Payment Successful"
                titleClassName="!font-medium text-[20px] !mt-0"
                showBack
            />

            <div className="p-6 min-h-screen">
                <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-6 w-full">

                    {/* Top-right Logo */}
                    <div className="flex justify-end mb-4">
                        <Image
                            src="/logo-as.svg"
                            alt="logo"
                            width={80}
                            height={80}
                            className="p-1"
                        />
                    </div>

                    {/* Success Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center rounded-full">
                            <Image
                                src="/verified-b.svg"
                                alt="payment success"
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-[#0BA82F] mb-2 text-center">
                        Payment Completed!
                    </h2>
                    <p className="text-[#0BA82F] mb-6 text-center text-[15px] font-medium">
                        Your transfer has been processed successfully.
                    </p>

                    {/* Transaction Details */}
                    <div className="bg-[#F1F9EF] rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm text-[#333]">

                            <div>
                                <p className="text-gray-500">Sender Name</p>
                                <p className="font-medium">{senderName}</p>
                            </div>

                            <div>
                                <p className="text-gray-500">Amount Transferred</p>
                                <p className="font-semibold">{amount}</p>
                            </div>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-center mt-8 mb-5">
                        <button
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium w-full cursor-pointer"
                            onClick={() => router.push("/bill_payment/bbps-online/bbps-mobile-receipt")}
                        >
                            Download Receipt
                        </button>
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 w-full"
                            onClick={() => router.push("/money_transfer")}
                        >
                            Make Another Transfer
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
