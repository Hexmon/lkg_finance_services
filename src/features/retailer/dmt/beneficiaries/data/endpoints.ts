// src\features\retailer\dmt\beneficiaries\data\endpoints.ts
import {
    AddBeneficiaryRequest,
    AddBeneficiaryRequestSchema,
    AddBeneficiaryResponse,
    AddBeneficiaryResponseSchema,
    VerifyIfscRequestSchema,
    VerifyIfscResponseSchema,
    type VerifyIfscRequest,
    type VerifyIfscResponse,
} from '@/features/retailer/dmt/beneficiaries/domain/types';
import { postJSON } from '@/lib/api/client';

const VERIFY_IFSC_PATH = '/retailer/dmt/beneficiary/verfy-ifsc';

export async function apiVerifyIfsc(
    body: VerifyIfscRequest
): Promise<VerifyIfscResponse> {
    const payload = VerifyIfscRequestSchema.parse(body);

    const res = await postJSON<unknown>(VERIFY_IFSC_PATH, payload, {
        redirectOn401: true,
        redirectPath: '/signin',
    });

    return VerifyIfscResponseSchema.parse(res);
}

const ADD_BENEFICIARY_PATH = '/retailer/dmt/beneficiary/add-beneficiary';

export async function apiAddBeneficiary(
  body: AddBeneficiaryRequest
): Promise<AddBeneficiaryResponse> {
  const payload = AddBeneficiaryRequestSchema.parse(body);

  const res = await postJSON<unknown>(ADD_BENEFICIARY_PATH, payload, {
    redirectOn401: true,
    redirectPath: '/signin',
  });

  return AddBeneficiaryResponseSchema.parse(res);
}