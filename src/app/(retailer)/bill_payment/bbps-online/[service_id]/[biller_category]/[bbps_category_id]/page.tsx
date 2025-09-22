"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Radio, Select, Typography, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useParams, useRouter } from "next/navigation";
import { useBillPayment } from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue/data/hooks";
import { useMessage } from "@/hooks/useMessage";

const { Title } = Typography;
const { Option } = Select;
const STORAGE_KEY = "bbps:lastBillFetch";
const PAYMENT_KEY = "bbps:lastBillPayment"; // ✅ NEW: for payment response

// ---- helpers ----
const toPaise = (r: string | number) => String(Math.round(Number(r || 0) * 100));
const isDigits = (s: unknown): s is string => typeof s === "string" && /^\d+$/.test(s);
const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

type PayModeUI = "Wallet" | "Cashfree";

/** UI -> upstream paymentMode mapping */
function mapPaymentMode(ui: PayModeUI): string {
  return ui === "Wallet" ? "Cash" : "UPI";
}

/** Format paise to INR display */
function paiseToRupees(paise?: string | number): string {
  const n = Number(paise ?? 0);
  const rupees = isFinite(n) ? n / 100 : 0;
  return rupees.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function BillDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PayModeUI>("Wallet");
  const router = useRouter();
  const { error, warning } = useMessage();
  const [resp, setResp] = useState<any | null>(null);
  console.log({ resp });

  const { billPaymentAsync, isLoading: payLoading } = useBillPayment();
  const { biller_category, service_id } = useParams() as { biller_category?: string; service_id?: string };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      console.log({ raw });
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log({ parsed });

        // ✅ unwrap if saved as { resp: { ... } }, else use as-is
        const payload = parsed?.resp ?? parsed;
        setResp(payload);

        // Avoid clearing in dev (React 18 StrictMode runs effects twice)
        if (process.env.NODE_ENV === "production") {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // ---- derived values from resp ----
  const bfr = useMemo(() => {
    const r = resp as any;
    return (
      r?.billFetchResponse?.billerResponse ||       // normalized
      r?.data?.billFetchResponse?.billerResponse || // wrapped-normalized
      r?.data?.billerResponse ||                    // pass-through like your example
      r?.billerResponse ||                          // rare direct
      null
    );
  }, [resp]);

  const amountPaise: string = useMemo(() => {
    const raw = bfr?.billAmount ?? 0;
    return isDigits(raw) ? String(raw) : toPaise(raw);
  }, [bfr?.billAmount]);

  const amountRupees = useMemo(() => Number(amountPaise) / 100, [amountPaise]);

  const needsPAN = amountRupees > 49999; // > ₹49,999 rule

  const quickPay: "Y" | "N" = useMemo(() => {
    if (!bfr) return "Y";
    return "N";
  }, [bfr]);

  const displayAmount = paiseToRupees(amountPaise);

  async function handleProceedToPay() {
    try {
      if (!resp) {
        warning("Missing bill details. Please fetch bill again.");
        return;
      }

      const svcIdCandidate = service_id || resp?.service_id;
      if (!svcIdCandidate || !isUUID(svcIdCandidate)) {
        error("Invalid or missing service_id.");
        return;
      }
      const svcId = svcIdCandidate;

      const billerId = resp?.billerId;
      const customerMobile = resp?.customerMobile;
      if (!billerId || !customerMobile) {
        error("Missing billerId or customerMobile.");
        return;
      }

      // PAN enforcement (UI-level guard; server will also enforce)
      const pan: string | undefined = resp?.customerPan;
      if (needsPAN && !pan) {
        message.error("PAN is required for payments above ₹49,999. Please update user PAN and try again.");
        return;
      }

      const requestId = resp?.requestId ?? "";
      const mappedPaymentMode = mapPaymentMode(paymentMode);

      // Build inputParams (object or array). Prefer what we stored or what upstream returned.
      let inputParams = resp?.inputParams ?? resp?.data?.inputParams;
      if (!inputParams?.input) {
        inputParams = {
          input: {
            paramName: resp?.data?.inputParams?.input?.paramName || resp?.inputParams?.input?.paramName || "CustomerId",
            paramValue:
              resp?.data?.inputParams?.input?.paramValue ||
              resp?.inputParams?.input?.paramValue ||
              resp?.customerId ||
              customerMobile,
          },
        };
      }

      const billerResponse =
        quickPay === "N" && bfr
          ? {
            billAmount: amountPaise,
            billDate: bfr.billDate || undefined,
            billNumber: bfr.billNumber || undefined,
            billPeriod: bfr.billPeriod || undefined,
            customerName: bfr.customerName || undefined,
            dueDate: bfr.dueDate || undefined,
          }
          : undefined;

      const body = {
        requestId,
        billerId,
        customerInfo: {
          customerMobile,
          customerName: bfr?.customerName || resp?.customerName || "Customer",
          customerEmail: resp?.customerInfo?.customerEmail || undefined,
          customerPan: pan,
        },
        inputParams,
        billerResponse,
        amountInfo: {
          amount: amountPaise,
          currency: "356",
          custConvFee: "0",
        },
        paymentMethod: {
          paymentMode: mappedPaymentMode,
          quickPay,
          splitPay: "N",
        },
        additionalInfo: resp?.additionalInfo ?? resp?.data?.additionalInfo,
      } as const;

      // ✅ STORE the payment response for the success page
      const paymentResp = await billPaymentAsync({ service_id: svcId, body });
      try {
        const carry = {
          amountPaise,
          displayAmount,
          paymentMode: mappedPaymentMode,
          billerId,
          customerMobile,
          billNumber: bfr?.billNumber ?? null,
          billDate: bfr?.billDate ?? null,
          dueDate: bfr?.dueDate ?? null,
          customerName: bfr?.customerName ?? resp?.customerName ?? "Customer",
        };
        sessionStorage.setItem(PAYMENT_KEY, JSON.stringify({ resp: paymentResp, context: carry }));
      } catch {
        // ignore storage errors
      }

      setIsModalOpen(false);
      router.push("/bill_payment/bbps-online/bbps-successful");
    } catch (e: any) {
      const msg = e?.message || "Payment failed";
      message.error(msg);
      console.error("❌ Bill Payment Error:", e);
    }
  }

  return (
    <DashboardLayout
      activePath="/bill_details"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Details"
    >
      <div className="min-h-screen w-full mb-3">
        <div className="flex justify-between items-center">
          <DashboardSectionHeader
            title={biller_category ?? ""}
            titleClassName="!font-medium text-[20px] !mt-0"
            subtitle="Bill Payment"
            subtitleClassName="!mb-4 !text-[14px]"
            showBack
          />
          <Image src="/logo.svg" alt="logo" width={100} height={100} className="p-1" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-full space-y-4 relative">
          {/* Header */}
          <div className="flex justify-between items-center">
            <Title level={5} className="!mb-0">
              Bill Details
            </Title>
            <span className="bg-[#FFECB3] text-[#D97A00] px-4 py-1 rounded-lg text-sm font-medium">
              Pending Payment
            </span>
          </div>

          {/* Bill Info */}
          <div className="bg-[#FFFFFF] p-6 rounded-xl shadow-md">
            <div className="!grid !grid-cols-4 md:grid-cols-3 gap-y-6 gap-x-4 text-sm font-medium text-[#333]">
              <div>
                <div className="text-gray-500">Customer Name</div>
                <div>{bfr?.customerName ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Customer Number</div>
                <div>{resp?.customerMobile ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Biller Id</div>
                <div>{resp?.billerId ?? ""}</div>
              </div>

              <div>
                <div className="text-gray-500">Bill Period</div>
                <div>{bfr?.billPeriod ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Number</div>
                <div>{bfr?.billNumber ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Due Date</div>
                <div>{bfr?.dueDate ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Date</div>
                <div>{bfr?.billDate ?? ""}</div>
              </div>
              <br />
              <div>
                <div className="text-gray-500">Customer Convenience Fees</div>
                <div>₹0</div>
              </div>

              <div>
                <div className="text-gray-500">Payment Mode</div>
                <Select
                  defaultValue="Cash"
                  className="w-full mt-1"
                  onChange={(v) => setPaymentMode(v === "Cash" ? "Wallet" : "Cashfree")}
                  options={[
                    { value: "Cash", label: "Cash (Wallet)" },
                    { value: "UPI", label: "UPI (Cashfree)" },
                  ]}
                />
              </div>

              <div>
                <div className="text-gray-500">Bill Amount</div>
                <div className="text-[#3386FF] text-base font-semibold">₹{displayAmount}</div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-[#FEEFC3] text-[#D97A00] p-3 rounded-md text-sm flex items-center gap-2 mt-6">
              <ExclamationCircleOutlined />
              Please verify all details before making the payment. This transaction cannot be reversed.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-8 mt-6">
              <Button block className="!h-[42px] !rounded-xl !shadow-md" disabled={payLoading} onClick={() => history.back()}>
                Back to Edit
              </Button>
              <Button
                block
                className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md"
                onClick={() => setIsModalOpen(true)}
                disabled={payLoading}
              >
                {payLoading ? "Processing..." : `Pay ₹${displayAmount}`}
              </Button>
            </div>

            <div className="!pt-2 !flex !items-center !justify-center">
              <Button
                block
                className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md !mt-6 !w-[445px]"
                disabled={payLoading}
              >
                Add to Biller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 Payment Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={!payLoading}
        centered
        width={340}
        className="!rounded-2xl !p-0"
      >
        <div className="text-center py-6 px-4">
          <h3 className="text-[#3386FF] text-sm font-medium mb-1">Payable Amount</h3>
          <div className="text-[#3386FF] text-2xl font-bold mb-4">₹{displayAmount}</div>

          {/* Payment Mode */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-700">
            <Radio.Group
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              disabled={payLoading}
            >
              <Radio value="Wallet">Wallet</Radio>
              <Radio value="Cashfree">
                <Image src="/cashfree.svg" alt="Cashfree" width={70} height={20} className="inline-block" />
              </Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            block
            className="!bg-[#0BA82F] !text-white !rounded-lg !h-[38px]"
            onClick={handleProceedToPay}
            loading={payLoading}
            disabled={payLoading}
          >
            {payLoading ? "Processing..." : "Proceed to Pay"}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
