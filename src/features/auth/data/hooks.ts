'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiLogin,
  apiLogout,
  apiChangePassword,
  apiResetPassword,
  apiVerifyOtpPassword,
  apiForgotUsernameInitiate,
  apiVerifyOtpForgotUsername,
  apiGenerateEmailOtp,
  apiVerifyEmailOtp,
  apiSendOtp,
  apiAadhaarOtpGenerate,
  apiAadhaarOtpVerify,
  apiPanVerify,
  apiRegister,
  apiSendDeviceOtp,
  apiVerifyAccountOtp,
  apiForgotPasswordInitiate,
} from './endpoints';

import type {
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyOtpPasswordRequest,
  VerifyOtpPasswordResponse,
  ForgotUsernameInitiateRequest,
  ForgotUsernameInitiateResponse,
  VerifyOtpUsernameRequest,
  VerifyOtpUsernameResponse,
  GenerateEmailOtpRequest,
  GenerateEmailOtpResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
  SendOtpRequest,
  SendOtpResponse,
  AadhaarOtpGenerateRequest,
  AadhaarOtpGenerateResponse,
  AadhaarOtpVerifyRequest,
  AadhaarOtpVerifyResponse,
  PanVerifyRequest,
  PanVerifyResponse,
  RegisterRequest,
  RegisterResponse,
  SendDeviceOtpRequest,
  SendDeviceOtpResponse,
  VerifyAccountOtpRequest,
  VerifyAccountOtpResponse,
  ForgotPasswordInitiateResponse,
  ForgotPasswordInitiateRequest,
} from '../domain/types';

import { persistor, RootState, useAppDispatch } from '@/lib/store';
import { setToken, clearAuth, setUserId } from '@/lib/store/slices/authSlice';

export const selectUserId = (s: RootState) => s.auth.userId;
/** ---------- Login (API Key) ---------- */
export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (payload) => apiLogin(payload),
    onSuccess: (data) => {
      dispatch(setToken(data.token));
      if (data.userId) dispatch(setUserId(data.userId));
      qc.invalidateQueries();
    },
  });
}

/** ---------- Logout (server + local clear; Bearer) ---------- */
export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation<{ success: true }>({
    mutationFn: apiLogout,
    onSettled: async () => {
      dispatch(clearAuth());
      qc.clear();

      // Optional: ensure persisted state is flushed after clearing
      await persistor.flush();
      // Or, for a total reset (rarely needed):
      // await persistor.purge();
    },
  });
}

/** ---------- Change Password (Bearer) ---------- */
export function useChangePasswordMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: true }, unknown, { oldpassword: string; password: string }>({
    mutationFn: apiChangePassword,
    onSuccess: async () => {
      await qc.invalidateQueries();
    },
  });
}

/** ---------- Reset Password: initiate (API Key) ---------- */
export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, unknown, ResetPasswordRequest>({
    mutationFn: (payload) => apiResetPassword(payload),
  });
}

/** ---------- Verify OTP + set new password (API Key) ---------- */
export function useVerifyOtpPasswordMutation() {
  return useMutation<VerifyOtpPasswordResponse, unknown, VerifyOtpPasswordRequest>({
    mutationFn: (payload) => apiVerifyOtpPassword(payload),
  });
}

/** ---------- Forgot Username: initiate (API Key) ---------- */
export function useForgotUsernameInitiateMutation() {
  return useMutation<ForgotUsernameInitiateResponse, unknown, ForgotUsernameInitiateRequest>({
    mutationFn: (payload) => apiForgotUsernameInitiate(payload),
  });
}

/** ---------- Forgot Username: initiate (API Key) ---------- */
export function useForgotPasswordInitiateMutation() {
  return useMutation<ForgotPasswordInitiateResponse, unknown, ForgotPasswordInitiateRequest>({
    mutationFn: (payload) => apiForgotPasswordInitiate(payload),
  });
}

/** ---------- Forgot Username: verify OTP (API Key) ---------- */
export function useVerifyOtpForgotUsernameMutation() {
  return useMutation<VerifyOtpUsernameResponse, unknown, VerifyOtpUsernameRequest>({
    mutationFn: (payload) => apiVerifyOtpForgotUsername(payload),
  });
}

/** ---------- Generic Mobile OTP: send (API Key) ---------- */
export function useSendOtpMutation() {
  return useMutation<SendOtpResponse, unknown, SendOtpRequest>({
    mutationFn: (payload) => apiSendOtp(payload),
  });
}

/** ---------- Email OTP: generate (Bearer) ---------- */
export function useGenerateEmailOtpMutation() {
  return useMutation<GenerateEmailOtpResponse, unknown, GenerateEmailOtpRequest>({
    mutationFn: (payload) => apiGenerateEmailOtp(payload),
  });
}

/** ---------- Email OTP: verify (Bearer) ---------- */
export function useVerifyEmailOtpMutation() {
  return useMutation<VerifyEmailOtpResponse, unknown, VerifyEmailOtpRequest>({
    mutationFn: (payload) => apiVerifyEmailOtp(payload),
  });
}

/** ---------- Aadhaar OTP: generate (API Key) ---------- */
export function useAadhaarOtpGenerateMutation() {
  return useMutation<AadhaarOtpGenerateResponse, unknown, AadhaarOtpGenerateRequest>({
    mutationFn: (payload) => apiAadhaarOtpGenerate(payload),
  });
}

/** ---------- Aadhaar OTP: verify (API Key) ---------- */
export function useAadhaarOtpVerifyMutation() {
  return useMutation<AadhaarOtpVerifyResponse, unknown, AadhaarOtpVerifyRequest>({
    mutationFn: (payload) => apiAadhaarOtpVerify(payload),
  });
}

/** ---------- PAN verify (API Key) ---------- */
export function usePanVerifyMutation() {
  return useMutation<PanVerifyResponse, unknown, PanVerifyRequest>({
    mutationFn: (payload) => apiPanVerify(payload),
  });
}

/** ---------- Registration ---------- */
export function useRegisterMutation() {
  return useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: (payload) => apiRegister(payload),
  });
}

/** ---------- Device Verification: Send OTP ---------- */
export function useSendDeviceOtpMutation() {
  return useMutation<SendDeviceOtpResponse, unknown, SendDeviceOtpRequest>({
    mutationFn: (payload) => apiSendDeviceOtp(payload),
  });
}

/** ---------- Account OTP: Verify ---------- */
export function useVerifyAccountOtpMutation() {
  return useMutation<VerifyAccountOtpResponse, unknown, VerifyAccountOtpRequest>({
    mutationFn: (payload) => apiVerifyAccountOtp(payload),
  });
}

