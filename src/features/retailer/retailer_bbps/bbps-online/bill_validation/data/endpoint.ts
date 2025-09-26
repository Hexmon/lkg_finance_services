import { BillValidationRequestSchema, type BillValidationRequest } from '../domain/types';
import { postJSON } from '@/lib/api/client';

/**
 * POST (BFF) → /retailer/bbps/bbps-online/bill-validation?mode=
 * Proxies upstream: /secure/bbps/bills/bill-validation?mode=
 */
export async function apiPostBillValidation<TResp = unknown>(
  params: {
    serviceId: string;
    mode: 'ONLINE' | 'OFFLINE';
    body: BillValidationRequest;
  },
  opts?: { signal?: AbortSignal }
): Promise<TResp> {
  // validate the request
  const validated = BillValidationRequestSchema.parse(params.body);

  const qs = new URLSearchParams({ mode: params.mode, service_id: params.serviceId }).toString();
  const path = `retailer/bbps/bbps-online/bill-validation?${qs}`;

  // do NOT parse the response; return as-is
  return postJSON<TResp>(path, validated, { signal: opts?.signal });
}
