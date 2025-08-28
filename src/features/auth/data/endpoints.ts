/* eslint-disable @typescript-eslint/no-explicit-any */
import { authRequest } from './client';
import {
  LoginRequest, LoginRequestSchema,
  ChangePasswordRequest, ChangePasswordRequestSchema,
  ResetPasswordRequest, ResetPasswordRequestSchema, ResetPasswordResponse, ResetPasswordResponseSchema,
  VerifyOtpPasswordRequest, VerifyOtpPasswordRequestSchema, VerifyOtpPasswordResponse, VerifyOtpPasswordResponseSchema,
  VerifyOtpUsernameRequest,
  VerifyOtpUsernameRequestSchema,
  VerifyOtpUsernameResponse,
  VerifyOtpUsernameResponseSchema,
  ForgotUsernameInitiateRequest,
  ForgotUsernameInitiateRequestSchema,
  ForgotUsernameInitiateResponse,
  ForgotUsernameInitiateResponseSchema,
  VerifyEmailOtpResponseSchema,
  VerifyEmailOtpResponse,
  VerifyEmailOtpRequestSchema,
  GenerateEmailOtpRequest,
  GenerateEmailOtpRequestSchema,
  GenerateEmailOtpResponse,
  GenerateEmailOtpResponseSchema,
  VerifyEmailOtpRequest,
  SendOtpRequest,
  SendOtpRequestSchema,
  SendOtpResponse,
  SendOtpResponseSchema,
  AadhaarOtpGenerateRequest,
  AadhaarOtpGenerateRequestSchema,
  AadhaarOtpGenerateResponse,
  AadhaarOtpGenerateResponseSchema,
  AadhaarOtpVerifyRequest,
  AadhaarOtpVerifyRequestSchema,
  AadhaarOtpVerifyResponse,
  AadhaarOtpVerifyResponseSchema,
  PanVerifyRequest,
  PanVerifyRequestSchema,
  PanVerifyResponse,
  PanVerifyResponseSchema,
  LoginResponse,
  LoginResponseSchema,
  RegisterRequest,
  RegisterRequestSchema,
  RegisterResponse,
  RegisterResponseSchema,
  SendDeviceOtpRequest,
  SendDeviceOtpRequestSchema,
  SendDeviceOtpResponse,
  SendDeviceOtpResponseSchema,
  VerifyAccountOtpRequest,
  VerifyAccountOtpRequestSchema,
  VerifyAccountOtpResponse,
  VerifyAccountOtpResponseSchema,
} from '../domain/types';

const LOGIN_PATH = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || '/secure/login';
const LOGOUT_PATH = process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH || '/secure/logout';
const CHANGE_PASSWORD_PATH = process.env.NEXT_PUBLIC_AUTH_CHANGE_PASSWORD_PATH || '/secure/change-password';
const RESET_PASSWORD_PATH = process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH || '/secure/reset-password';
const VERIFY_OTP_PASSWORD_PATH = process.env.NEXT_PUBLIC_AUTH_VERIFY_OTP_PASSWORD_PATH || '/secure/verify-otp-password';
const FORGOT_USERNAME_PATH = process.env.NEXT_PUBLIC_AUTH_FORGOT_USERNAME_PATH || '/secure/username-forgot';
const VERIFY_OTP_USERNAME_PATH = process.env.NEXT_PUBLIC_AUTH_VERIFY_OTP_USERNAME_PATH || '/secure/verify-otp';
const SEND_OTP_PATH = process.env.NEXT_PUBLIC_AUTH_SEND_OTP_PATH || '/secure/create';
const GENERATE_EMAIL_OTP_PATH = process.env.NEXT_PUBLIC_AUTH_GENERATE_EMAIL_OTP_PATH || '/secure/generate-email-otp';
const VERIFY_EMAIL_OTP_PATH = process.env.NEXT_PUBLIC_AUTH_VERIFY_EMAIL_OTP_PATH || '/secure/verify-otp';
const AADHAAR_OTP_GENERATE_PATH = process.env.NEXT_PUBLIC_AUTH_AADHAAR_OTP_GENERATE_PATH || '/secure/aadhar-otp-generate';
const AADHAAR_OTP_VERIFY_PATH = process.env.NEXT_PUBLIC_AUTH_AADHAAR_OTP_VERIFY_PATH || '/secure/otp-verify';
const PAN_VERIFY_PATH = process.env.NEXT_PUBLIC_AUTH_PAN_VERIFY_PATH || '/secure/pan-verify';
const REGISTER_PATH = process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH || '/secure/register';
const SEND_DEVICE_OTP_PATH = process.env.NEXT_PUBLIC_AUTH_SEND_DEVICE_OTP_PATH || '/secure/send-otp';
const VERIFY_ACCOUNT_OTP_PATH = process.env.NEXT_PUBLIC_AUTH_VERIFY_ACCOUNT_OTP_PATH || '/secure/verify-otp';


