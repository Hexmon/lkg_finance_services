// app/(retailer)/bill_payment/receipt/page.tsx

"use client";

import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import React from "react";

export default function PaymentReceiptPage() {
    return (
        <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
            <div className="min-h-screen bg-white py-10 px-4 relative">
                {/* Logo positioned absolutely at top right */}
                <div className="absolute top-6 right-20">
                    <Image src="/logo-as.svg" alt="BBPS Logo" width={119} height={116} />
                </div>

                {/* Centered Receipt Card */}
                <div className="flex justify-center items-center mt-20">
                    <div className="w-full max-w-2xl bg-[#8C8C8C1C] rounded-xl shadow-lg px-8 pt-8 pb-6">
                        {/* Title */}
                        <h2 className="text-xl font-semibold text-center mb-6">Payment Receipt</h2>

                        {/* Contact Info & Meta */}
                        <div className="flex justify-between text-sm mb-6">
                            <div className="space-y-1 text-gray-700">
                                <p className="text-gray-500">Gurgaon, 400063</p>
                                <p>India</p>
                                <p>Phone: 1800 266 3090</p>
                                <p>Email: info@wowsolutions.in</p>
                                <p>CIN: U74999MH2009PTC196937</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p>Date: 2017-10-10</p>
                                <p>Receipt: #0114</p>
                                <p>Payment</p>
                                <p className="text-gray-500">Status</p>
                                <p className="text-green-600 font-semibold">PAID</p>
                            </div>
                        </div>

                        {/* Mode + Receiver */}
                        <div className="flex justify-between items-center text-sm font-medium mb-4">
                            <span>Payment Mode: Cash</span>
                            <span>Subscriber/received From:</span>
                        </div>

                        {/* Table */}
                        <div className="border border-gray-300 text-sm">
                            <div className="grid grid-cols-4 bg-[#EAE2D9] text-gray-700 font-medium border-b border-gray-300 p-2">
                                <span>Service</span>
                                <span>Amount (INR)</span>
                                <span>GST @18% (INR)</span>
                                <span>Total (INR)</span>
                            </div>
                            <div className="grid grid-cols-4 p-2">
                                <span>Internet / Broadband</span>
                                <span>70692</span>
                                <span>0</span>
                                <span>70692</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </DashboardLayout>
    );
}
