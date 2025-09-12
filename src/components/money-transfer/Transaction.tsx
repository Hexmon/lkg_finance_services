"use client";

import React, { useMemo, useState } from "react";
import SmartTable, { SmartTableColumn, IconCircleButton } from "@/components/ui/SmartTable";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import type { TransactionSummaryItem } from "@/features/retailer/general/domain/types";
import { Spin, Tag } from "antd";
import { useTransactionSummaryQuery } from "@/features/retailer/general/data/hooks"; // adjust path

function StatusPill({ status }: { status: string }) {
  const s = status.toUpperCase();
  let color: "success" | "default" | "warning" | "error" = "default";
  if (s === "SUCCESS") color = "success";
  else if (s === "PENDING" || s === "PROCESSING") color = "warning";
  else if (s === "FAILED" || s === "REJECTED") color = "error";
  return <Tag color={color}>{s}</Tag>;
}

function formatDateParts(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "—" };
  const dd = d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
  const tt = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  return { date: dd, time: tt };
}

export default function TransactionsPaged() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data, isLoading } = useTransactionSummaryQuery({
    page,
    per_page: perPage,
    order: "desc",
  });

  const rows: TransactionSummaryItem[] = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns: SmartTableColumn<TransactionSummaryItem>[] = useMemo(
    () => [
      { key: "serial", title: "#", width: 56, render: ({ rowIndex }) => <span className="text-sm">{rowIndex + 1}</span> },
      {
        key: "created_at",
        title: "Date",
        width: 152,
        render: ({ record }) => {
          const { date, time } = formatDateParts(record.created_at);
          return (
            <div className="leading-tight">
              <div className="text-[13px]">{date}</div>
              <div className="text-[12px] text-gray-500">{time}</div>
            </div>
          );
        },
      },
      {
        key: "txn_id",
        title: "Transaction ID",
        width: 240,
        render: ({ record }) => (
          <div className="leading-tight">
            <div className="text-[13px] font-medium">{record.txn_id}</div>
            <div className="text-[12px] text-gray-500">Ref: {record.txn_reference_id ?? "—"}</div>
          </div>
        ),
      },
      {
        key: "party",
        title: "Sender",
        width: 200,
        render: ({ record }) => (
          <div className="leading-tight">
            <div className="text-[12px] font-medium">{record.name}</div>
            <div className="text-[12px] text-gray-600">{record.registered_name}</div>
          </div>
        ),
      },
      {
        key: "benef",
        title: "Beneficiary",
        width: 220,
        render: ({ record }) => (
          <div className="leading-tight">
            <div className="text-[12px] font-medium">{record.service ?? "—"}</div>
            <div className="text-[12px] text-gray-600">{record.api_partner ?? "—"}</div>
          </div>
        ),
      },
      {
        key: "bank",
        title: "Bank",
        width: 220,
        render: ({ record }) => (
          <div className="leading-tight">
            <div className="text-[12px] font-medium">
              {record.mode} • {record.txn_subtype}
            </div>
            <div className="text-[12px] text-gray-600">Service ID: {record.service_id ?? "—"}</div>
          </div>
        ),
      },
      {
        key: "amount",
        title: "Amount",
        width: 160,
        render: ({ record }) => (
          <div className="leading-tight">
            <div className="text-[12px]"><span className="font-medium">Amount:</span> {record.txn_amount}</div>
            <div className="text-[12px]"><span className="font-medium">Charges:</span> {record.txn_tax ?? 0}</div>
          </div>
        ),
      },
      { key: "status", title: "Status", width: 120, align: "center", render: ({ record }) => <StatusPill status={record.txn_status} /> },
      {
        key: "action",
        title: "Action",
        width: 120,
        align: "center",
        render: ({ record }) => (
          <div className="flex items-center gap-2 justify-center">
            <IconCircleButton title="View" icon={<EyeOutlined />} onClick={() => console.log("view", record.id)} />
            <IconCircleButton title="Download" icon={<DownloadOutlined />} onClick={() => console.log("download", record.id)} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <Spin spinning={isLoading}>
        <SmartTable<TransactionSummaryItem>
          columns={columns}
          data={rows}
          dense
          card
          colors={{
            headerBg: "#f5f5f5",
            headerText: "#111",
            rowBg: "#ffffff",
            altRowBg: "#fafafa",
            rowText: "#111",
            border: "#e6e6e6",
            hoverBg: "#f7fbff",
          }}
          caption="Transaction Summary"
          pagination={{
            mode: "server",
            page,
            pageSize: perPage,
            total,
            pageSizeOptions: [5, 10, 20, 50],
            showSizeChanger: true,
            align: "right",
            onChange: (p, ps) => {
              // Sync with query params
              setPage(p);
              setPerPage(ps);
              // your hook will refetch because page/perPage are deps
            },
          }}
        />
      </Spin>
    </div>
  );
}