/** ---------- Login ---------- */
export async function apiLogin(payload: LoginRequest): Promise<LoginResponse> {
  const body = LoginRequestSchema.parse(payload);
  const data = await authRequest<LoginResponse>(LOGIN_PATH, 'POST', body, undefined, {
    includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
    includeAuth: false,
  });
  return LoginResponseSchema.parse(data);
}

/** ---------- Logout (Bearer) ---------- */
export async function apiLogout(): Promise<{ success: true }> {
  await authRequest(LOGOUT_PATH, 'POST', undefined, undefined, {
    includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
    includeAuth: true,
  });
  return { success: true };
}

/** ---------- Change Password (requires Bearer) ---------- */
export async function apiChangePassword(payload: ChangePasswordRequest): Promise<{ success: true }> {
  const body = ChangePasswordRequestSchema.parse(payload);
  await authRequest(CHANGE_PASSWORD_PATH, 'POST', body, undefined, {
    includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
    includeAuth: true,
  });
  return { success: true };
}

/** ---------- Reset Password (initiate) ---------- */
/** Uses API Key; no bearer required (per doc). */
export async function apiResetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const body = ResetPasswordRequestSchema.parse(payload);
  const data = await authRequest<ResetPasswordResponse>(RESET_PASSWORD_PATH, 'POST', body, undefined, {
    includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
    includeAuth: false,
  });
  return ResetPasswordResponseSchema.parse(data);
}

/** ---------- Verify OTP & set new password ---------- */
/** Uses API Key; no bearer required (per doc). */
export async function apiVerifyOtpPassword(payload: VerifyOtpPasswordRequest): Promise<VerifyOtpPasswordResponse> {
  const body = VerifyOtpPasswordRequestSchema.parse(payload);
  const data = await authRequest<VerifyOtpPasswordResponse>(VERIFY_OTP_PASSWORD_PATH, 'POST', body, undefined, {
    includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
    includeAuth: false,
  });
  return VerifyOtpPasswordResponseSchema.parse(data);
}

export async function apiVerifyOtpForgotUsername(
  payload: VerifyOtpUsernameRequest
): Promise<VerifyOtpUsernameResponse> {
  const body = VerifyOtpUsernameRequestSchema.parse(payload);
  const data = await authRequest<VerifyOtpUsernameResponse>(
    VERIFY_OTP_USERNAME_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: false }
  );
  return VerifyOtpUsernameResponseSchema.parse(data);
}

/** ---------- Forgot Username: Initiate (API Key only) ---------- */
export async function apiForgotUsernameInitiate(
  payload: ForgotUsernameInitiateRequest
): Promise<ForgotUsernameInitiateResponse> {
  const body = ForgotUsernameInitiateRequestSchema.parse(payload);
  const data = await authRequest<ForgotUsernameInitiateResponse>(
    FORGOT_USERNAME_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: false }
  );
  return ForgotUsernameInitiateResponseSchema.parse(data);
}

/** ---------- Email OTP: Generate (Bearer; API Key optional) ---------- */
export async function apiGenerateEmailOtp(
  payload: GenerateEmailOtpRequest
): Promise<GenerateEmailOtpResponse> {
  const body = GenerateEmailOtpRequestSchema.parse(payload);
  const data = await authRequest<GenerateEmailOtpResponse>(
    GENERATE_EMAIL_OTP_PATH,
    'POST',
    body,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true, // per spec/sample this is a secure, logged-in action
    }
  );
  return GenerateEmailOtpResponseSchema.parse(data);
}

/** ---------- Email OTP: Verify (Bearer; API Key optional) ---------- */
export async function apiVerifyEmailOtp(
  payload: VerifyEmailOtpRequest
): Promise<VerifyEmailOtpResponse> {
  const body = VerifyEmailOtpRequestSchema.parse(payload);
  const data = await authRequest<VerifyEmailOtpResponse>(
    VERIFY_EMAIL_OTP_PATH,
    'POST',
    body,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true, // spec indicates Bearer token
    }
  );
  return VerifyEmailOtpResponseSchema.parse(data);
}

