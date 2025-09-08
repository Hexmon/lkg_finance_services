import DashboardSectionHeader from "@/components/ui/DashboardSectionHeader";
import { cashWithdrawSidebarConfig } from "@/config/sidebarconfig";
import { CardLayout } from "@/lib/layouts/CardLayout";
import DashboardLayout from "@/lib/layouts/DashboardLayout";
import { ArrowLeftOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Image from "next/image";

export default function PaymentSuccess() {
    return (
        <DashboardLayout
            sections={cashWithdrawSidebarConfig}
            activePath="/payment-success"
            pageTitle="Payment Success"
        >
            <DashboardSectionHeader
                title="Payment Successful"
                titleClassName="!font-semibold !text-[20px] !mb-6 flex !items-center !mt-4"
            />

            {/* Card Layout */}
            <CardLayout
                variant="info"
                size="lg"
                width="w-full"
                height="min-h-[380px]"
                divider={false}
                className="mx-auto bg-[#0BA82F] shadow-xl rounded-xl"
                body={
                    <div className="grid place-items-center gap-6 py-8">
                        {/* Success Icon */}
                        <div className="h-20 w-20 rounded-full bg-white shadow-inner flex items-center justify-center">
                            <Image
                                src="/verified-b.svg"
                                alt="Payment Successfull"
                                width={75}
                                height={75}
                                className="object-contain"
                            />
                        </div>

                        {/* Success Message */}
                        <div className="text-center space-y-2">
                            <h2 className="text-lg font-semibold text-green-600">
                                Payment Completed!
                            </h2>
                            <span className="text-sm font-semibold text-green-600">
                                Your payment has been processed successfully.
                            </span>
                        </div>

                        {/* Transaction Details */}
                        <div className="w-full bg-[#FFF9F2] rounded-lg shadow-sm px-6 py-6 text-sm flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-center">
                                {/* Transaction ID */}
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">Transaction ID</span>
                                    <span className="font-semibold">TXNIPRS02MQFZH</span>
                                </div>

                                {/* Amount Paid */}
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">Amount Paid</span>
                                    <span className="font-semibold">₹999</span>
                                </div>

                                {/* Sender Name */}
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">Sender Name</span>
                                    <span className="font-semibold">Rajesh Kumar</span>
                                </div>

                                {/* Customer ID */}
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-600">Customer ID</span>
                                    <span className="font-semibold">97886556</span>
                                </div>
                            </div>
                        </div>



                        {/* Buttons */}
                        <div className="flex gap-3 w-full justify-center">
                            <Button
                                size="large"
                                className="flex-1 !bg-white border !text-black rounded-lg shadow-sm"
                            >
                                Download Receipt
                            </Button>
                            <Button
                                size="large"
                                className="flex-1 !bg-green-500 !text-white rounded-lg"
                            >
                                Make Another Payment
                            </Button>
                        </div>
                    </div>
                }
            />
        </DashboardLayout>
    );
}
