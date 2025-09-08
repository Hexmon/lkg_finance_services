"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";

type IdentityVerifiedProps = {
  userName?: string;
};

export default function IdentityVerified({ userName = "Rajesh Kumar" }: IdentityVerifiedProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/cash_withdrawal/aeps_service");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

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
              src="/verified.svg"
              alt="Verified"
              height={136}
              width={139}
              className="object-contain"
            />
          </div>

          <div className="flex items-center px-4 py-1 bg-[#E6F0FF] rounded-xl shadow-sm">
            <Image
              src="/line.svg"
              alt="line"
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
            className="w-[75%] !bg-[#3386FF] !text-white !rounded-xl"
          >
            Verified
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
