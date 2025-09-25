"use client";

import { useEffect } from "react";
import { Button } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";

type VerifyingIdentityProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
  userName?: string;
};

export default function VerifyingIdentity({
  userName = "",
  onSuccess,
  onFailure,
}: VerifyingIdentityProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const isSuccess = Math.random() > 0.5; // simulate result
      if (isSuccess) {
        onSuccess?.();
      } else {
        onFailure?.();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSuccess, onFailure]);

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
          <h2 className="text-lg font-semibold text-black">Verifying Identity...</h2>
          <span className="text-xs text-[#9A9595]">
            Please wait while we verify your biometric data
          </span>
        </div>
      }
      body={
        <div className="grid place-items-center gap-4 py-6">
          <div className="h-28 w-28 rounded-full bg-[#f9f9f9] shadow-inner flex items-center justify-center">
            <Image
              src="/verifying.svg"
              alt="verification icon"
              height={136}
              width={139}
              className="object-contain"
            />
          </div>
          <div className="flex items-center px-4 py-1 bg-[#E6F0FF] rounded-xl shadow-sm">
            <Image
              src="/line.svg"
              alt="line icon"
              height={22}
              width={22}
              className="object-contain mr-2"
            />
            <span className="text-xs text-[#3386FF] font-medium">Processing Data</span>
          </div>
          <div className="text-sm">
            Verifying: <strong>{userName}</strong>
          </div>
          <Button
            size="large"
            disabled
            className="w-[75%] !bg-[#C7DBF9] !text-white !rounded-xl cursor-not-allowed"
          >
            Processing
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
