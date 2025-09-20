import React from "react";
import { Select } from "antd";
import { Typography } from "antd";
import type { Biller } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

const { Text } = Typography;

type Props = {
  billers: Biller[];
  value?: string;
  onChange: (val: string) => void;
  showInactiveWarning?: boolean;
};

export default function BillerSelect({ billers, value, onChange, showInactiveWarning }: Props) {
  const options = billers
    .filter((b) => (b.biller_status ?? "INACTIVE") === "ACTIVE")
    .map((b) => ({ label: b?.billerName ?? "", value: b.biller_id }));

  return (
    <div>
      <Text strong>Biller *</Text>
      <Select
        placeholder="Choose Your Biller"
        value={value}
        onChange={onChange}
        className="!w-full !mt-1 !h-[54px]"
        options={options}
      />
      {showInactiveWarning && <div className="text-xs text-red-600 mt-1">Selected biller is not active.</div>}
    </div>
  );
}