/** ---------- Generic OTP: Send (API Key only) ---------- */
export async function apiSendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
  const body = SendOtpRequestSchema.parse(payload);
  const data = await authRequest<SendOtpResponse>(
    SEND_OTP_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: false }
  );
  return SendOtpResponseSchema.parse(data);
}

/** ---------- Aadhaar OTP: Generate (API Key only) ---------- */
export async function apiAadhaarOtpGenerate(
  payload: AadhaarOtpGenerateRequest
): Promise<AadhaarOtpGenerateResponse> {
  const body = AadhaarOtpGenerateRequestSchema.parse(payload);

  const data = await authRequest<unknown>(
    AADHAAR_OTP_GENERATE_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: true, includeAuth: false } // this endpoint is API-key only
  );

  const parsed = AadhaarOtpGenerateResponseSchema.safeParse(data);
  if (parsed.success) return parsed.data;

  // Fallback for bare { ref_id, status } shapes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref_id = (data as any)?.ref_id;
  if (ref_id !== undefined) {
    return {
      ref_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (data as any)?.status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (data as any)?.message,
    };
  }
  throw new Error('Unexpected response from Aadhaar OTP Generate');
}

/** ---------- Aadhaar OTP: Verify (API Key only) ---------- */
export async function apiAadhaarOtpVerify(
  payload: AadhaarOtpVerifyRequest
): Promise<AadhaarOtpVerifyResponse> {
  const body = AadhaarOtpVerifyRequestSchema.parse(payload);

  const data = await authRequest<unknown>(
    AADHAAR_OTP_VERIFY_PATH, // '/secure/verify-otp'
    'POST',
    body,
    undefined,
    { includeApiKey: true, includeAuth: false }
  );

  const parsed = AadhaarOtpVerifyResponseSchema.safeParse(data);
  if (parsed.success) return parsed.data;

  // Minimal fallback if server only returns {status/message}
  return {
    status: (data as any)?.status,
    message: (data as any)?.message,
    urn: (data as any)?.urn,
    purpose: (data as any)?.purpose,
  };
}

/** ---------- PAN Verify (API Key only) ---------- */
export async function apiPanVerify(
  payload: PanVerifyRequest
): Promise<PanVerifyResponse> {
  const body = PanVerifyRequestSchema.parse(payload);
  const data = await authRequest<PanVerifyResponse>(
    PAN_VERIFY_PATH,
    'POST',
    body,
    undefined,
    { includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY, includeAuth: false }
  );
  return PanVerifyResponseSchema.parse(data);
}

/** ---------- Registration (Bearer; API Key optional) ---------- */
export async function apiRegister(payload: RegisterRequest): Promise<RegisterResponse> {
  const body = RegisterRequestSchema.parse(payload);
  const data = await authRequest<RegisterResponse>(
    REGISTER_PATH,
    'POST',
    body,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true, // requires Bearer per spec
    }
  );
  return RegisterResponseSchema.parse(data);
}

/** ---------- Device Verification: Send OTP (Bearer; API Key optional) ---------- */
export async function apiSendDeviceOtp(
  payload: SendDeviceOtpRequest
): Promise<SendDeviceOtpResponse> {
  const body = SendDeviceOtpRequestSchema.parse(payload);
  const data = await authRequest<SendDeviceOtpResponse>(
    SEND_DEVICE_OTP_PATH,
    'POST',
    body,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: true, // requires Bearer per spec block
    }
  );
  return SendDeviceOtpResponseSchema.parse(data);
}

/** ---------- Account OTP: Verify (API Key; no Bearer) ---------- */
export async function apiVerifyAccountOtp(
  payload: VerifyAccountOtpRequest
): Promise<VerifyAccountOtpResponse> {
  const body = VerifyAccountOtpRequestSchema.parse(payload);
  const data = await authRequest<VerifyAccountOtpResponse>(
    VERIFY_ACCOUNT_OTP_PATH,
    'POST',
    body,
    undefined,
    {
      includeApiKey: !!process.env.NEXT_PUBLIC_AUTH_API_KEY,
      includeAuth: false, // spec shows API Key for this one
    }
  );
  return VerifyAccountOtpResponseSchema.parse(data);
}
