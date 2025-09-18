"use client";

import React, { useState } from "react";
import { Button, DatePicker } from "antd";
import SmartTabs from "../ui/SmartTabs";
import SmartSelect, { SmartOption } from "../ui/SmartSelect";

type ServiceValue = "ALL" | "DMT" | "BBPS" | "AEPS" | "RECHARGE";
type StatusValue = "ALL" | "SUCCESS" | "PENDING" | "FAILED";

const SERVICE_OPTIONS: SmartOption<ServiceValue>[] = [
  { label: "Service (All)", value: "ALL" },
  { label: "Money Transfer (DMT)", value: "DMT" },
  { label: "Bill Payments (BBPS)", value: "BBPS" },
  { label: "AEPS", value: "AEPS" },
  { label: "Recharge", value: "RECHARGE" },
];

const STATUS_OPTIONS: SmartOption<StatusValue>[] = [
  { label: "Status (All)", value: "ALL" },
  { label: "Success", value: "SUCCESS" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export default function ReportTable() {
  // local control states (adjust if you already control these from parent)
  const [service, setService] = useState<ServiceValue>("ALL");
  const [status, setStatus] = useState<StatusValue>("ALL");

  return (
    <>
      <div className="flex gap-3 p-4 bg-white rounded-2xl shadow-inner justify-between">
        {/* From Date */}
        <DatePicker
          placeholder="From Date"
          style={{
            width: 203,
            height: 35,
            borderRadius: 12,
            padding: "6px 12px",
            boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
          }}
        />

        {/* To Date */}
        <DatePicker
          placeholder="To Date"
          style={{
            width: 203,
            height: 35,
            borderRadius: 12,
            padding: "6px 12px",
            boxShadow: "5px 5px 5px rgba(0,0,0,0.1)",
          }}
        />

        {/* Service SmartSelect */}
        <div className="px-0 py-0  bg-white w-[203px]">
          <SmartSelect<ServiceValue>
            options={SERVICE_OPTIONS}
            value={service}
            onChange={(val) => setService(val ?? "ALL")}
            placeholder="Service"
            allowClear={false}
            dense
            className="w-[203px] shadow-md rounded-2xl"
            aria-label="Service"
          />
        </div>

        {/* Status SmartSelect */}
        <div className="px-0 py-0   bg-white w-[203px]">
          <SmartSelect<StatusValue>
            options={STATUS_OPTIONS}
            value={status}
            onChange={(val) => setStatus(val ?? "ALL")}
            placeholder="Status"
            allowClear={false}
            dense
            className="w-[203px] shadow-md rounded-2xl "
            aria-label="Status"
          />
        </div>

        {/* Filter Button */}
        {/* <Button
          type="default"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md text-gray-700 font-medium w-[109px]"
          onClick={() => {
            // wire your filter action here
            // e.g., fetch({ from, to, service, status })
            console.log({ service, status });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filter
        </Button> */}
      </div>

      {/* <SmartTabs
        items={items}
        activeKey={activeTab}
        onChange={setActiveTab}
        keepAlive
        fitted={false}
        durationMs={260}
        easing="cubic-bezier(.22,1,.36,1)"
      /> */}
    </>
  );
}
