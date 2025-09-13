import React from "react";
import { Typography, Input } from "antd";
import type { BillerInputParam } from "@/features/retailer/retailer_bbps/bbps-online/bill-fetch/domain/types";

const { Text } = Typography;

type Props = {
  inputs: BillerInputParam[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

const isValid = (v: string, pattern?: string | null) => {
  if (!pattern) return true;
  try { return new RegExp(pattern).test(v ?? ""); } catch { return true; }
};

export default function DynamicParamsForm({ inputs, values, onChange }: Props) {
  return (
    <>
      {inputs.map((p) => {
        const val = values[p.param_name] ?? "";
        const showRegex = !!val && !!p.regex_pattern && !isValid(val, p.regex_pattern);
        const showMin = !!val && p.min_length != null && val.length < p.min_length;
        const showMax = !!val && p.max_length != null && val.length > p.max_length;

        return (
          <div key={p.param_name}>
            <Text strong>{p.display_name} {p.is_optional ? "" : "*"}</Text>
            <Input
              placeholder={`Enter ${p.display_name}`}
              value={val}
              onChange={(e) => onChange(p.param_name, e.target.value)}
              className="mt-1 !h-[54px]"
              maxLength={p.max_length ?? undefined}
              required={!p.is_optional}
            />
            {(showRegex || showMin || showMax) && (
              <div className="text-xs text-red-600 mt-1">
                {showRegex && <>Invalid {p.display_name} format.</>}
                {showMin && <> Minimum length is {p.min_length}.</>}
                {showMax && <> Maximum length is {p.max_length}.</>}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1 mb-4">
              {p.data_type && <span>{p.data_type}</span>}
              {p.regex_pattern && <span> • Pattern: {p.regex_pattern}</span>}
              {p.min_length != null && p.max_length != null && (
                <span> • Length: {p.min_length}–{p.max_length}</span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
