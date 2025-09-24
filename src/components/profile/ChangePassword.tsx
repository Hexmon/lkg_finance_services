// src/app/(whatever)/PasswordReset.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '@/features/auth/data/hooks';

const PasswordReset: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const [shake, setShake] = useState(false);

  const { mutate, isPending, data, error } = useChangePasswordMutation();

  // rules based on your spec
  const rules = useMemo(() => ({
    len8: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const allValid = rules.len8 && rules.upper && rules.special;
  const match = password.length > 0 && password === confirm;
  const canSubmit = current.length > 0 && allValid && match && !isPending;

  const passedCount = (rules.len8 ? 1 : 0) + (rules.upper ? 1 : 0) + (rules.special ? 1 : 0);
  const strengthPct = (passedCount / 3) * 100;

  const errMsg =
    (error as any)?.error?.message ||
    (error as any)?.message ||
    undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      if (!match) {
        setShake(true);
        setTimeout(() => setShake(false), 350);
      }
      return;
    }
    mutate(
      { oldpassword: current, password },
      {
        onSuccess: () => {
          // optionally show toast; for now, clear and rely on banner
          setCurrent('');
          setPassword('');
          setConfirm('');
        },
      }
    );
  }

  return (
    <div className="flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg"
        noValidate
      >
        <h2 className="text-center text-md font-medium text-black mb-6">
          Enter New Password To Change Your Password
        </h2>

        {/* Success / Error banners */}
        {data?.message && (
          <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-green-700 text-sm border border-green-200">
            {data.message}
          </div>
        )}
        {errMsg && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-red-700 text-sm border border-red-200">
            {errMsg}
          </div>
        )}

        {/* Current Password */}
        <label className="block text-sm font-medium text-black mb-2">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Enter current password"
            className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
            autoComplete="current-password"
            aria-label="Current password"
          />
          <span
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
          >
            {showCurrent ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>

        {/* New Password */}
        <label className="block text-sm font-medium text-black mt-5 mb-2">New Password</label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 outline-none transition
              ${password.length === 0 ? 'focus:ring-blue-400' : allValid ? 'border-green-400 focus:ring-green-300' : 'border-red-300 focus:ring-red-300'}
            `}
            autoComplete="new-password"
            aria-label="New password"
            aria-invalid={!allValid && password.length > 0}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            aria-label={showPass ? 'Hide new password' : 'Show new password'}
          >
            {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>

        {/* Strength bar */}
        <div className="mt-2 h-1.5 w-full bg-gray-200 rounded">
          <div
            className="h-1.5 rounded transition-all duration-300"
            style={{
              width: `${strengthPct}%`,
              background:
                strengthPct < 34 ? '#ef4444' : strengthPct < 67 ? '#f59e0b' : '#10b981',
            }}
          />
        </div>

        {/* Password Rules */}
        <ul className="mt-3 space-y-1 text-xs">
          {[
            { label: 'At least 8 characters', valid: rules.len8 },
            { label: 'At least 1 upper case letter', valid: rules.upper },
            { label: 'At least 1 special character letter', valid: rules.special },
          ].map((req, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-2 transition-colors ${req.valid ? 'text-green-600' : 'text-gray-500'
                }`}
            >
              <span
                className={`inline-block w-4 text-center transform transition-all duration-200 ${req.valid ? 'scale-110 opacity-100' : 'scale-75 opacity-50'
                  }`}
                aria-hidden
              >
                {req.valid ? '✔' : '•'}
              </span>
              {req.label}
            </li>
          ))}
        </ul>

        {/* Confirm Password */}
        <label className="block text-sm font-medium text-black mt-6 mb-2">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouchedConfirm(true)}
            placeholder="Confirm password"
            className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 outline-none transition
              ${confirm.length === 0
                ? 'focus:ring-blue-400'
                : match
                  ? 'border-green-400 focus:ring-green-300'
                  : 'border-red-300 focus:ring-red-300'}
              ${shake ? 'animate-[shake_0.35s_ease-in-out]' : ''}
            `}
            autoComplete="new-password"
            aria-label="Confirm new password"
            aria-invalid={touchedConfirm && !match}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>
        {touchedConfirm && confirm.length > 0 && !match && (
          <div className="mt-1 text-xs text-red-600">Passwords do not match.</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-6 w-full text-white py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center
            ${canSubmit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}
          `}
        >
          {isPending ? (
            <svg
              className="animate-spin h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z" />
            </svg>
          ) : null}
          Reset Password
        </button>

        {/* local styles for shake */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }
        `}</style>
      </form>
    </div>
  );
};

export default PasswordReset;
