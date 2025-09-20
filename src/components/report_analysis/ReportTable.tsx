"use client";

import React, { useEffect, useRef, useState } from "react";
import { DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";

type ServiceValue = "ALL" | "DMT" | "BBPS" | "AEPS" | "RECHARGE";
type StatusValue  = "ALL" | "SUCCESS" | "PENDING" | "FAILED";

export type ReportTableFiltersPayload = {
  from?: Date | null;
  to?: Date | null;
  service?: ServiceValue;
  status?: StatusValue;
};

const SERVICE_OPTIONS = [
  { label: "Service (All)", value: "ALL" as const },
  { label: "Money Transfer (DMT)", value: "DMT" as const },
  { label: "Bill Payments (BBPS)", value: "BBPS" as const },
  { label: "AEPS", value: "AEPS" as const },
  { label: "Recharge", value: "RECHARGE" as const },
];

const STATUS_OPTIONS = [
  { label: "Status (All)", value: "ALL" as const },
  { label: "Success", value: "SUCCESS" as const },
  { label: "Pending", value: "PENDING" as const },
  { label: "Failed", value: "FAILED" as const },
];

export default function ReportTable({
  onFiltersChange,
}: {
  onFiltersChange?: (f: ReportTableFiltersPayload) => void;
}) {
  const [service, setService] = useState<ServiceValue>("ALL");
  const [status, setStatus]   = useState<StatusValue>("ALL");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate]     = useState<Dayjs | null>(null);

  // track last emitted payload to avoid re-emitting identical filters
  const lastJsonRef = useRef<string>("");

  useEffect(() => {
    const payload: ReportTableFiltersPayload = {
      service,
      status,
      from: fromDate ? fromDate.startOf("day").toDate() : null,
      to:   toDate   ? toDate.endOf("day").toDate()     : null,
    };

    const json = JSON.stringify(payload); // Dates serialize to ISO strings
    if (json !== lastJsonRef.current) {
      lastJsonRef.current = json;
      onFiltersChange?.(payload);
    }
    // Intentionally NOT depending on onFiltersChange identity to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, status, fromDate, toDate]);

  return (
    <div className="flex gap-3 p-4 bg-white rounded-2xl shadow-inner justify-between">
      {/* From Date */}
      <DatePicker
        placeholder="From Date"
        value={fromDate ?? undefined}
        onChange={(val) => setFromDate(val)}
        style={{
          width: 203, height: 35, borderRadius: 12, padding: "6px 12px",
          boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
        }}
      />

      {/* To Date */}
      <DatePicker
        placeholder="To Date"
        value={toDate ?? undefined}
        onChange={(val) => setToDate(val)}
        style={{
          width: 203, height: 35, borderRadius: 12, padding: "6px 12px",
          boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
        }}
      />

      {/* Service */}
      <div className="px-0 py-0 bg-white w-[203px]">
        <Select
          options={SERVICE_OPTIONS}
          value={service}
          onChange={(val) => setService((val as ServiceValue) ?? "ALL")}
          placeholder="Service"
          allowClear={false}
          className="w-[203px] shadow-md rounded-2xl"
          style={{ height: 35, borderRadius: 12 }}
          popupMatchSelectWidth
          showSearch={false}
          aria-label="Service"
        />
      </div>

      {/* Status */}
      <div className="px-0 py-0 bg-white w-[203px]">
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(val) => setStatus((val as StatusValue) ?? "ALL")}
          placeholder="Status"
          allowClear={false}
          className="w-[203px] shadow-md rounded-2xl"
          style={{ height: 35, borderRadius: 12 }}
          popupMatchSelectWidth
          showSearch={false}
          aria-label="Status"
        />
      </div>
    </div>
  );
}
