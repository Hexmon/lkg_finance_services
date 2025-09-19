// utils/mapBankListToOptions.ts

import { SmartOption } from "@/components/ui/SmartSelect";
import { AEPSBankListResponse } from "@/features/retailer/cash_withdrawl/domain/types";

export function mapBankListToOptions(resp: AEPSBankListResponse): SmartOption<string>[] {
  return (resp.bankList || []).map((b, idx) => {
    const name = b["Bank Name"] ?? "Unknown Bank";
    const iin = b.IIN != null ? String(b.IN) : b.IIN != null ? String(b.IIN) : ""; // tolerate numberLike/undefined
    const ifsc = b.IFSC ?? "";
    const code = b["Bank Code"] ?? "";
    const value = iin || ifsc || code || `${name}-${idx}`; // unique, stable enough

    return {
      value,
      meta: b, // keep full record for submit
      label: (
        <div className="flex flex-col" >
          <span className="font-medium"> {name} </span>
          < span className="text-xs text-gray-500" >
            {iin ? `IIN: ${iin}` : ""}{iin && (ifsc || code) ? " • " : ""}
            {ifsc ? `IFSC: ${ifsc}` : code ? `Code: ${code}` : ""}
          </span>
        </div>
      ),
    };
  });
}
