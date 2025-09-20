"use client";

import { Card, Table, Button, Typography } from "antd";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

export type WalletStatementFilters = {
  subtype?: "CR" | "DR";
  statuses?: unknown[];    // API txn_status values (e.g., ["SUCCESS","FAILED"])
  walletNames?: unknown[]; // API wallet_name values (if you later add this)
  txnTypes?: unknown[];    // API txn_type values (e.g., ["DMT","AEPS"])
  search?: string;
  from?: Date | null;
  to?: Date | null;
};

export type ApiWalletTxnRow = {
  id: string;
  created_at: string;
  remark?: string | null;
  wallet_name: string;
  txn_type: string;
  subtype: "CR" | "DR";
  balance: number | string;
  current_balance: number | string;
  txn_status: string; // "SUCCESS" | "PENDING" | "FAILED" ...
  registered_name?: string;
  txn_id?: string;
};

export function deriveWalletStatementOptions(apiPage: ApiWalletTxnRow[]) {
  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean) as T[];

  const walletNames = uniq(apiPage.map((r) => r.wallet_name)).sort();
  const txnTypes = uniq(apiPage.map((r) => r.txn_type)).sort();
  const statuses = uniq(apiPage.map((r) => (r.txn_status ?? "").toUpperCase())).sort();
  const subtypes = uniq(apiPage.map((r) => r.subtype)).sort();

  return {
    walletNameOptions: walletNames.map((w) => ({ label: w, value: w })),
    txnTypeOptions: txnTypes.map((t) => ({ label: t, value: t })),
    statusOptions: statuses.map((s) => ({ label: s, value: s })),
    subtypeOptions: subtypes.map((s) => ({ label: s, value: s })),
  };
}

function normalizeToStringArray(input?: unknown[]): string[] {
  if (!input || !Array.isArray(input)) return [];
  return input
    .map((v) => {
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      if (v && typeof v === "object" && "value" in (v as any)) {
        const val = (v as any).value;
        if (typeof val === "string") return val;
        if (typeof val === "number") return String(val);
      }
      try {
        return JSON.stringify(v);
      } catch {
        return String(v ?? "");
      }
    })
    .filter(Boolean) as string[];
}

const STATUS_ALIAS: Record<string, string> = {
  COMPLETED: "SUCCESS",
  SUCCESS: "SUCCESS",
  FAIL: "FAILED",
  FAILED: "FAILED",
  PENDING: "PENDING",
};

function toUpperSet(arr?: unknown[]): Set<string> {
  if (!arr) return new Set();
  return new Set(
    normalizeToStringArray(arr).map((s) => STATUS_ALIAS[s.toUpperCase()] ?? s.toUpperCase())
  );
}

function normalizeFilterObject(filters?: WalletStatementFilters) {
  const f = filters ?? {};
  return {
    subtype: f.subtype as "CR" | "DR" | undefined,
    statuses: toUpperSet(f.statuses as unknown[]),
    walletNames: new Set(
      normalizeToStringArray(f.walletNames as unknown[]).map((s) => s.toUpperCase())
    ),
    txnTypes: new Set(
      normalizeToStringArray(f.txnTypes as unknown[]).map((s) => s.toUpperCase())
    ),
    q: (f.search ?? "").trim().toLowerCase(),
    from: f.from ? new Date(f.from) : null,
    to: f.to ? new Date(f.to) : null,
  };
}

export type WalletStatementProps = {
  apiPage: ApiWalletTxnRow[];
  loading?: boolean;
  perPage?: number;
  order?: "asc" | "desc";
  sortBy?: string;
  page?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  filters?: WalletStatementFilters;
};

