"use client";

import { Button } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";

type VerificationFailedProps = {
  userName?: string;
  onRetry?: () => void;
};

export default function VerificationFailed({
  userName = "",
  onRetry,
}: VerificationFailedProps) {
  return (
    <CardLayout
      variant="info"
      size="lg"
      width="w-full max-w-md"
      height="min-h-[380px]"
      divider
      className="mx-auto bg-white shadow-xl"
      header={
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-black">
            Verifying Identity...
          </h2>
          <span className="text-xs text-[#9A9595]">
            Please wait while we verify your biometric data
          </span>
        </div>
      }
      body={
        <div className="grid place-items-center gap-4 py-6">
          {/* Red Cross Icon */}
          <div className="h-28 w-28 rounded-full bg-[#f9f9f9] shadow-inner flex items-center justify-center">
            <Image
              src="/notverified.svg"
              alt="Not Verified"
              height={77}
              width={77}
              className="object-contain"
            />
          </div>

          {/* Failed Chip */}
          <div className="flex items-center px-4 py-1 bg-[#FFBABA] rounded-xl shadow-sm">
            <span className="text-xs text-red-600 font-medium flex items-center">
              ❌ Attempt Failed
            </span>
          </div>

          {/* Verifying User */}
          <div className="text-sm">
            Verifying: <strong>{userName}</strong>
          </div>

          {/* Retry Button */}
          <Button
            size="large"
            className="w-[75%] !bg-[#3386FF] !text-white !rounded-xl"
            onClick={onRetry}
          >
            Retry Verification
          </Button>
        </div>
      }
      footer={
        <ul className="text-center text-[#9A9595] text-[12px] font-medium space-y-1">
          <li>• Ensure your finger is clean and dry</li>
          <li>• Place finger firmly on the scanner</li>
          <li>• Hold still during scanning process</li>
        </ul>
      }
    />
  );
}
