/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Typography, Input, Select, Alert, Skeleton, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SmartTable, { type SmartTableColumn } from "@/components/ui/SmartTable";
import { apiGetTransactionSummary } from "@/features/retailer/general/data/endpoints";

const { Text } = Typography;
const { Option } = Select;

/** ---------- Types from API (loose) ---------- */
type ApiTxn = {
  id: string;
  txn_id: string;
  service?: string | null; // AEPS, DMT, BBPS, etc. (shown as Category in UI)
  created_at: string; // ISO
  txn_type?: string | null; // CREDIT / DEBIT / AEPS / DMT etc.
  txn_amount: number;
  commission?: unknown; // may be number | object | array | null (API varies)
  txn_status: "SUCCESS" | "FAILED" | "PENDING" | string;
  customer_id?: string | null;
  mode?: string | null;
  user_id?: string | null;
};

type ApiResponse = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
  sort_by: string;
  data: ApiTxn[];
};

/** ---------- Helpers ---------- */
function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso ?? "—";
  }
}

function formatINR(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

/** Normalize commission → number; default 0 */
function toCommissionAmount(c: unknown): number {
  if (c == null) return 0;
  if (typeof c === "number") return Number.isFinite(c) ? c : 0;

  if (Array.isArray(c)) {
    const sum = c.reduce((acc, item: any) => {
      const v =
        typeof item?.net_commission === "number"
          ? item.net_commission
          : typeof item?.gross_commission === "number"
          ? item.gross_commission
          : 0;
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
    return Number.isFinite(sum) ? sum : 0;
  }

  if (typeof c === "object") {
    const obj = c as any;
    const v =
      typeof obj?.net_commission === "number"
        ? obj.net_commission
        : typeof obj?.gross_commission === "number"
        ? obj.gross_commission
        : Number(obj);
    return Number.isFinite(v) ? v : 0;
  }

  const n = Number(c);
  return Number.isFinite(n) ? n : 0;
}

/** Row we actually render (adds normalized commission & safe fields) */
type UiTxn = ApiTxn & {
  commission_amount: number; // always numeric
};

export default function ReportTransactionHistory() {
  // ---------- local states ----------
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // full dataset (ALL pages)
  const [allRows, setAllRows] = useState<ApiTxn[]>([]);

  // client pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // top-bar filters
  const [search, setSearch] = useState<string>("");
  const [fltType, setFltType] = useState<string>("all");
  const [fltStatus, setFltStatus] = useState<string>("all");
  const [fltCategory, setFltCategory] = useState<string>("all");

  // ---------- fetch ALL pages once ----------
  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const per_page = 100; // tune as needed
        let pageNo = 1;
        let acc: ApiTxn[] = [];

        for (;;) {
          const resp: ApiResponse = await apiGetTransactionSummary({
            page: pageNo,
            per_page,
            order: "desc",
          });

          const chunk = resp?.data ?? [];
          acc = acc.concat(chunk);

          if (!resp?.has_next) break;
          pageNo += 1;
        }

        if (!cancelled) setAllRows(acc);
      } catch (e: any) {
        if (!cancelled) {
          setErrorMsg(e?.message || "Failed to load transactions.");
          message.error("Failed to load transactions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- build UI rows with normalized commission ----------
  const uiRows: UiTxn[] = useMemo(
    () =>
      (allRows || []).map((r) => ({
        ...r,
        commission_amount: toCommissionAmount((r as any).commission),
      })),
    [allRows]
  );

  // ---------- unique option sets for top filters (based on data) ----------
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    uiRows.forEach((r) => set.add(String(r.service ?? "—")));
    return Array.from(set).filter(Boolean);
  }, [uiRows]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    uiRows.forEach((r) => set.add(String(r.txn_type ?? "—")));
    return Array.from(set).filter(Boolean);
  }, [uiRows]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    uiRows.forEach((r) => set.add(String(r.txn_status ?? "—").toUpperCase()));
    return Array.from(set).filter(Boolean);
  }, [uiRows]);

  // ---------- apply client-side filters ----------
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return uiRows.filter((r) => {
      // text search across common fields
      const hay = [
        r.txn_id,
        r.service,
        r.txn_type,
        r.user_id,
        r.customer_id,
        r.mode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const okSearch = q ? hay.includes(q) : true;

      const okType = fltType === "all" ? true : String(r.txn_type ?? "—") === fltType;
      const okStatus =
        fltStatus === "all"
          ? true
          : String(r.txn_status ?? "—").toUpperCase() === fltStatus.toUpperCase();
      const okCategory =
        fltCategory === "all" ? true : String(r.service ?? "—") === fltCategory;

      return okSearch && okType && okStatus && okCategory;
    });
  }, [uiRows, search, fltType, fltStatus, fltCategory]);

  const total = filteredRows.length;

  // ---------- columns ----------
  const columns: SmartTableColumn<UiTxn>[] = useMemo(
    () => [
      {
        key: "txn",
        title: "Transaction",
        render: ({ record }) => (
          <div className="min-w-[200px]">
            <Text className="!font-medium !text-[14px]">{record.txn_id || "—"}</Text>
            <br />
            <Text className="!text-[12px] !text-[#9A9595]">{record.service || "—"}</Text>
          </div>
        ),
      },
      {
        key: "date",
        title: "Date & Time",
        dataIndex: "created_at",
        render: ({ value }) => (
          <Text className="!text-[14px] !text-[#9A9595] !font-medium">{formatDateTime(value)}</Text>
        ),
      },
      {
        key: "type",
        title: "Type",
        dataIndex: "txn_type",
        render: ({ value }) => <Text className="!text-[14px] !font-medium">{value ?? "—"}</Text>,
      },
      {
        key: "customer",
        title: "Customer / Ref",
        dataIndex: "customer_id",
        render: ({ value, record }) => (
          <Text className="!text-[14px] !text-[#9A9595] !font-medium">{value || record.user_id || "—"}</Text>
        ),
      },
      {
        key: "amount",
        title: "Amount",
        dataIndex: "txn_amount",
        align: "right",
        render: ({ value }) => <Text className="!text-[14px] !font-medium">{formatINR(value)}</Text>,
      },
      {
        key: "commission",
        title: "Commission",
        dataIndex: "commission_amount", // always numeric
        align: "right",
        render: ({ value }) => (
          <Text className="!text-[14px] !text-[#0BA82F]">{formatINR(typeof value === "number" ? value : 0)}</Text>
        ),
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "txn_status",
        render: ({ value }) => {
          const v = String(value || "").toUpperCase();
          const cls =
            v === "SUCCESS"
              ? "bg-[#DFF5DD] text-[#0BA82F]"
              : v === "PENDING" || v === "PROCESSING"
              ? "bg-[#FFF2CC] text-[#F9A825]"
              : "bg-[#FFCCCC] text-[#FF4D4F]";
          const label = v === "SUCCESS" ? "Success" : v === "PENDING" ? "Processing" : v || "Failed";
          return <span className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${cls}`}>{label}</span>;
        },
      },
    ],
    []
  );

  return (
    <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
      {/* Header */}
      <div className="p-4">
        <Text className="!text-[20px] !font-medium block">Transaction History</Text>
        <Text className="!text-[12px] !font-light text-gray-500">Recent money transfer transactions</Text>
      </div>

      {/* Filters (wired to client-side filtering) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 pb-4">
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            placeholder="Transaction Id, user, mode…"
            className="!rounded-xl !bg-[#8C8C8C1C]"
            disabled={loading}
            allowClear
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Transaction Type</label>
          <Select
            value={fltType}
            onChange={setFltType}
            className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
            options={[{ label: "All Type", value: "all" }, ...typeOptions.map((v) => ({ label: v, value: v }))]}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Status</label>
          <Select
            value={fltStatus}
            onChange={setFltStatus}
            className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
            options={[{ label: "All Status", value: "all" }, ...statusOptions.map((v) => ({ label: v, value: v }))]}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Category</label>
          <Select
            value={fltCategory}
            onChange={setFltCategory}
            className="!rounded-xl !bg-[#8C8C8C1C] !w-full"
            options={[{ label: "All Category", value: "all" }, ...categoryOptions.map((v) => ({ label: v, value: v }))]}
            disabled={loading}
          />
        </div>
      </div>

      {/* Error */}
      {errorMsg ? (
        <div className="px-4 pb-3">
          <Alert type="error" message="Couldn’t load transactions." description={errorMsg} showIcon />
        </div>
      ) : null}

      {/* Loading skeleton */}
      {loading ? (
        <div className="px-4 pb-4">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <div className="px-4 pb-4">
          <SmartTable<UiTxn>
            columns={columns}
            data={filteredRows}         // ⬅️ pass filtered array
            striped
            card
            pagination={{               // ⬅️ client-side pagination
              page,
              pageSize,
              total,
              align: "right",
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: (nextPage, nextSize) => {
                setPage(nextPage);
                setPageSize(nextSize);
              },
            }}
            caption="Transactions table"
          />
        </div>
      )}
    </Card>
  );
}
