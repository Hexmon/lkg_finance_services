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
import { useAddOnlineBiller } from "@/features/retailer/retailer_bbps/bbps-online/multiple_bills";

const { Title } = Typography;
const STORAGE_KEY = "bbps:lastBillFetch";
const PAYMENT_KEY = "bbps:lastBillPayment";

type PayModeUI = "Wallet" | "Cashfree";

const toPaise = (r: string | number) => String(Math.round(Number(r || 0) * 100));
const isDigits = (s: unknown): s is string => typeof s === "string" && /^\d+$/.test(s);
const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

function mapPaymentMode(ui: PayModeUI): string {
  return ui === "Wallet" ? "Cash" : "UPI";
}

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

  const { billPaymentAsync, isLoading: payLoading } = useBillPayment();
  const { biller_category, service_id } = useParams() as { biller_category?: string; service_id?: string };
  const { addOnlineBillerAsync } = useAddOnlineBiller();

  // fee/local state
  const [feeState, setFeeState] = useState<{
    paymentAmountPaise: number;
    flatFeePaise: number;
    percentFee: number;
    ccf1Paise: number;
    gstPaise: number;
    totalFeePaise: number;
  }>({
    paymentAmountPaise: 0,
    flatFeePaise: 0,
    percentFee: 0,
    ccf1Paise: 0,
    gstPaise: 0,
    totalFeePaise: 0,
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const payload = parsed?.resp ?? parsed;
        setResp(payload);
        if (process.env.NODE_ENV === "production") {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // ---- derived values from resp ----
  const bfr = useMemo(() => {
    const r = resp as any;
    return (
      r?.billFetchResponse?.billerResponse ||
      r?.data?.billFetchResponse?.billerResponse ||
      r?.data?.billerResponse ||
      r?.billerResponse ||
      null
    );
  }, [resp]);

  const sessionCore = useMemo(() => resp ?? {}, [resp]);
  const sessionCustomerName = sessionCore?.customerName ?? bfr?.customerName ?? "";
  const sessionCustomerMobile = sessionCore?.customerMobile ?? "";
  const sessionCustomerEmail = sessionCore?.customerInfo?.customerEmail ?? "";
  const sessionBillerId = sessionCore?.billerId ?? "";
  const sessionRequestId = sessionCore?.requestId ?? "";

  const validationInfo: { infoName?: string; infoValue?: string } | null =
    sessionCore?.data?.additionalInfo?.info ?? null;

  // bill amount from fetch (optional, in paise)
  const hasBillAmount =
    !!bfr && bfr?.billAmount != null && String(bfr.billAmount).trim() !== "";
  const billAmountPaiseStr: string | undefined = useMemo(() => {
    if (!hasBillAmount) return undefined;
    const raw = bfr?.billAmount ?? 0;
    return isDigits(raw) ? String(raw) : toPaise(raw);
  }, [hasBillAmount, bfr?.billAmount]);

  // compute fee state (base amount + CCF1 + GST)
  useEffect(() => {
    if (!resp) return;

    // 👀 gather all possible payment-amount candidates (in paise)
    const candidates: Array<unknown> = [
      resp?.amountInfo?.amount,
      resp?.data?.amountInfo?.amount,
      resp?.paymentAmountPaise,
      resp?.paymentAmount,
      resp?.amountPaise,
      billAmountPaiseStr, // fallback to bill fetch amount (already paise string)
    ];

    // 🔎 log raw inputs before we pick anything
    console.log("🔎 Fee pre-calculation inputs", {
      fromSession_amountInfo: resp?.amountInfo,
      fromSession_data_amountInfo: resp?.data?.amountInfo,
      billAmountPaiseStr,
      candidates,
    });

    // pick the first valid candidate
    let paymentAmountPaise = 0;
    let pickedFrom: string | null = null;
    for (const [idx, c] of candidates.entries()) {
      if (typeof c === "string" && /^\d+$/.test(c)) {
        paymentAmountPaise = Number(c);
        pickedFrom = `candidates[${idx}] (string)`;
        break;
      }
      if (typeof c === "number" && Number.isFinite(c)) {
        paymentAmountPaise = Math.floor(c);
        pickedFrom = `candidates[${idx}] (number)`;
        break;
      }
    }

    // fees (paise + %)
    const flatFeePaise = Math.floor(
      Number(resp?.interchangeFeeCCF1?.flatFee ?? resp?.amountInfo?.flatFee ?? resp?.data?.amountInfo?.flatFee ?? 0) || 0
    );
    const percentFee =
      Number(resp?.interchangeFeeCCF1?.percentFee  ?? resp?.amountInfo?.percentFee ?? resp?.data?.amountInfo?.percentFee ?? 0) || 0;
      
    console.log("🧮 Fee base values", {
      pickedFrom,
      paymentAmountPaise,
      flatFeePaise,
      percentFee,
    });

    // CCF1 = floor(paymentAmount * percent/100 + flatFee)
    const ccf1Raw = paymentAmountPaise * (percentFee / 100) + flatFeePaise;
    const ccf1Paise = Math.floor(ccf1Raw);

    // GST = floor(CCF1 * 18 / 100)
    const gstRaw = (ccf1Paise * 18) / 100;
    const gstPaise = Math.floor(gstRaw);

    const totalFeePaise = ccf1Paise + gstPaise;

    // 🧾 log computed values
    console.log("🧾 Fee computed", {
      ccf1Raw,
      ccf1Paise,
      gstRaw,
      gstPaise,
      totalFeePaise,
      totalFeeRupees: paiseToRupees(totalFeePaise),
    });

    setFeeState({
      paymentAmountPaise,
      flatFeePaise,
      percentFee,
      ccf1Paise,
      gstPaise,
      totalFeePaise,
    });
  }, [resp, billAmountPaiseStr]);

  // ---- CTA + UI “Amount to Pay” ----
  const billPaise = Number(billAmountPaiseStr ?? 0);

  // 👉 Total to display on CTA:
  //    - If bill fetch ran: Bill Amount + (CCF1 + GST)
  //    - Else: only (CCF1 + GST)
  const ctaTotalPaise = feeState.totalFeePaise + (billPaise > 0 ? billPaise : 0);
  const ctaAmount = paiseToRupees(ctaTotalPaise);
  console.log("💳 CTA computation", {
    billPaise,
    feeState,
    ctaTotalPaise,
    ctaAmount,
  });
  // show CTA if we have any positive total to pay
  const canPay = ctaTotalPaise >= 0;

  const amountToPayLabel =
    billPaise > 0 ? "Amount to Pay (Bill + Fee + GST)" : "Amount to Pay (Fee + GST)";

  const displayBillAmount = billAmountPaiseStr ? paiseToRupees(billAmountPaiseStr) : undefined;

  const Row: React.FC<{ label: string; value?: any }> = ({ label, value }) => {
    const v = value ?? "";
    if (String(v).trim() === "") return null;
    return (
      <div>
        <div className="text-gray-500">{label}</div>
        <div>{v}</div>
      </div>
    );
  };

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

      // Keep existing PAN guard (based on bill amount)
      const needsPAN = (billPaise / 100) > 49999;
      const pan: string | undefined = resp?.customerPan;
      if (needsPAN && !pan) {
        message.error("PAN is required for payments above ₹49,999. Please update user PAN and try again.");
        return;
      }

      const requestId = resp?.requestId ?? "";
      const mappedPaymentMode = mapPaymentMode(paymentMode);

      // Build input params (prefer what was stored/returned)
      let inputParams = resp?.inputParams ?? resp?.data?.inputParams;
      if (!inputParams?.input) {
        inputParams = {
          input: {
            paramName:
              resp?.data?.inputParams?.input?.paramName ||
              resp?.inputParams?.input?.paramName ||
              "CustomerId",
            paramValue:
              resp?.data?.inputParams?.input?.paramValue ||
              resp?.inputParams?.input?.paramValue ||
              resp?.customerId ||
              customerMobile,
          },
        };
      }

      const billerResponse =
        billPaise > 0 && bfr
          ? {
            billAmount: String(billPaise),
            billDate: bfr.billDate || undefined,
            billNumber: bfr.billNumber || undefined,
            billPeriod: bfr.billPeriod || undefined,
            customerName: bfr.customerName || undefined,
            dueDate: bfr.dueDate || undefined,
          }
          : undefined;

      // ❗ Not changing your existing payment body; still sending bill amount only.
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
          amount: String(billPaise), // unchanged
          currency: "356",
          custConvFee: "0",
        },
        paymentMethod: {
          paymentMode: mappedPaymentMode,
          quickPay: billPaise > 0 ? "N" : "Y",
          splitPay: "N",
        },
        additionalInfo: resp?.additionalInfo ?? resp?.data?.additionalInfo,
      } as const;

      const paymentResp = await billPaymentAsync({ service_id: svcId, body });
      try {
        const carry = {
          amountPaise: String(billPaise),
          displayAmount: paiseToRupees(billPaise),
          // store fee breakdown too
          fee: {
            paymentAmountPaise: feeState.paymentAmountPaise,
            ccf1Paise: feeState.ccf1Paise,
            gstPaise: feeState.gstPaise,
            totalFeePaise: feeState.totalFeePaise,
            ctaTotalPaise, // bill + fee + gst
          },
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

  const handleAddtoBiller = async () => {
    try {
      await addOnlineBillerAsync({
        service_id: resp?.service_id ?? "",
        is_direct: false,
        input_json: {
          request_id: resp?.requestId ?? "",
          customerInfo: {
            customerMobile: resp?.customerMobile ?? "",
            customerAdhaar: resp?.customerAdhaar ?? "",
            customerName: resp?.data?.billerResponse?.customerName ?? "",
            customerPan: resp?.customerPan ?? "",
          },
          billerId: resp?.billerId ?? "",
          inputParams: resp?.inputParams ?? {},
          billerResponse: {
            billAmount: resp?.data?.billerResponse?.billAmount ?? "",
            billDate: resp?.data?.billerResponse?.billDate ?? "",
            billNumber: resp?.data?.billerResponse?.billNumber ?? "",
            billPeriod: resp?.data?.billerResponse?.billPeriod ?? "",
            customerName: resp?.data?.billerResponse?.customerName ?? "",
            dueDate: resp?.data?.billerResponse?.dueDate,
          },
          amountInfo: {
            amount: "5459",
            currency: "356",
            custConvFee: "0",
            amountTags: { amountTag: "", value: "" },
            CCF1: "",
          },
        },
      });
    } catch {
      // ignore
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
              <Row label="Customer Name" value={sessionCustomerName} />
              <Row label="Customer Number" value={sessionCustomerMobile} />
              <Row label="Email" value={sessionCustomerEmail} />
              <Row label="Biller Id" value={sessionBillerId} />
              {/* <Row label="Request Id" value={sessionRequestId} /> */}

              <Row label="Bill Period" value={bfr?.billPeriod} />
              <Row label="Bill Number" value={bfr?.billNumber} />
              <Row label="Due Date" value={bfr?.dueDate} />
              <Row label="Bill Date" value={bfr?.billDate} />

              {/* Validation-only info (e.g., Meter Balance) */}
              {validationInfo?.infoName && validationInfo?.infoValue && (
                <Row label={validationInfo.infoName!} value={validationInfo.infoValue} />
              )}

              {/* --- Fee breakdown --- */}
              <Row
                label="Payment Amount (Base)"
                value={feeState.paymentAmountPaise > 0 ? `₹${paiseToRupees(feeState.paymentAmountPaise)}` : ""}
              />
              <Row
                label="Convenience Fee (CCF1)"
                value={feeState.ccf1Paise > 0 ? `₹${paiseToRupees(feeState.ccf1Paise)}` : ""}
              />
              <Row
                label="GST on CCF1 (18%)"
                value={feeState.gstPaise > 0 ? `₹${paiseToRupees(feeState.gstPaise)}` : ""}
              />
              <Row
                label={amountToPayLabel}
                value={ctaTotalPaise >= 0 ? `₹${paiseToRupees(ctaTotalPaise)}` : ""}
              />

              {/* Bill Amount (if fetched) */}
              <Row label="Bill Amount" value={displayBillAmount ? `₹${displayBillAmount}` : ""} />
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

              {canPay && (
                <Button
                  block
                  className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md"
                  onClick={() => setIsModalOpen(true)}
                  disabled={payLoading}
                >
                  {payLoading ? "Processing..." : `Pay ₹${ctaAmount}`}
                </Button>
              )}
            </div>

            <div className="!pt-2 !flex !items-center !justify-center">
              <Button
                block
                className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md !mt-6 !w-[445px]"
                disabled={payLoading}
              // onClick={handleAddtoBiller}
              >
                Add to Biller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 Payment Modal */}
      {canPay && (
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
            <div className="text-[#3386FF] text-2xl font-bold mb-4">₹{ctaAmount}</div>

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
      )}
    </DashboardLayout>
  );
}
