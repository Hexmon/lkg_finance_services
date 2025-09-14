import {
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
