"use client";

import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const PAYMENT_KEY = "bbps:lastBillPayment"; // ✅ read what we stored

function paiseToRupees(paise?: string | number): string {
  const n = Number(paise ?? 0);
  const rupees = isFinite(n) ? n / 100 : 0;
  return rupees.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [payment, setPayment] = useState<any | null>(null);
  const [ctx, setCtx] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAYMENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setPayment(parsed?.resp ?? parsed ?? null);
        setCtx(parsed?.context ?? null);

        // Optional: clear after reading in prod
        if (process.env.NODE_ENV === "production") {
          sessionStorage.removeItem(PAYMENT_KEY);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Derive display values with safe fallbacks (UI unchanged)
  const nameOfBiller =
    payment?.data?.billerResponse?.billerName ||
    payment?.billerName ||
    "Mobile Prepaid_Dummy";

  const txRef =
    payment?.data?.txRefNo ||
    payment?.data?.transactionId ||
    payment?.transactionId ||
    "CC015223BAAG000010158";

  const amountDisplay =
    ctx?.displayAmount ??
    (ctx?.amountPaise ? paiseToRupees(ctx.amountPaise) : "799");

  const mobileMasked = (() => {
    const m = ctx?.customerMobile || payment?.customerMobile || "";
    if (!m || typeof m !== "string") return "XXXXXXXXXX";
    return m.replace(/^(\d{2})\d+(\d{2})$/, (_: any, a: string, b: string) => `${a}${"X".repeat(Math.max(0, m.length - 4))}${b}`);
  })();

  const registeredMasked = mobileMasked;

  const billNumber =
    payment?.data?.billerResponse?.billNumber ||
    ctx?.billNumber ||
    "XXXXXXXXXX";

  const paymentMode =
    ctx?.paymentMode ||
    payment?.data?.paymentMethod?.paymentMode ||
    "Cash";

  const txnDateTime =
    payment?.data?.dateTime ||
    payment?.dateTime ||
    "29/06/2017 23:17:03";

  const billDate =
    payment?.data?.billerResponse?.billDate ||
    ctx?.billDate ||
    "29/06/2017";

  const dueDate =
    payment?.data?.billerResponse?.dueDate ||
    ctx?.dueDate ||
    "29/06/2017";

  const status =
    payment?.data?.status ||
    payment?.status ||
    "PAID";

  return (
    <DashboardLayout activePath="/bbps" sections={billPaymentSidebarConfig} pageTitle="Bill Payment">
      <DashboardSectionHeader
        title="Payment Successful"
        titleClassName="!font-medium text-[20px] !mt-0"
        showBack
      />
      <div className="p-6 min-h-screen">

        {/* Full-width Success Card (same bg as inside) */}
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
                alt="payment successed"
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
            Your broadband bill payment has been processed successfully.
          </p>

          {/* Details Card */}
          <div className="bg-[#F1F9EF] rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 text-sm text-[#333]">

              <div>
                <p className="text-gray-500">Name Of Biller</p>
                <p className="font-medium">{nameOfBiller}</p>
              </div>

              <div>
                <p className="text-gray-500">B-Connect TXD</p>
                <p className="font-semibold">{txRef}</p>
              </div>

              <div>
                <p className="text-gray-500">Bill Amount</p>
                <p className="font-medium">₹{amountDisplay}</p>
              </div>

              <div>
                <p className="text-gray-500">Mobile Number</p>
                <p className="font-medium">{mobileMasked}</p>
              </div>

              <div>
                <p className="text-gray-500">Registered Mobile Number</p>
                <p className="font-medium">{registeredMasked}</p>
              </div>

              <div>
                <p className="text-gray-500">Total Amount</p>
                <p className="font-medium">₹{amountDisplay}</p>
              </div>

              <div>
                <p className="text-gray-500">Bill Number</p>
                <p className="font-medium">{billNumber}</p>
              </div>

              <div>
                <p className="text-gray-500">Payment Mode</p>
                <p className="font-semibold">{paymentMode}</p>
              </div>

              <div>
                <p className="text-gray-500">Transaction Date & Time</p>
                <p className="font-medium">{txnDateTime}</p>
              </div>

              <div>
                <p className="text-gray-500">Bill Date (dd/mm/yyyy)</p>
                <p className="font-medium">{billDate}</p>
              </div>

              <div>
                <p className="text-gray-500">Customer Convenience Fee</p>
                <p className="font-medium">0.00</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold text-green-600">{status}</p>
              </div>

              <div>
                <p className="text-gray-500">Due Date (dd/mm/yyyy)</p>
                <p className="font-medium">{dueDate}</p>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-8 mb-5">
            <button
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium w-full cursor-pointer"
              onClick={() => router.push("/bill_payment/bbps-online/bbps-postpaid-receipt")}
            >
              Download Receipt
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 w-full">
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
