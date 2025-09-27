"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { billPaymentSidebarConfig } from "@/config/sidebarconfig";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useBillPayment } from "@/features/retailer/retailer_bbps/bbps-online/bill_avenue/data/hooks";
import { useMessage } from "@/hooks/useMessage";
import { useAddOnlineBiller } from "@/features/retailer/retailer_bbps/bbps-online/multiple_bills";
import BillDetailsHeader from "@/components/bbps/BillDetails/BillDetailsHeader";
import BillInfoGrid, { BillerResponseLite } from "@/components/bbps/BillDetails/BillInfoGrid";
import FeeBreakdown, { FeeState } from "@/components/bbps/BillDetails/FeeBreakdown";
import PayModal from "@/components/bbps/BillDetails/PayModal";
import { ApiError } from "@/lib/api/client";

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
  const searchParams = useSearchParams();
  const { error, warning, success } = useMessage();
  const [resp, setResp] = useState<any | null>(null);
  const [paymentAmountPaise, setPaymentAmountPaise] = useState(resp?.data?.billerResponse?.billAmount ?? '')

  const { billPaymentAsync, isLoading: payLoading } = useBillPayment();
  const { biller_category, service_id } = useParams() as { biller_category?: string; service_id?: string };
  const billerCategory = searchParams.get("biller_category") ?? biller_category ?? "";
  const { addOnlineBillerAsync, error: addToBillerErr, isLoading: addToBillerLoading } = useAddOnlineBiller();

  const [feeState, setFeeState] = useState<FeeState>({
    paymentAmountPaise: 0,
    flatFeePaise: 0,
    percentFee: 0,
    ccf1Paise: 0,
    gstPaise: 0,
    totalFeePaise: 0,
  });

  // load session payload
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
    } catch { /* ignore */ }
  }, []);

  // billerResponse extraction (handles adhoc by fabricating minimal)
  const bfr: BillerResponseLite | null = useMemo(() => {
    const r = resp as any;
    const nested =
      r?.billFetchResponse?.billerResponse ||
      r?.data?.billFetchResponse?.billerResponse ||
      r?.data?.billerResponse ||
      r?.billerResponse;

    if (nested) return nested;

    return r
      ? {
        customerName: r?.customerName ?? r?.customerInfo?.customerName ?? "",
      }
      : null;
  }, [resp]);

  // session fields
  const sessionCore = useMemo(() => resp ?? {}, [resp]);
  const sessionCustomerName = sessionCore?.customerName ?? bfr?.customerName ?? "";
  const sessionCustomerMobile = sessionCore?.customerMobile ?? "";
  const sessionCustomerEmail = sessionCore?.customerInfo?.customerEmail ?? "";
  const sessionBillerId = sessionCore?.billerId ?? "";
  const validationInfo: { infoName?: string; infoValue?: string } | null =
    sessionCore?.data?.additionalInfo?.info ?? null;

  // bill amount (if real bill fetched)
  const hasBillAmount = !!bfr && bfr?.billAmount != null && String(bfr.billAmount).trim() !== "";
  const billAmountPaiseStr: string | undefined = useMemo(() => {
    if (!hasBillAmount) return undefined;
    const raw: any = bfr?.billAmount ?? 0;
    return isDigits(raw) ? String(raw) : toPaise(raw);
  }, [hasBillAmount, bfr?.billAmount]);

  // optional adhoc input via query (?amount= in rupees)
  const qpAmountRupees = searchParams.get("amount");
  const qpAmountPaise = qpAmountRupees ? toPaise(qpAmountRupees) : undefined;

  // compute fees
  useEffect(() => {
    if (!resp) return;

    const candidates: Array<unknown> = [
      qpAmountPaise, // adhoc via URL
      resp?.amountInfo?.amount,
      resp?.data?.amountInfo?.amount,
      resp?.paymentAmountPaise,
      resp?.paymentAmount,
      resp?.amountPaise,
      billAmountPaiseStr, // bill-fetch
    ];

    // for (const c of candidates) {
    //   if (typeof c === "string" && /^\d+$/.test(c)) { setPaymentAmountPaise(Number(c)); break; }
    //   if (typeof c === "number" && Number.isFinite(c)) { setPaymentAmountPaise(Math.floor(c)); break; }
    // }

    const flatFeePaise = Math.floor(
      Number(
        resp?.interchangeFeeCCF1?.flatFee ??
        resp?.amountInfo?.flatFee ??
        resp?.data?.amountInfo?.flatFee ??
        0
      ) || 0
    );

    const percentFee =
      Number(
        resp?.interchangeFeeCCF1?.percentFee ??
        resp?.amountInfo?.percentFee ??
        resp?.data?.amountInfo?.percentFee ??
        0
      ) || 0;

    const ccf1Paise = Math.floor(paymentAmountPaise * (percentFee / 100) + flatFeePaise);
    const gstPaise = Math.floor((ccf1Paise * 18) / 100);
    const totalFeePaise = ccf1Paise + gstPaise;

    setFeeState({
      paymentAmountPaise,
      flatFeePaise,
      percentFee,
      ccf1Paise,
      gstPaise,
      totalFeePaise,
    });
  }, [resp, billAmountPaiseStr, qpAmountPaise]);

  const billPaise = Number(billAmountPaiseStr ?? 0);
  const ctaTotalPaise = feeState.totalFeePaise + billPaise;
  const ctaAmountText = paiseToRupees(ctaTotalPaise);
  const amountToPayLabel = billPaise > 0 ? "Amount to Pay (Bill + Fee + GST)" : "Amount to Pay (Fee + GST)";
  const displayBillAmount = billAmountPaiseStr ? paiseToRupees(billAmountPaiseStr) : undefined;

  // Only enable pay if there is some positive payable
  const canPay = (billPaise >= 0 || feeState.paymentAmountPaise > 0) && ctaTotalPaise > 0;

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

      const billerId = resp?.billerId ?? "";
      const customerMobile = resp?.customerInfo?.customerMobile ?? "";
      if (!billerId || !customerMobile) {
        error("Missing billerId or customerMobile.");
        return;
      }

      // const effectivePaise = billPaise > 0 ? billPaise : feeState.paymentAmountPaise;
      // if (effectivePaise <= 0) {
      //   warning("Please enter/select a valid amount before proceeding.");
      //   return;
      // }

      // PAN guard (fixed)
      const needsPAN = (ctaTotalPaise / 100) > 49999;
      const pan: string | undefined = resp?.customerInfo?.customerPan;
      if (needsPAN && !pan) {
        error("PAN is required for payments above ₹49,999. Please update user PAN and try again.");
        return;
      }

      const requestId = resp?.requestId ?? "";
      const mappedPaymentMode = mapPaymentMode(paymentMode);

      let inputParams = resp?.inputParams ?? {};

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

      const body = {
        requestId,
        billerId,
        customerInfo: resp?.customerInfo ?? {},
        inputParams,
        billerResponse,
        amountInfo: {
          // IMPORTANT: send the actual bill/recharge amount (paise), NOT total incl. fee
          amount: String(ctaTotalPaise),
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
      console.log({ body });

      const paymentResp = await billPaymentAsync({ service_id: svcId, body });

      const topStatus =
        paymentResp && typeof paymentResp === "object" && "status" in paymentResp
          ? Number((paymentResp as any).status)
          : "";
      const innerStatus = Number((paymentResp as any)?.paymentResp?.status);
      const responseCode =
        (paymentResp as any)?.data?.responseCode ??
        (paymentResp as any)?.paymentResp?.data?.responseCode ??
        (paymentResp as any)?.data?.ResponseCode ??
        (paymentResp as any)?.paymentResp?.data?.ResponseCode;

      const isHttpOk = topStatus === 200 || innerStatus === 200;
      const isDomainOk = String(responseCode) === "000";

      if (isHttpOk && isDomainOk) {
        try {
          const carry = {
            amountPaise: String(ctaTotalPaise),
            displayAmount: paiseToRupees(ctaTotalPaise),
            fee: {
              paymentAmountPaise: feeState.paymentAmountPaise,
              ccf1Paise: feeState.ccf1Paise,
              gstPaise: feeState.gstPaise,
              totalFeePaise: feeState.totalFeePaise,
              ctaTotalPaise, // grand total if you need it
            },
            paymentMode: mappedPaymentMode,
            billerId,
            customerMobile,
            billNumber: bfr?.billNumber ?? null,
            billDate: bfr?.billDate ?? null,
            dueDate: bfr?.dueDate ?? null,
            customerName: bfr?.customerName ?? resp?.customerName ?? "Customer",
            txnRefId:
              (paymentResp as any)?.paymentResp?.data?.txnRefId ??
              (paymentResp as any)?.data?.txnRefId ??
              null,
            approvalRefNumber:
              (paymentResp as any)?.paymentResp?.data?.approvalRefNumber ??
              (paymentResp as any)?.data?.approvalRefNumber ??
              null,
          };
          sessionStorage.setItem(PAYMENT_KEY, JSON.stringify({ resp: paymentResp, context: carry }));
        } catch { /* ignore */ }

        setIsModalOpen(false);
        router.push("/bill_payment/bbps-online/bbps-successful");
      } else {
        const errMsg =
          (paymentResp as any)?.data?.errorInfo?.error?.errorMessage ??
          (paymentResp as any)?.paymentResp?.data?.errorInfo?.error?.errorMessage ??
          (paymentResp as any)?.paymentResp?.data?.responseReason ??
          (paymentResp as any)?.data?.responseReason ??
          "Error while payment !!";
        warning(errMsg);
      }
    } catch (e: any) {
      error(e?.message || "Payment failed");
      console.error("❌ Bill Payment Error:", e);
    }
  }
  console.log({ resp });

  console.log({ bfr });

  const handleAddtoBiller = async () => {
    try {
      const res = await addOnlineBillerAsync({
        is_direct: false,
        service_id: service_id ?? "",
        input_json: {
          amountInfo: {
            amount: String(ctaTotalPaise),
            currency: "356",
            custConvFee: "0",
            amountTags: {
              amountTag: "",
              value: ""
            },
            CCF1: ""
          },
          billerId: resp?.billerId ?? "",
          billerResponse: {
            billAmount: String(bfr?.billAmount) ?? "",
            billNumber: bfr?.billNumber ?? "",
            customerName: bfr?.customerName ?? "",
            billDate: bfr?.billDate ?? "",
            billPeriod: bfr?.billPeriod ?? "",
            dueDate: bfr?.dueDate ?? "",
          },
          customerInfo: resp?.customerInfo ?? {},
          inputParams: resp?.inputParams ?? {},
          request_id: resp?.requestId ?? "",
        }
      })

      if ((res?.status ?? 404) === 200) {
        success('')
        console.log({ res });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        error(err.backendMessage ?? err.message ?? '');
      } else if (err instanceof DOMException && err.name === 'AbortError') {
        error('Request timed out');
      } else if (err instanceof Error) {
        error(err.message);
      } else {
        error('Something went wrong');
      }
    }
  }

  return (
    <DashboardLayout
      activePath="/bill_details"
      sections={billPaymentSidebarConfig}
      pageTitle="Bill Details"
    >
      <div className="min-h-screen w-full mb-3">
        <BillDetailsHeader title={billerCategory ?? ""} />

        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-full space-y-4 relative">
          {/* Header strip */}
          <div className="flex justify-between items-center">
            <Title level={5} className="!mb-0">Bill Details</Title>
            <span className="bg-[#FFECB3] text-[#D97A00] px-4 py-1 rounded-lg text-sm font-medium">
              Pending Payment
            </span>
          </div>

          {/* Info grid + fee breakdown */}
          <BillInfoGrid
            customerName={sessionCustomerName}
            customerMobile={sessionCustomerMobile}
            customerEmail={sessionCustomerEmail}
            billerId={sessionBillerId}
            bfr={bfr}
            validationInfo={validationInfo}
            extra={
              <FeeBreakdown
                billerAdhoc={resp?.billerAdhoc ?? false}
                feeState={feeState}
                billPaise={billPaise}
                amountToPayLabel={amountToPayLabel}
                displayBillAmount={displayBillAmount}
                paiseToRupees={paiseToRupees}
              />
            }
          />

          {/* Warning */}
          <div className="bg-[#FEEFC3] text-[#D97A00] p-3 rounded-md text-sm flex items-center gap-2 mt-6">
            <ExclamationCircleOutlined />
            Please verify all details before making the payment. This transaction cannot be reversed.
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <Button
              block
              className="!h-[42px] !rounded-xl !shadow-md"
              disabled={payLoading || addToBillerLoading}
              onClick={() => history.back()}
            >
              Back to Edit
            </Button>

            {canPay && (
              <Button
                block
                className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !shadow-md"
                onClick={() => setIsModalOpen(true)}
                disabled={payLoading || addToBillerLoading}
              >{
                  resp?.billerAdhoc ?
                    payLoading ? "Processing..." : `Pay`
                    :
                    payLoading ? "Processing..." : `Pay ₹${ctaAmountText}`
                }
              </Button>
            )}
          </div>
          <div className="flex justify-center">
            <Button
              block
              className="!h-[42px] !bg-[#3386FF] !text-white !rounded-xl !w-1/2 !mx-auto !shadow-md"
              onClick={handleAddtoBiller}
              disabled={payLoading || addToBillerLoading}
              loading={addToBillerLoading}
            >
              {payLoading ? "Adding..." : `Add to Biller`}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {canPay && (
        <PayModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payLoading={payLoading}
          ctaAmountText={ctaAmountText}
          paymentMode={paymentMode}
          setPaymentMode={(m) => setPaymentMode(m)}
          onProceed={handleProceedToPay}
          billerAdhoc={resp?.billerAdhoc ?? false} paymentAmount={paymentAmountPaise} setPaymentAmount={setPaymentAmountPaise} />
      )}
    </DashboardLayout>
  );
}
