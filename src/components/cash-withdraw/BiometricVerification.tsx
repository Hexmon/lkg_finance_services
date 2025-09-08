"use client";

import { Button } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";

type BiometricVerificationProps = {
  onStart?: () => void;
  userName?: string;
};

export default function BiometricVerification({
  onStart,
  userName = "Rajesh Kumar",
}: BiometricVerificationProps) {
  return (
    <CardLayout
      variant="info"
      size="lg"
      width="w-full max-w-md"
      height="min-h-[340px]"
      divider
      className="mx-auto bg-white shadow-xl"
      header={
        <div className="text-center">
          <h2 className="text-xl text-black font-medium">Agent Biometric Verification Required</h2>
          <span className="text-xs text-[#9A9595]">
            Verification session timed out. Please start again.
          </span>
          <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
            <Image
              src="/remaining.svg"
              alt="time remaining"
              width={122}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
      }
      body={
        <div className="grid place-items-center gap-3 py-6 !mb-0">
          <div className="h-24 w-24 rounded-full bg-white shadow-inner grid place-items-center">
            <Image
              src="/biometric.svg"
              alt="Biometric Verification"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#E6F0FF] text-[#3386FF] font-medium text-sm rounded-full px-4 py-2 w-[164px] h-[24px]">
            <Image src="/person.svg" alt="person logo" height={16} width={16} />
            <span className="text-[10px]">Ready for Verification</span>
          </div>

          <div className="text-[12px] text-[#9A9595]">
            Verifying: <strong className="text-[#232323]">{userName}</strong>
          </div>

          <Button
            className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]"
            onClick={onStart}
          >
            Start Verification
          </Button>
        </div>
      }
      footer={
        <ul className="text-center text-[#9A9595] text-[12px] font-medium">
          <li>• Ensure your finger is clean and dry</li>
          <li>• Place finger firmly on the scanner</li>
          <li>• Hold still during scanning process</li>
        </ul>
      }
    />
  );
}