export default function WalletStatement({
  apiPage,
  loading,
  perPage = 10,
  order = "desc",
  sortBy = "created_at",
  page: controlledPage,
  onPageChange,
  filters,
}: WalletStatementProps) {
  const [page, setPage] = useState<number>(controlledPage ?? 1);
  const [pageSize, setPageSize] = useState<number>(perPage);

  useEffect(() => {
    if (typeof controlledPage === "number" && controlledPage > 0) setPage(controlledPage);
  }, [controlledPage]);

  const rowsRaw = useMemo(() => {
    const fmt = (iso: string) => {
      const d = new Date(iso);
      const dd = d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "2-digit" });
      const time = d
        .toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })
        .replace(" ", "");
      return `${dd}, ${time}`;
    };

    return (apiPage ?? []).map((row) => {
      const amountNum = Number(row.balance);
      const balanceNum = Number(row.current_balance);
      const subtype = row.subtype;
      const prettyStatus =
        (row.txn_status ?? "").toUpperCase() === "SUCCESS" ? "Completed" : row.txn_status ?? "—";

      return {
        key: row.id,
        datetime: fmt(row.created_at),
        created_at: row.created_at,
        desc: row.remark || `${row.wallet_name} • ${row.txn_type}`,
        type: subtype === "CR" ? "Credited" : "Debited",
        subtype,
        amountNum,
        amount: `₹${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        balanceNum,
        balance: `₹${balanceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        statusPretty: prettyStatus,
        rawStatus: (row.txn_status ?? "").toUpperCase(),
        wallet_name: row.wallet_name,
        txn_type: row.txn_type,
        remark: row.remark ?? "",
      };
    });
  }, [apiPage]);

  const fNorm = useMemo(() => normalizeFilterObject(filters), [filters]);

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      subtype: fNorm.subtype ?? null,
      statuses: Array.from(fNorm.statuses).sort(),
      walletNames: Array.from(fNorm.walletNames).sort(),
      txnTypes: Array.from(fNorm.txnTypes).sort(),
      q: fNorm.q,
      from: fNorm.from ? fNorm.from.toISOString() : null,
      to: fNorm.to ? fNorm.to.toISOString() : null,
    });
  }, [fNorm]);

  useEffect(() => {
    setPage(1);
  }, [filtersKey]);

  const txData = useMemo(() => {
    let arr = rowsRaw;

    if (fNorm.subtype) {
      arr = arr.filter((r) => r.subtype === fNorm.subtype);
    }

    if (fNorm.statuses.size > 0) {
      arr = arr.filter((r) => fNorm.statuses.has((r.rawStatus ?? "").toUpperCase()));
    }

    if (fNorm.walletNames.size > 0) {
      arr = arr.filter((r) => fNorm.walletNames.has((r.wallet_name ?? "").toUpperCase()));
    }

    if (fNorm.txnTypes.size > 0) {
      arr = arr.filter((r) => fNorm.txnTypes.has((r.txn_type ?? "").toUpperCase()));
    }

    if (fNorm.q) {
      const q = fNorm.q;
      arr = arr.filter(
        (r) =>
          (r.remark ?? "").toLowerCase().includes(q) ||
          (r.wallet_name ?? "").toLowerCase().includes(q) ||
          (r.txn_type ?? "").toLowerCase().includes(q)
      );
    }

    if (fNorm.from || fNorm.to) {
      const fromTs = fNorm.from ? fNorm.from.getTime() : -Infinity;
      const toTs = fNorm.to ? fNorm.to.getTime() : Infinity;
      arr = arr.filter((r) => {
        const ts = new Date(r.created_at).getTime();
        return ts >= fromTs && ts <= toTs;
      });
    }

    return arr;
  }, [rowsRaw, filtersKey]);

  const pagedTxData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return txData.slice(start, start + pageSize);
  }, [txData, page, pageSize]);

  const columns = [
    { title: "Date & Time", dataIndex: "datetime", render: (t: string) => <Text className="!text-[13px] !text-[#9A9595] !font-medium">{t}</Text> },
    { title: "Description", dataIndex: "desc", render: (t: string) => <Text className="!text-[13px] !font-medium">{t}</Text> },
    {
      title: "Type",
      dataIndex: "type",
      render: (t: string) => (
        <span className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${t === "Credited" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"}`}>
          {t}
        </span>
      ),
    },
    { title: "Amount", dataIndex: "amount", render: (a: string) => <Text className="!text-[13px] !font-medium">{a}</Text> },
    { title: "Balance", dataIndex: "balance", render: (b: string) => <Text className="text-[13px] !font-medium">{b}</Text> },
    {
      title: "Status",
      dataIndex: "statusPretty",
      render: (s: string) => (
        <span className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${s === "Completed" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"}`}>
          {s}
        </span>
      ),
    },
    { title: "Help", render: () => <Image src="/info.svg" alt="help" width={18} height={18} /> },
  ];

  const handleExport = () => {
    const headers = ["Date & Time", "Description", "Type", "Amount", "Balance", "Status"];
    const rows = (txData ?? []).map((r) => [r.datetime, r.desc, r.type, r.amount, r.balance, r.statusPretty].join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Wallet_Transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-3">
        <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
          <div className="flex justify-between items-start p-4 mb-0">
            <div>
              <Text className="!text-[20px] !font-medium block">Wallet Transactions</Text>
              <Text className="!text-[12px] !font-light text-gray-500">Recent money transfer transactions</Text>
            </div>
            <Button className="bg-white shadow-xl px-4 rounded-lg flex items-center h-fit" onClick={handleExport}>
              <Image src="/download.svg" alt="export" width={15} height={15} />
              <Text className="inline ml-2">Export</Text>
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={pagedTxData}
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total: txData.length,
              onChange: (p, ps) => {
                setPage(p);
                if (ps && ps !== pageSize) setPageSize(ps);
                onPageChange?.(p, ps ?? pageSize);
              },
              showSizeChanger: true,
              showTotal: (t) => `Showing ${pagedTxData.length} of ${t} filtered`,
            }}
            bordered={false}
          />
        </Card>
      </div>

      {/* <Card className="rounded-2xl shadow-md p-6">right summary card placeholder</Card> */}
    </div>
  );
}
