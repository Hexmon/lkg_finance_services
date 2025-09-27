"use client";

export type FeeState = {
    paymentAmountPaise: number;
    flatFeePaise: number;
    percentFee: number;
    ccf1Paise: number;
    gstPaise: number;
    totalFeePaise: number;
};

type RowProps = { label: string; value?: any };
const Row: React.FC<RowProps> = ({ label, value }) => {
    const v = value ?? "";
    if (String(v).trim() === "") return null;
    return (
        <div>
            <div className="text-gray-500">{label}</div>
            <div>{v}</div>
        </div>
    );
};

type Props = {
    feeState: FeeState;
    billPaise: number;
    amountToPayLabel: string;
    displayBillAmount?: string;
    paiseToRupees: (v?: string | number) => string;
    billerAdhoc: boolean
};

export default function FeeBreakdown({
    feeState,
    billPaise,
    amountToPayLabel,
    displayBillAmount,
    paiseToRupees,
    billerAdhoc
}: Props) {
    const ctaTotalPaise = feeState.totalFeePaise + (billPaise > 0 ? billPaise : 0);

    return (
        <>
            <Row
                label="Payment Amount (Base)"
                value={feeState.paymentAmountPaise > 0 ? `₹${paiseToRupees(feeState.paymentAmountPaise)}` : ""}
            />
            <Row
                label="Convenience Fee"
                value={0}
            />
            <Row
                label="CCF1"
                value={feeState.ccf1Paise > 0 ? `₹${paiseToRupees(feeState.ccf1Paise)}` : ""}
            />
            <Row
                label="GST on CCF1 (18%)"
                value={feeState.gstPaise > 0 ? `₹${paiseToRupees(feeState.gstPaise)}` : ""}
            />
            <Row
                label={amountToPayLabel}
                value={ctaTotalPaise > 0 ? `₹${paiseToRupees(ctaTotalPaise)}` : ""}
            />
            {

            }
            <Row label={billPaise > 0 ? "Bill Amount" : "Recharge Amount"}
                value={
                    billPaise > 0
                        ? `₹${paiseToRupees(billPaise)}`
                        : feeState.paymentAmountPaise > 0
                            ? `₹${paiseToRupees(feeState.paymentAmountPaise)}`
                            : ""
                } />
            {/* optional explicit bill amount formatting if provided */}
            {displayBillAmount && <Row label="Bill Amount (raw)" value={`₹${displayBillAmount}`} />}
        </>
    );
}
