// src/features/auth/data/endpoints.ts
// client-side calls to Next API (/api/v1/auth/*) via the universal client

import { postJSON } from '@/lib/api/client';
import {
  LoginRequest, LoginRequestSchema, LoginResponse, LoginResponseSchema,
  ChangePasswordRequest, ChangePasswordRequestSchema,
  ResetPasswordRequest, ResetPasswordRequestSchema, ResetPasswordResponse, ResetPasswordResponseSchema,
  VerifyOtpPasswordRequest, VerifyOtpPasswordRequestSchema, VerifyOtpPasswordResponse, VerifyOtpPasswordResponseSchema,
  VerifyOtpUsernameRequest, VerifyOtpUsernameRequestSchema, VerifyOtpUsernameResponse, VerifyOtpUsernameResponseSchema,
  ForgotUsernameInitiateRequest, ForgotUsernameInitiateRequestSchema, ForgotUsernameInitiateResponse, ForgotUsernameInitiateResponseSchema,
  VerifyEmailOtpRequest, VerifyEmailOtpRequestSchema, VerifyEmailOtpResponse, VerifyEmailOtpResponseSchema,
  GenerateEmailOtpRequest, GenerateEmailOtpRequestSchema, GenerateEmailOtpResponse, GenerateEmailOtpResponseSchema,
  SendOtpRequest, SendOtpRequestSchema, SendOtpResponse, SendOtpResponseSchema,
  AadhaarOtpGenerateRequest, AadhaarOtpGenerateRequestSchema, AadhaarOtpGenerateResponse, AadhaarOtpGenerateResponseSchema,
  AadhaarOtpVerifyRequest, AadhaarOtpVerifyRequestSchema, AadhaarOtpVerifyResponse, AadhaarOtpVerifyResponseSchema,
  PanVerifyRequest, PanVerifyRequestSchema, PanVerifyResponse, PanVerifyResponseSchema,
  RegisterRequest, RegisterRequestSchema, RegisterResponse, RegisterResponseSchema,
  SendDeviceOtpRequest, SendDeviceOtpRequestSchema, SendDeviceOtpResponse, SendDeviceOtpResponseSchema,
  VerifyAccountOtpRequest, VerifyAccountOtpRequestSchema, VerifyAccountOtpResponse, VerifyAccountOtpResponseSchema,
  ForgotPasswordInitiateRequest, ForgotPasswordInitiateRequestSchema, ForgotPasswordInitiateResponse,
} from '../domain/types';

const p = {
  login: 'auth/login/signin',
  logout: 'auth/login/signout',
  changePassword: 'auth/change-password',
  resetPasswordInit: 'auth/reset-password/initiate',
  resetPasswordVerify: 'auth/reset-password/verify',
  forgotUsernameInit: 'auth/forgot-username/initiate',
  forgotUsernameVerify: 'auth/forgot-username/verify',
  forgotPasswordInit: 'auth/forgot-password/initiate',
  sendOtp: 'auth/send-otp',
  emailOtpGenerate: 'auth/email-otp/generate',
  emailOtpVerify: 'auth/email-otp/verify',
  aadhaarOtpGenerate: 'auth/aadhaar/otp-generate',
  aadhaarOtpVerify: 'auth/aadhaar/otp-verify',
  panVerify: 'auth/pan/verify',
  register: 'auth/register',
  deviceSendOtp: 'auth/device/send-otp',
  accountVerifyOtp: 'auth/account/verify-otp',
} as const;

/** ---------- Login ---------- */
export async function apiLogin(payload: LoginRequest): Promise<LoginResponse> {
  const body = LoginRequestSchema.parse(payload);
  const data = await postJSON<LoginResponse>(p.login, body);
  return LoginResponseSchema.parse(data);
}

/** ---------- Logout ---------- */
export async function apiLogout(): Promise<{ success: true }> {
  return postJSON<{ success: true }>(p.logout);
}

/** ---------- Change Password ---------- */
export async function apiChangePassword(payload: ChangePasswordRequest): Promise<{ success: true }> {
  const body = ChangePasswordRequestSchema.parse(payload);
  await postJSON(p.changePassword, body);
  return { success: true };
}

/** ---------- Reset Password: initiate ---------- */
export async function apiResetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const body = ResetPasswordRequestSchema.parse(payload);
  const data = await postJSON<ResetPasswordResponse>(p.resetPasswordInit, body);
  return ResetPasswordResponseSchema.parse(data);
}

/** ---------- Verify OTP & set new password ---------- */
export async function apiVerifyOtpPassword(payload: VerifyOtpPasswordRequest): Promise<VerifyOtpPasswordResponse> {
  const body = VerifyOtpPasswordRequestSchema.parse(payload);
  const data = await postJSON<VerifyOtpPasswordResponse>(p.resetPasswordVerify, body);
  return VerifyOtpPasswordResponseSchema.parse(data);
}

/** ---------- Forgot Username: Initiate ---------- */
export async function apiForgotUsernameInitiate(
  payload: ForgotUsernameInitiateRequest
): Promise<ForgotUsernameInitiateResponse> {
  const body = ForgotUsernameInitiateRequestSchema.parse(payload);
  const data = await postJSON<ForgotUsernameInitiateResponse>(p.forgotUsernameInit, body);
  return ForgotUsernameInitiateResponseSchema.parse(data);
}

/** ---------- Forgot Username: Verify OTP ---------- */
export async function apiVerifyOtpForgotUsername(
  payload: VerifyOtpUsernameRequest
): Promise<VerifyOtpUsernameResponse> {
  const body = VerifyOtpUsernameRequestSchema.parse(payload);
  const data = await postJSON<VerifyOtpUsernameResponse>(p.forgotUsernameVerify, body);
  return VerifyOtpUsernameResponseSchema.parse(data);
}

