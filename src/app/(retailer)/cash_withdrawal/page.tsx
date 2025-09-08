import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { ArrowLeftOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";

export default function CashWithdraw() {
    return (
        <DashboardLayout sections={cashWithdrawSidebarConfig} activePath="/cash_withdrawal" pageTitle="Cash Withdrawal">
            <div className="max-w-[450px] mx-auto mb-[7px]">
                <div className="flex justify-between">
                    <Button size="middle" className="!text-[10px] !border-0 !bg-white shadow-md rounded-[9px] !text-black"><ArrowLeftOutlined /> Back to Service</Button>
                    <Button size="middle" className="!text-[10px] !border-0 !bg-[#5298FF54] rounded-[9px] !text-[#3386FF]">Secure Verification</Button>
                </div>
            </div>
            <CardLayout
                variant="info"
                size="lg"
                width="w-full max-w-md"
                height="min-h-[340px]"
                divider
                className="mx-auto bg-white shadow-xl"
                header={
                    <div className="text-center">
                        <h2 className="text-xl text-black font-medium ">Agent Biometric Verification Required</h2>
                        <span className="text-xs text-[#9A9595]">
                            Verification session timed out. Please start again.
                        </span>
                        <div className="!text-center h-6 flex items-center !mx-auto shadow mt-1 w-fit bg-white rounded-xl">
                            <span className="mx-4 !text-sm py-2"><SafetyCertificateOutlined /> 20 sec remaining</span> </div>
                    </div>
                }
                body={
                    <div className="grid place-items-center gap-3 py-6">
                        <div className="h-24 w-24 rounded-full bg-white shadow-inner grid place-items-center">
                            <Image
                            src="/biometric.svg"
                            alt="Biometric Verification"
                            width={110}   // same as h-12
                            height={110}  // same as w-12
                            className="object-contain "
                        />
                        </div>
                        <div className="text-sm text-blue-700/80">Processing Data</div>
                        <div className="text-sm">Verifying: <strong>Rajesh Kumar</strong></div>
                        <Button size="large" className="w-[75%] !bg-[#3386FF] !text-white !rounded-xl">Start Verification</Button>
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
            <div className="!text-center h-8 flex items-center !mx-auto mt-4 shadow-xl w-fit bg-white rounded-xl">
                <span className="mx-4 text-sm"><SafetyCertificateOutlined /> Your biometric data is encrypted and secure</span> </div>
        </DashboardLayout>
    )
}