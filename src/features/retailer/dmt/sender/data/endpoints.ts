import {
    CheckSenderBodySchema,
    type CheckSenderBody,
    CheckSenderResponseSchema,
    type CheckSenderResponse,
    VerifyOtpOnboardSenderRequestSchema,
    type VerifyOtpOnboardSenderRequest,
    VerifyOtpOnboardSenderResponseSchema,
    type VerifyOtpOnboardSenderResponse,
    AddSenderRequest,
    AddSenderRequestSchema,
    AddSenderResponse,
    AddSenderResponseSchema,
} from '../domain/types';
import { postJSON } from '@/lib/api/client';

/**
 * POST /api/v1/retailer/dmt/sender/check-sender
 * BFF endpoint that proxies to upstream /secure/retailer/checksender
 */
const CHECK_SENDER_PATH = '/retailer/dmt/sender/check-sender';

export async function apiCheckSender(
    body: CheckSenderBody
): Promise<CheckSenderResponse> {
    const payload = CheckSenderBodySchema.parse(body);

    const res = await postJSON<CheckSenderResponse>(CHECK_SENDER_PATH, payload, {
        redirectOn401: true,
        redirectPath: '/signin',
    });

    return CheckSenderResponseSchema.parse(res);
}

/**
 * POST /api/v1/retailer/dmt/sender/verify-otp-onboard-sender
 * BFF endpoint that proxies to upstream /secure/retailer/verify-otp-onboard-sender
 */
const VERIFY_OTP_ONBOARD_SENDER_PATH = '/retailer/dmt/sender/verify-otp-onboard-sender';

export async function apiVerifyOtpOnboardSender(
    body: VerifyOtpOnboardSenderRequest
): Promise<VerifyOtpOnboardSenderResponse> {
    const payload = VerifyOtpOnboardSenderRequestSchema.parse(body);

    const res = await postJSON<VerifyOtpOnboardSenderResponse>(
        VERIFY_OTP_ONBOARD_SENDER_PATH,
        payload,
        {
            redirectOn401: true,
            redirectPath: '/signin',
        }
    );

    return VerifyOtpOnboardSenderResponseSchema.parse(res);
}

/**
 * POST /api/v1/retailer/dmt/sender/add-sender
 * BFF endpoint that proxies to upstream /secure/retailer/addSender
 * NOTE: Upstream response is not typed yet — we return it as-is.
 */
const ADD_SENDER_PATH = '/retailer/dmt/sender/add-sender';

export async function apiAddSender(
    // Keep flexible until the upstream response is defined
    body: AddSenderRequest
): Promise<AddSenderResponse> {
    const payload = AddSenderRequestSchema.parse(body);
    const res = await postJSON<unknown>(ADD_SENDER_PATH, payload, {
        redirectOn401: true,
        redirectPath: '/signin',
    });
    return AddSenderResponseSchema.parse(res);
}
