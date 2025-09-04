import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
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
                        {/* Circle with verified tick */}
                        <div className="h-28 w-28 rounded-full bg-[#f9f9f9] shadow-inner flex items-center justify-center">
                            <Image
                                src="/verified.svg"   // ✅ your new verified tick icon
                                alt="Verified"
                                height={136}
                                width={139}
                                className="object-contain"
                            />
                        </div>

                        {/* Processing Chip */}
                        <div className="flex items-center px-4 py-1 bg-[#E6F0FF] rounded-xl shadow-sm">
                            <Image
                                src="/line.svg"
                                 alt="verification line"
                                height={22}
                                width={22}
                                className="object-contain"
                            />
                            <span className="text-xs text-[#3386FF] font-medium">
                                Processing Data
                            </span>
                        </div>

                        {/* Verifying User */}
                        <div className="text-sm">
                            Verifying: <strong>Rajesh Kumar</strong>
                        </div>

                        {/* Verified Button */}
                        <Button
                            size="large"
                            className="w-[75%] !bg-[#3386FF] !text-white !rounded-xl"
                        >
                            ✅ Verified
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

            {/* Bottom secure note */}
            <div className="!text-center h-8 flex items-center !mx-auto mt-4 shadow-xl w-fit bg-white rounded-xl px-4">
                <SafetyCertificateOutlined className="mr-2 text-[#3386FF]" />
                <span className="text-sm">
                    Your biometric data is encrypted and secure
                </span>
            </div>
        </DashboardLayout>
    );
}
