// utils/mapBankListToOptions.ts
import { SmartOption } from "@/components/ui/SmartSelect";
import type { AEPSBankListResponse, AEPSBankListItem } from "@/features/retailer/cash_withdrawl/domain/types";

function toStrOrEmpty(v: unknown): string {
  return v == null ? "" : String(v);
}

export function mapBankListToOptions(resp: AEPSBankListResponse): SmartOption<string>[] {
  return (resp.bankList || []).map((b: AEPSBankListItem, idx) => {
    const name = b["Bank Name"] ?? "Unknown Bank";
    const iin  = toStrOrEmpty(b.IIN);           // <- correct key, robust stringify
    const ifsc = toStrOrEmpty(b.IFSC);
    const code = toStrOrEmpty(b["Bank Code"]);

    // Prefer IIN as the option value (6 digits), else fallback
    const value = iin || ifsc || code || `${name}-${idx}`;

    return {
      value,
      meta: b, // keep full record for submit (deriveIIN will read meta.IIN)
      label: (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-gray-500">
            {iin ? `IIN: ${iin}` : ""}
            {iin && (ifsc || code) ? " • " : ""}
            {ifsc ? `IFSC: ${ifsc}` : code ? `Code: ${code}` : ""}
          </span>
        </div>
      ),
    };
  });
}
