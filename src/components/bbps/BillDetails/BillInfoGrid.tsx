"use client";

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

export type BillerResponseLite = {
  customerName?: string;
  billAmount?: string | number;
  billDate?: string;
  billNumber?: string;
  billPeriod?: string;
  dueDate?: string;
};

type Props = {
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  billerId: string;
  bfr: BillerResponseLite | null;
  validationInfo?: { infoName?: string; infoValue?: string } | null;
  extra?: React.ReactNode; // for injecting more rows if needed
};

export default function BillInfoGrid({
  customerName,
  customerMobile,
  customerEmail,
  billerId,
  bfr,
  validationInfo,
  extra,
}: Props) {
  return (
    <div className="bg-[#FFFFFF] p-6 rounded-xl shadow-md">
      <div className="!grid !grid-cols-4 md:grid-cols-3 gap-y-6 gap-x-4 text-sm font-medium text-[#333]">
        <Row label="Customer Name" value={customerName} />
        <Row label="Customer Number" value={customerMobile} />
        <Row label="Email" value={customerEmail} />
        <Row label="Biller Id" value={billerId} />

        <Row label="Bill Period" value={bfr?.billPeriod} />
        <Row label="Bill Number" value={bfr?.billNumber} />
        <Row label="Due Date" value={bfr?.dueDate} />
        <Row label="Bill Date" value={bfr?.billDate} />

        {validationInfo?.infoName && validationInfo?.infoValue && (
          <Row label={validationInfo.infoName!} value={validationInfo.infoValue} />
        )}

        {extra}
      </div>
    </div>
  );
}
