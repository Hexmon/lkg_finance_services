// WalletStatement.tsx
"use client";

import { Card, Table, Button, Typography } from "antd";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

/** ----- Filter types the parent can pass ----- */
export type WalletStatementFilters = {
  /** "CR" or "DR" (API: subtype) */
  subtype?: "CR" | "DR";
  /** API statuses, e.g. ["SUCCESS","FAILED"] (API: txn_status) */
  statuses?: unknown[];          // ← can be string[] or {value,label}[]; normalize below
  /** API wallet names, e.g. ["MAIN","AEPS"] (API: wallet_name) */
  walletNames?: unknown[];       // ← normalize below
  /** API txn types, e.g. ["AEPS","DMT","COMMISSION"] (API: txn_type) */
  txnTypes?: unknown[];          // ← normalize below
  /** free-text search on remark + wallet_name + txn_type (case-insensitive) */
  search?: string;
  /** inclusive UTC start time, compares to created_at */
  from?: Date | null;
  /** inclusive UTC end time, compares to created_at */
  to?: Date | null;
};

/** ----- Minimal shape for API rows we use ----- */
export type ApiWalletTxnRow = {
  id: string;
  created_at: string;
  remark?: string | null;
  wallet_name: string;
  txn_type: string;
  subtype: "CR" | "DR";
  balance: number | string;
  current_balance: number | string;
  txn_status: string; // API: e.g. "SUCCESS"
  // optional extra fields you might have:
  registered_name?: string;
  txn_id?: string;
};

/** Build dropdown options from the current page (dedup + sorted). */
export function deriveWalletStatementOptions(apiPage: ApiWalletTxnRow[]) {
  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean) as T[];

  const walletNames = uniq(apiPage.map((r) => r.wallet_name)).sort();
  const txnTypes = uniq(apiPage.map((r) => r.txn_type)).sort();
  const statuses = uniq(apiPage.map((r) => (r.txn_status ?? "").toUpperCase())).sort();
  const subtypes = uniq(apiPage.map((r) => r.subtype)).sort(); // ["CR","DR"]

  return {
    walletNameOptions: walletNames.map((w) => ({ label: w, value: w })),
    txnTypeOptions: txnTypes.map((t) => ({ label: t, value: t })),
    statusOptions: statuses.map((s) => ({ label: s, value: s })), // value = API value
    subtypeOptions: subtypes.map((s) => ({ label: s, value: s })), // CR/DR
  };
}

/** Normalize dropdown arrays (string[] | {value,label}[]) → string[] */
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

