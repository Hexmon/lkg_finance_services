'use client';

import React, { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'At least 1 upper case letter', valid: /[A-Z]/.test(password) },
    { label: 'At least 1 special character letter', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className=" flex items-center justify-center bg-[#FFFFFF]">
      <div className="w-full max-w-xl bg-[#FFFFFF] p-6 rounded-lg">
        {/* Title */}
        <h2 className="text-center text-md font-medium text-black mb-6">
          Enter New Password To Change Your Password
        </h2>

        {/* New Password */}
        <label className="block text-sm font-medium text-black mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-400"
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>

        {/* Password Rules */}
        <ul className="mt-3 space-y-1 text-xs">
          {requirements.map((req, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-2 ${
                req.valid ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <span>✔</span>
              {req.label}
            </li>
          ))}
        </ul>

        {/* Confirm Password */}
        <label className="block text-sm font-medium text-black mt-6 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full border rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-400"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          className="mt-6 w-full bg-blue-500 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-600 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
