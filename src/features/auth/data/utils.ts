import { AadhaarOtpGenerateResponse, ForgotUsernameInitiateResponse, GenerateEmailOtpResponse, PanVerifyResponse, SendDeviceOtpResponse, SendOtpResponse, VerifyAccountOtpResponse, VerifyOtpUsernameResponse } from '../domain/types';
import { ApiError } from './client';

export function extractUserIdFromApiError(err: unknown): string | null {
  if (!(err instanceof ApiError)) return null;
  const data = err.data;
  if (!data || typeof data !== 'object') return null;

  const obj = data as Record<string, unknown>;

  // common patterns: { code: 1001, user_id: '...' } or { data: { user_id: '...' } }
  const direct = obj['user_id'];
  if (typeof direct === 'string' && direct) return direct;

  const nested = obj['data'];
  if (nested && typeof nested === 'object') {
    const n = nested as Record<string, unknown>;
    if (typeof n['user_id'] === 'string' && n['user_id']) return n['user_id'] as string;
  }

  return null;
}

export function isAppErrorCode(err: unknown, code: number): boolean {
  if (!(err instanceof ApiError)) return false;
  const data = err.data;
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  const c = obj['code'];
  if (typeof c === 'number') return c === code;
  if (typeof c === 'string') return Number(c) === code;
  return false;
}

export function extractUsernamesFromVerifyResponse(
  resp: VerifyOtpUsernameResponse
): string[] {
  if (Array.isArray(resp.usernames) && resp.usernames.length) return resp.usernames;
  if (resp.data) {
    if (Array.isArray(resp.data.usernames) && resp.data.usernames.length) {
      return resp.data.usernames;
    }
    if (typeof resp.data.username === 'string' && resp.data.username.trim()) {
      return [resp.data.username.trim()];
    }
  }
  return [];
}

export function extractRefIdFromSendOtp(resp: SendOtpResponse): string {
  return String(resp.ref_id);
}

export function extractRefIdFromForgotUsernameInit(resp: ForgotUsernameInitiateResponse): string {
  return String(resp.ref_id);
}

export function extractRefIdFromEmailOtp(resp: GenerateEmailOtpResponse): string {
  return resp.ref_id;
}

export function extractRefIdFromAadhaarGenerate(resp: AadhaarOtpGenerateResponse): string {
  return String(resp.ref_id);
}

export function extractPanPreviewData(resp: PanVerifyResponse) {
  return resp.preview_data ?? null; // already typed & passthrough
}

export function extractRefIdFromDeviceOtp(resp: SendDeviceOtpResponse): string {
  return String(resp.ref_id);
}

export function isOtpThrottleMessage(resp: SendDeviceOtpResponse | VerifyAccountOtpResponse): boolean {
  return /wait\s*\d+\s*seconds/i.test(resp?.message ?? '');
}
