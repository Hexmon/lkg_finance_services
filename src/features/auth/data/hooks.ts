// src/features/auth/data/hooks.ts
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
import { clearAuth, setUserId } from '@/lib/store/slices/authSlice'; // ← removed setToken
import { clearProfile } from '@/lib/store/slices/profileSlice';

export const selectUserId = (s: RootState) => s.auth.userId;

/** ---------- Login (token is set via HTTP-only cookie by server) ---------- */
export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (payload) => apiLogin(payload),
    onSuccess: async (data) => {
      if (data.userId) dispatch(setUserId(data.userId));
      await qc.invalidateQueries({ queryKey: ['auth', 'session'] });
      await qc.invalidateQueries({ queryKey: ['retailer'] });
      await qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/** ---------- Logout (server clears cookies; we clear local state) ---------- */
export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation<{ success: true }>({
    mutationFn: apiLogout,
    onSettled: async () => {
      dispatch(clearProfile());
      dispatch(clearAuth());
      qc.clear();
      await persistor.flush();
      await persistor.purge();
    },
  });
}

/** ---------- Change Password ---------- */
export function useChangePasswordMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: true }, unknown, { oldpassword: string; password: string }>({
    mutationFn: apiChangePassword,
    onSuccess: async () => {
      await qc.invalidateQueries();
    },
  });
}

/** ---------- Reset Password: initiate ---------- */
export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, unknown, ResetPasswordRequest>({
    mutationFn: (payload) => apiResetPassword(payload),
  });
}

/** ---------- Verify OTP + set new password ---------- */
export function useVerifyOtpPasswordMutation() {
  return useMutation<VerifyOtpPasswordResponse, unknown, VerifyOtpPasswordRequest>({
    mutationFn: (payload) => apiVerifyOtpPassword(payload),
  });
}

/** ---------- Forgot Username: initiate ---------- */
export function useForgotUsernameInitiateMutation() {
  return useMutation<ForgotUsernameInitiateResponse, unknown, ForgotUsernameInitiateRequest>({
    mutationFn: (payload) => apiForgotUsernameInitiate(payload),
  });
}

/** ---------- Forgot Password: initiate ---------- */
export function useForgotPasswordInitiateMutation() {
  return useMutation<ForgotPasswordInitiateResponse, unknown, ForgotPasswordInitiateRequest>({
    mutationFn: (payload) => apiForgotPasswordInitiate(payload),
  });
}

/** ---------- Forgot Username: verify OTP ---------- */
export function useVerifyOtpForgotUsernameMutation() {
  return useMutation<VerifyOtpUsernameResponse, unknown, VerifyOtpUsernameRequest>({
    mutationFn: (payload) => apiVerifyOtpForgotUsername(payload),
  });
}

/** ---------- Generic Mobile OTP: send ---------- */
export function useSendOtpMutation() {
  return useMutation<SendOtpResponse, unknown, SendOtpRequest>({
    mutationFn: (payload) => apiSendOtp(payload),
  });
}

/** ---------- Email OTP: generate ---------- */
export function useGenerateEmailOtpMutation() {
  return useMutation<GenerateEmailOtpResponse, unknown, GenerateEmailOtpRequest>({
    mutationFn: (payload) => apiGenerateEmailOtp(payload),
  });
}

/** ---------- Email OTP: verify ---------- */
export function useVerifyEmailOtpMutation() {
  return useMutation<VerifyEmailOtpResponse, unknown, VerifyEmailOtpRequest>({
    mutationFn: (payload) => apiVerifyEmailOtp(payload),
  });
}

/** ---------- Aadhaar OTP: generate ---------- */
export function useAadhaarOtpGenerateMutation() {
  return useMutation<AadhaarOtpGenerateResponse, unknown, AadhaarOtpGenerateRequest>({
    mutationFn: (payload) => apiAadhaarOtpGenerate(payload),
  });
}

/** ---------- Aadhaar OTP: verify ---------- */
export function useAadhaarOtpVerifyMutation() {
  return useMutation<AadhaarOtpVerifyResponse, unknown, AadhaarOtpVerifyRequest>({
    mutationFn: (payload) => apiAadhaarOtpVerify(payload),
  });
}

/** ---------- PAN verify ---------- */
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
