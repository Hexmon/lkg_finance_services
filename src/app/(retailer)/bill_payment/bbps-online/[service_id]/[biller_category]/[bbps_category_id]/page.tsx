"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, Radio, Select, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import Image from "next/image";
import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useParams, useRouter } from "next/navigation";
// import { selectCustomer, useAppSelector } from "@/lib/store"; // optional if you later want PAN/email
import { useBillPayment } from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue/data/hooks";

const { Title } = Typography;
const { Option } = Select;
const STORAGE_KEY = "bbps:lastBillFetch";

// helpers for amount handling
const toPaise = (r: string | number) => String(Math.round(Number(r || 0) * 100));
const isDigits = (s: unknown): s is string => typeof s === "string" && /^\d+$/.test(s);

export default function BillDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"Wallet" | "Cashfree">("Wallet");
  const router = useRouter();
  const [resp, setResp] = useState<any | null>(null);

  const { billPaymentAsync, data: payRes, error: payErr, isLoading: payLoading } = useBillPayment();
  const { biller_category, service_id } = useParams() as { biller_category: string; service_id?: string };

  // const customer = useAppSelector(selectCustomer); // optional if you want to pass email/PAN from store

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setResp(parsed);
        sessionStorage.removeItem(STORAGE_KEY); // optional clear
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleProceedToPay = async () => {
    try {
      if (!resp) {
        console.warn("Missing bill fetch payload (resp).");
        return;
      }

      // prefer dynamic route param, fallback to payload
      const svcId = service_id || resp?.service_id;
      if (!svcId) {
        console.error("Missing service_id for bill payment.");
        return;
      }

      const billerId = resp?.billerId;
      const customerMobile = resp?.customerMobile;
      const bfr = resp?.billFetchResponse?.billerResponse;

      if (!billerId || !customerMobile) {
        console.error("Missing billerId or customerMobile.");
        return;
      }

      // requestId from unix epoch ms (string)
      const requestId = Date.now().toString();

      // amount: ensure a **paise string**
      // Your resp looks like paise already; still normalize safely.
      const rawAmount = bfr?.billAmount ?? 0;
      const amountStr = isDigits(rawAmount) ? String(rawAmount) : toPaise(rawAmount);

      // Map Wallet -> Cash for upstream paymentMode (UI stays the same)
      const paymentModeMapped = "Cash";

      // Build minimal-compliant payload for presentment flow (quickPay: "N")
      const body = {
        requestId,
        billerId,
        customerInfo: {
          customerMobile,
          REMITTER_NAME: bfr?.customerName || "Customer",
          // Optionally include if you have them:
          // customerEmail: customer?.email,
          // customerPan: customer?.pan,
        },
        inputParams: {
          // If a biller needs multiple inputs, switch to { input: [{...}, {...}] }
          input: {
            paramName: resp?.inputParams?.input?.paramName || "CustomerId",
            paramValue:
              resp?.inputParams?.input?.paramValue ||
              resp?.customerId ||
              customerMobile,
          },
        },
        billerResponse: bfr
          ? {
            billAmount: amountStr,                     // **paise string**
            billDate: bfr.billDate || undefined,
            billNumber: bfr.billNumber || undefined,
            billPeriod: bfr.billPeriod || undefined,
            customerName: bfr.customerName || undefined,
            dueDate: bfr.dueDate || undefined,
          }
          : undefined,
        amountInfo: {
          amount: amountStr,                             // **paise string**
          currency: "356",
          custConvFee: "0",
        },
        paymentMethod: {
          paymentMode: paymentModeMapped,                // "Cash"
          quickPay: "N",                                 // presentment flow
          splitPay: "N",
        },
        // Under ₹50,000: send remark; if >₹50k, you may need to switch to Payment Account Info + PAN.
        paymentInfo: {
          info: { infoName: "Remarks", infoValue: "Received" },
        },
        // Optional passthrough if previously stored
        additionalInfo: resp?.additionalInfo,
      } as const;

      const result = await billPaymentAsync({ service_id: svcId, body });
      console.log("✅ Bill Payment Success:", result);
      setIsModalOpen(false);
      router.push("/bill_payment/bbps-online/bbps-successful");
    } catch (e) {
      console.error("❌ Bill Payment Error:", e);
    }
  };

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
                <div>{resp?.billFetchResponse?.billerResponse?.customerName ?? ""}</div>
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
                <div>{resp?.billFetchResponse?.billerResponse?.billPeriod ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Number</div>
                <div>{resp?.billFetchResponse?.billerResponse?.billNumber ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Due Date</div>
                <div>{resp?.billFetchResponse?.billerResponse?.dueDate ?? ""}</div>
              </div>
              <div>
                <div className="text-gray-500">Bill Date</div>
                <div>{resp?.billFetchResponse?.billerResponse?.billDate ?? ""}</div>
              </div>
              <br />
              <div>
                <div className="text-gray-500">Customer Convenience Fees</div>
                <div>₹0</div>
              </div>
              <div>
                <div className="text-gray-500">Payment Mode</div>
                <Select defaultValue="Cash" className="w-full mt-1">
                  <Option value="Cash">Cash</Option>
                  <Option value="Online">Online</Option>
                </Select>
              </div>
              {resp?.billAmount && (
                <div>
                  <div className="text-gray-500">Bill Amount</div>
                  <div className="text-[#3386FF] text-base font-semibold">
                    ₹{resp?.billFetchResponse?.billerResponse?.billAmount ?? 0}
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-[#FEEFC3] text-[#D97A00] p-3 rounded-md text-sm flex items-center gap-2 mt-6">
              <ExclamationCircleOutlined />
              Please verify all details before making the payment. This transaction cannot be reversed.
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-8 mt-6">
              <Button block className="!h-[42px] !rounded-xl !shadow-md">
                Back to Edit
              </Button>
              <Button
                block
                className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                Pay ₹{resp?.billFetchResponse?.billerResponse?.billAmount ?? 0}
              </Button>
            </div>

            <div className="!pt-2 !flex !items-center !justify-center">
              <Button block className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md !mt-6 !w-[445px]">
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
        closable={false}
        centered
        width={340}
        className="!rounded-2xl !p-0"
      >
        <div className="text-center py-6 px-4">
          <h3 className="text-[#3386FF] text-sm font-medium mb-1">Payable Amount</h3>
          <div className="text-[#3386FF] text-2xl font-bold mb-4">
            ₹{resp?.billFetchResponse?.billerResponse?.billAmount ?? 0}
          </div>

          {/* Payment Mode */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-700">
            <Radio.Group value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
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
          >
            Proceed to Pay
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