/** ---------- Forgot Password: Initiate ---------- */
export async function apiForgotPasswordInitiate(
  payload: ForgotPasswordInitiateRequest
): Promise<ForgotPasswordInitiateResponse> {
  const body = ForgotPasswordInitiateRequestSchema.parse(payload);
  return postJSON<ForgotPasswordInitiateResponse>(p.forgotPasswordInit, body);
}

/** ---------- Generic Mobile OTP: Send ---------- */
export async function apiSendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
  const body = SendOtpRequestSchema.parse(payload);
  const data = await postJSON<SendOtpResponse>(p.sendOtp, body);
  return SendOtpResponseSchema.parse(data);
}

/** ---------- Email OTP: Generate (Bearer) ---------- */
export async function apiGenerateEmailOtp(payload: GenerateEmailOtpRequest): Promise<GenerateEmailOtpResponse> {
  const body = GenerateEmailOtpRequestSchema.parse(payload);
  const data = await postJSON<GenerateEmailOtpResponse>(p.emailOtpGenerate, body);
  return GenerateEmailOtpResponseSchema.parse(data);
}

/** ---------- Email OTP: Verify (Bearer) ---------- */
export async function apiVerifyEmailOtp(payload: VerifyEmailOtpRequest): Promise<VerifyEmailOtpResponse> {
  const body = VerifyEmailOtpRequestSchema.parse(payload);
  const data = await postJSON<VerifyEmailOtpResponse>(p.emailOtpVerify, body);
  return VerifyEmailOtpResponseSchema.parse(data);
}

/** ---------- Aadhaar OTP: Generate ---------- */
export async function apiAadhaarOtpGenerate(
  payload: AadhaarOtpGenerateRequest
): Promise<AadhaarOtpGenerateResponse> {
  const body = AadhaarOtpGenerateRequestSchema.parse(payload);
  const data = await postJSON<unknown>(p.aadhaarOtpGenerate, body);

  const parsed = AadhaarOtpGenerateResponseSchema.safeParse(data);
  if (parsed.success) return parsed.data;

  const ref_id = readStringOrNumber(data, 'ref_id');
  if (ref_id !== undefined) {
    return {
      ref_id,
      status: readStringOrNumber(data, 'status'),
      message: readOptionalString(data, 'message'),
    };
  }
  throw new Error('Unexpected response from Aadhaar OTP Generate');
}

/** ---------- Aadhaar OTP: Verify ---------- */
export async function apiAadhaarOtpVerify(
  payload: AadhaarOtpVerifyRequest
): Promise<AadhaarOtpVerifyResponse> {
  const body = AadhaarOtpVerifyRequestSchema.parse(payload);
  const data = await postJSON<unknown>(p.aadhaarOtpVerify, body);

  const parsed = AadhaarOtpVerifyResponseSchema.safeParse(data);
  if (parsed.success) return parsed.data;

  // Fallback when upstream returns a minimal/non-standard body
  return {
    status: readStringOrNumberRequired(data, 'status'), // <-- ensure string | number
    message: readOptionalString(data, 'message') ?? '',
    urn: readOptionalString(data, 'urn'),
    purpose: readOptionalString(data, 'purpose'),
  };
}

/** ---------- PAN Verify ---------- */
export async function apiPanVerify(payload: PanVerifyRequest): Promise<PanVerifyResponse> {
  const body = PanVerifyRequestSchema.parse(payload);
  const data = await postJSON<PanVerifyResponse>(p.panVerify, body);
  return PanVerifyResponseSchema.parse(data);
}

/** ---------- Registration (Bearer) ---------- */
export async function apiRegister(payload: RegisterRequest): Promise<RegisterResponse> {
  const body = RegisterRequestSchema.parse(payload);
  const data = await postJSON<RegisterResponse>(p.register, body);
  return RegisterResponseSchema.parse(data);
}

/** ---------- Device Verification: Send OTP (Bearer) ---------- */
export async function apiSendDeviceOtp(payload: SendDeviceOtpRequest): Promise<SendDeviceOtpResponse> {
  const body = SendDeviceOtpRequestSchema.parse(payload);
  const data = await postJSON<SendDeviceOtpResponse>(p.deviceSendOtp, body);
  return SendDeviceOtpResponseSchema.parse(data);
}

/** ---------- Account OTP: Verify (proxied) ---------- */
export async function apiVerifyAccountOtp(payload: VerifyAccountOtpRequest): Promise<VerifyAccountOtpResponse> {
  const body = VerifyAccountOtpRequestSchema.parse(payload);
  const data = await postJSON<VerifyAccountOtpResponse>(p.accountVerifyOtp, body);
  return VerifyAccountOtpResponseSchema.parse(data);
}
/* ---- helpers (no `any`) ---- */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}
function readOptionalString(x: unknown, key: string): string | undefined {
  if (!isRecord(x)) return undefined;
  const v = x[key];
  return typeof v === 'string' ? v : undefined;
}
function readStringOrNumber(x: unknown, key: string): string | number | undefined {
  if (!isRecord(x)) return undefined;
  const v = x[key];
  if (typeof v === 'string' || typeof v === 'number') return v;
  return undefined;
}
// NEW: required variant to satisfy strict type of AadhaarOtpVerifyResponse.status
function readStringOrNumberRequired(x: unknown, key: string): string | number {
  const v = readStringOrNumber(x, key);
  // choose a sensible default if missing; 0 keeps the type and is easy to check in UI
  return v ?? 0;
}