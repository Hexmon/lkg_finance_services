import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Progress } from "antd";
import Image from "next/image";

export default function CashWithdraw() {
    return (
        <DashboardLayout
            sections={cashWithdrawSidebarConfig}
            activePath="/cash-withdraw"
            pageTitle="Cash Withdrawal"
        >
            {/* Back + Secure Verification buttons */}
            <div className="max-w-[450px] mx-auto mb-3">
                <div className="flex justify-between">
                    <Button
                        size="middle"
                        className="!text-[10px] !border-0 !bg-white shadow-md rounded-[9px] !text-black"
                    >
                        <ArrowLeftOutlined /> Back to Service
                    </Button>
                    <Button
                        size="middle"
                        className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF]"
                    >
                        Secure Verification
                    </Button>
                </div>
            </div>

            {/* Card Layout */}
            <CardLayout
                variant="info"
                size="lg"
                width="w-full max-w-md"
                height="min-h-[380px]"
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
                    <div className="grid place-items-center gap-4 py-6">
                        {/* Fingerprint Circle Scanner */}
                        <div className="relative flex items-center justify-center">
                            <div className="h-32 w-32 rounded-full border-2 border-[#3386FF] flex items-center justify-center">
                                <Image
                                    src="/scanner.svg"
                                    alt="scanner verification"
                                    height={80}
                                    width={80}
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
                            Verifying: <strong className="text-[#232323]">Rajesh Kumar</strong>
                        </div>
                        <div >
                            <Button className="!bg-[#3386FF] !text-white !w-[355px] !h-[38px] !rounded-[12px]">Start Verification</Button>
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

            {/* Bottom note */}
            <div className="!text-center h-8 flex items-center !mx-auto mt-4 shadow-xl w-fit bg-white rounded-xl px-4">
                <SafetyCertificateOutlined className="mr-2 text-[#3386FF]" />
                <span className="text-sm">
                    Your biometric data is encrypted and secure
                </span>
            </div>
        </DashboardLayout>
    );
}
