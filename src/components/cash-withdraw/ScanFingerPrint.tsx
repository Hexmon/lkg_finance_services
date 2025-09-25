"use client";

import { Button, Progress } from "antd";
import Image from "next/image";
import { CardLayout } from "@/lib/layouts/CardLayout";

type ScanFingerPrintProps = {
  onStart?: () => void;
  onSecureVerify?: () => void;
};

export default function ScanFingerPrint({
  onStart,
  onSecureVerify,
}: ScanFingerPrintProps) {
  return (
    <>
      <CardLayout
                variant="info"
                size="lg"
                width="w-full max-w-md"
                height="min-h-[340px]"
                divider
                className="mx-auto bg-white shadow-xl"
                header={
                    <div className="text-center">
                        <h2 className="text-xl text-black font-medium ">Scanning Fingerprint</h2>
                        <span className="text-xs text-[#9A9595]">
                            Please place and hold your finger on the scanner.
                        </span>
                        <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
                            <Image
                                src="/remaining.svg"
                                alt="time remaining"
                                width={122}
                                height={24}
                                className="object-contain"
                            /> </div>
                    </div>
                }
                body={
                    <div className="grid place-items-center gap-4 ">
                        {/* Fingerprint Circle Scanner */}
                        <div className="relative flex items-center justify-center">
                            <div className="h-24 w-24 rounded-full border-2 border-[#3386FF] flex items-center justify-center">
                                <Image
                                    src="/scanner.svg"
                                    alt="scanner verification"
                                    height={60}
                                    width={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="absolute bottom-[-20px] w-full">
                                <Progress
                                    percent={94}
                                    size="small"
                                    strokeColor="#3386FF"
                                    showInfo={false}
                                />
                            </div>
                        </div>

                        <div className="text-sm text-[#3386FF]">94% Completed</div>
                        <div className="flex items-center gap-2 bg-[#E6F0FF] text-[#3386FF] font-medium text-sm rounded-full px-4 py-2">
                            <Image
                                src="/person.svg"
                                alt="person logo"
                                height={16}
                                width={16}
                            />
                            <span>Ready for Verification</span>
                        </div>

                        <div className="text-[12px] text-[#9A9595]">
                            Verifying: <strong className="text-[#232323]"></strong>
                        </div>
                        <div >
                            <Button className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]"onClick={onStart}>Start Verification</Button>
                        </div>
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
    </>
  );
}