export type WalletStatementProps = {
  /** server-provided one page of transactions */
  apiPage: ApiWalletTxnRow[];
  /** parent-provided loading */
  loading?: boolean;

  /** display-only */
  perPage?: number;
  order?: "asc" | "desc";
  sortBy?: string;

  /** parent-controlled server page index */
  page?: number;
  onPageChange?: (page: number, pageSize: number) => void;

  /** parent-provided filters (client-side) */
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

  useEffect(() => {
    setPage(1);
  }, [filters]);

  // ---- map upstream -> row model (UI-ready) ----
  const rowsRaw = useMemo(() => {
    const fmt = (iso: string) => {
      const d = new Date(iso);
      const dd = d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const time = d
        .toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })
        .replace(" ", "");
      return `${dd}, ${time}`;
    };

    return (apiPage ?? []).map((row) => {
      const amountNum = Number(row.balance);
      const balanceNum = Number(row.current_balance);
      const subtype = row.subtype;
      // Keep a human label, but DO NOT use it for filtering.
      const prettyStatus =
        (row.txn_status ?? "").toUpperCase() === "SUCCESS"
          ? "Completed"
          : row.txn_status ?? "—";

      return {
        key: row.id,
        datetime: fmt(row.created_at),
        created_at: row.created_at, // for date filters
        desc: row.remark || `${row.wallet_name} • ${row.txn_type}`,
        type: subtype === "CR" ? "Credited" : "Debited",
        subtype,
        amountNum,
        amount: `₹${amountNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        balanceNum,
        balance: `₹${balanceNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        statusPretty: prettyStatus, // for display
        rawStatus: (row.txn_status ?? "").toUpperCase(), // for filtering
        wallet_name: row.wallet_name,
        txn_type: row.txn_type,
        remark: row.remark ?? "",
      };
    });
  }, [apiPage]);

  // ---- apply client-side filters using **API keys** ----
  const txData = useMemo(() => {
    let arr = rowsRaw;

    if (filters?.subtype) {
      arr = arr.filter((r) => r.subtype === filters.subtype);
    }

    if (filters?.statuses?.length) {
      const statuses = normalizeToStringArray(filters.statuses).map((s) => s.toUpperCase());
      const statusSet = new Set(statuses);
      arr = arr.filter((r) => statusSet.has(r.rawStatus)); // ✅ match API txn_status
    }

    if (filters?.walletNames?.length) {
      const walletNames = normalizeToStringArray(filters.walletNames).map((w) => w.toUpperCase());
      const walletSet = new Set(walletNames);
      arr = arr.filter((r) => walletSet.has((r.wallet_name ?? "").toUpperCase()));
    }

    if (filters?.txnTypes?.length) {
      const txnTypes = normalizeToStringArray(filters.txnTypes).map((t) => t.toUpperCase());
      const typeSet = new Set(txnTypes);
      arr = arr.filter((r) => typeSet.has((r.txn_type ?? "").toUpperCase()));
    }

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      arr = arr.filter(
        (r) =>
          (r.remark ?? "").toLowerCase().includes(q) ||
          (r.wallet_name ?? "").toLowerCase().includes(q) ||
          (r.txn_type ?? "").toLowerCase().includes(q)
      );
    }

    if (filters?.from || filters?.to) {
      const fromTs = filters.from ? filters.from.getTime() : Number.NEGATIVE_INFINITY;
      const toTs = filters.to ? filters.to.getTime() : Number.POSITIVE_INFINITY;
      arr = arr.filter((r) => {
        const ts = new Date(r.created_at).getTime();
        return ts >= fromTs && ts <= toTs;
      });
    }

    return arr;
  }, [rowsRaw, filters]);

  const pagedTxData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return txData.slice(start, start + pageSize);
  }, [txData, page, pageSize]);

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "datetime",
      render: (t: string) => (
        <Text className="!text-[13px] !text-[#9A9595] !font-medium">{t}</Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "desc",
      render: (t: string) => <Text className="!text-[13px] !font-medium">{t}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (t: string) => (
        <span
          className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${
            t === "Credited" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"
          }`}
        >
          {t}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (a: string) => <Text className="!text-[13px] !font-medium">{a}</Text>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (b: string) => <Text className="text-[13px] !font-medium">{b}</Text>,
    },
    {
      title: "Status",
      dataIndex: "statusPretty",
      render: (s: string) => (
        <span
          className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${
            s === "Completed" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"
          }`}
        >
          {s}
        </span>
      ),
    },
    { title: "Help", render: () => <Image src="/info.svg" alt="help" width={18} height={18} /> },
  ];

  const handleExport = () => {
    const headers = ["Date & Time", "Description", "Type", "Amount", "Balance", "Status"];
    const rows = (txData ?? []).map((r) =>
      [r.datetime, r.desc, r.type, r.amount, r.balance, r.statusPretty].join(",")
    );
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
      <div className="lg:col-span-2">
        <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
          <div className="flex justify-between items-start p-4 mb-0">
            <div>
              <Text className="!text-[20px] !font-medium block">Wallet Transactions</Text>
              <Text className="!text-[12px] !font-light text-gray-500">
                Recent money transfer transactions
              </Text>
            </div>
            <Button
              className="bg-white shadow-xl px-4 rounded-lg flex items-center h-fit"
              onClick={handleExport}
            >
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

      {/* Right summary card (unchanged placeholder) */}
      <Card className="rounded-2xl shadow-md p-6">
        {/* ... */}
      </Card>
    </div>
  );
}
