"use client";

import { Modal, Radio, Button, InputNumber } from "antd";
import Image from "next/image";

type PayModeUI = "Wallet" | "Cashfree";

type Props = {
    open: boolean;
    onClose: () => void;
    payLoading: boolean;
    ctaAmountText: string; // already formatted rupees string
    paymentMode: PayModeUI;
    setPaymentMode: (mode: PayModeUI) => void;
    onProceed: () => void;
    billerAdhoc: boolean
    paymentAmount: number | null;
    setPaymentAmount: (amt: number | null) => void;
};

export default function PayModal({
    open,
    onClose,
    payLoading,
    ctaAmountText,
    paymentMode,
    setPaymentMode,
    onProceed, billerAdhoc,
    paymentAmount, setPaymentAmount
}: Props) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={!payLoading}
            centered
            width={340}
            className="!rounded-2xl !p-0"
        >
            <div className="text-center py-6 px-4">
                <h3 className="text-[#3386FF] text-sm font-medium mb-1">Payable Amount</h3>
                {
                    billerAdhoc ?
                        <InputNumber
                            className="mb-4 w-full"
                            min={0}
                            step={0.01}
                            controls={false}
                            // If your typings don't accept null, map null -> undefined:
                            value={paymentAmount ?? undefined}
                            onChange={(v) => setPaymentAmount(v)}
                            addonBefore="₹"
                            disabled={payLoading}
                            placeholder="Enter amount"
                        />
                        : <div className="text-[#3386FF] text-2xl font-bold mb-4">₹{ctaAmountText}</div>
                }


                <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-700">
                    <Radio.Group
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        disabled={payLoading}
                    >
                        <Radio value="Wallet">Wallet</Radio>
                        <Radio value="Cashfree">
                            <Image src="/cashfree.svg" alt="Cashfree" width={70} height={20} className="inline-block" />
                        </Radio>
                    </Radio.Group>
                </div>

                <Button
                    type="primary"
                    block
                    className="!bg-[#0BA82F] !text-white !rounded-lg !h-[38px]"
                    onClick={onProceed}
                    loading={payLoading}
                    disabled={payLoading}
                >
                    {payLoading ? "Processing..." : "Proceed to Pay"}
                </Button>
            </div>
        </Modal>
    );
}
