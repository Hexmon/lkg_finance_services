import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  apiBillPayment,
  apiTxnStatus,
  apiComplaintRegister,
  apiComplaintTrack,
  apiBillValidation,
  apiAllPlans,
} from "./endpoints";
import {
  type BillPaymentRequest,
  type BillPaymentResponse,
  type TxnStatusRequest,
  type TxnStatusResponse,
  type ComplaintRegisterRequest,
  type ComplaintRegisterResponse,
  type ComplaintTrackRequest,
  type ComplaintTrackResponse,
  type BillValidationRequest,
  type BillValidationResponse,
  type AllPlansResponse,
} from "../domain/types";

/** -------- Bill Payment (mutation) -------- */
export function useBillPaymentMutation() {
  const qc = useQueryClient();
  return useMutation<BillPaymentResponse, unknown, BillPaymentRequest>({
    mutationKey: ["bbps", "bill-avenue", "bill-payment"],
    mutationFn: (body) => apiBillPayment(body),
    onSuccess: () => {
      // qc.invalidateQueries({ queryKey: ["bbps", "bill-avenue", "txn-status"] });
    },
  });
}

/** -------- Transaction Status (mutation) -------- */
export function useTxnStatusMutation() {
  return useMutation<TxnStatusResponse, unknown, TxnStatusRequest>({
    mutationKey: ["bbps", "bill-avenue", "txn-status"],
    mutationFn: (body) => apiTxnStatus(body),
  });
}

/** -------- Complaint Register (mutation) -------- */
export function useComplaintRegisterMutation() {
  return useMutation<ComplaintRegisterResponse, unknown, ComplaintRegisterRequest>({
    mutationKey: ["bbps", "bill-avenue", "complaint-register"],
    mutationFn: (body) => apiComplaintRegister(body),
  });
}

/** -------- Complaint Track (mutation) -------- */
export function useComplaintTrackMutation() {
  return useMutation<ComplaintTrackResponse, unknown, ComplaintTrackRequest>({
    mutationKey: ["bbps", "bill-avenue", "complaint-track"],
    mutationFn: (body) => apiComplaintTrack(body),
  });
}

/** -------- Bill Validation (mutation) -------- */
export function useBillValidationMutation() {
  return useMutation<BillValidationResponse, unknown, BillValidationRequest>({
    mutationKey: ["bbps", "bill-avenue", "bill-validation"],
    mutationFn: (body) => apiBillValidation(body),
  });
}

/** -------- All Plans (query) -------- */
export function useAllPlansQuery(
  billerId: string,
  opt?: {
    query?: Omit<
      UseQueryOptions<AllPlansResponse, unknown, AllPlansResponse, unknown[]>,
      "queryKey" | "queryFn"
    >;
  },
) {
  return useQuery({
    queryKey: ["bbps", "bill-avenue", "all-plans", billerId],
    queryFn: () => apiAllPlans(billerId),
    enabled: (opt?.query?.enabled ?? true) && billerId.length > 0,
    ...(opt?.query ?? {}),
  });
}

/** -------- Aggregator: function-call style -------- */
export function useBillAvenueApi() {
  const billPaymentMut = useBillPaymentMutation();
  const txnStatusMut = useTxnStatusMutation();
  const complaintRegMut = useComplaintRegisterMutation();
  const complaintTrackMut = useComplaintTrackMutation();
  const billValidationMut = useBillValidationMutation();

  return {
    billPayment: billPaymentMut.mutateAsync,
    txnStatus: txnStatusMut.mutateAsync,
    complaintRegister: complaintRegMut.mutateAsync,
    complaintTrack: complaintTrackMut.mutateAsync,
    billValidation: billValidationMut.mutateAsync,

    // status objects
    billPaymentStatus: billPaymentMut,
    txnStatusStatus: txnStatusMut,
    complaintRegisterStatus: complaintRegMut,
    complaintTrackStatus: complaintTrackMut,
    billValidationStatus: billValidationMut,
  };
}
