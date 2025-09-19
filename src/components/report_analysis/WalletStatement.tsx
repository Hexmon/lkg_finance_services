// "use client";

// import { Card, Table, Button, Typography } from "antd";
// import Image from "next/image";
// import React, { useEffect, useMemo, useState } from "react";
// import { useWalletStatement } from "@/features/wallet/data/hooks";

// const { Text } = Typography;

// /** ----- Filter types the parent can pass ----- */
// export type WalletStatementFilters = {
//     /** "CR" or "DR" */
//     subtype?: "CR" | "DR";
//     /** e.g. ["SUCCESS","FAILED"] */
//     statuses?: string[];
//     /** wallet names to include: e.g. ["MAIN","AEPS"] */
//     walletNames?: string[];
//     /** txn types to include: e.g. ["AEPS","DMT","COMMISSION"] */
//     txnTypes?: string[];
//     /** free-text search on remark + wallet + txn_type (case-insensitive) */
//     search?: string;
//     /** inclusive UTC start time */
//     from?: Date | null;
//     /** inclusive UTC end time */
//     to?: Date | null;
// };

// export type WalletStatementProps = {
//     /** optional defaults for server paging/sort */
//     perPage?: number;
//     order?: "asc" | "desc";
//     sortBy?: string;

//     /** parent-controlled pagination (optional) */
//     page?: number;
//     onPageChange?: (page: number, pageSize: number) => void;

//     /** parent-provided filters (client-side) */
//     filters?: WalletStatementFilters;
// };

// export default function WalletStatement({
//     perPage = 10,
//     order = "desc",
//     sortBy = "created_at",
//     page: controlledPage,
//     onPageChange,
//     filters,
// }: WalletStatementProps) {
//     // ---- pagination state (uncontrolled by default) ----
//     const [page, setPage] = useState<number>(controlledPage ?? 1);
//     const [pageSize, setPageSize] = useState<number>(perPage);

//     // keep internal page in sync if parent controls it
//     useEffect(() => {
//         if (typeof controlledPage === "number" && controlledPage > 0) {
//             setPage(controlledPage);
//         }
//     }, [controlledPage]);

//     // reset to page 1 whenever filters change (common UX)
//     useEffect(() => {
//         setPage(1);
//     }, [filters]);

//     // ---- fetch server page ----
//     const { data, isLoading } = useWalletStatement(
//         {
//             per_page: pageSize,
//             page,
//             order,
//             sort_by: sortBy,
//         },
//         true
//     );

//     // ---- map upstream -> row model (kept identical to your UI) ----
//     const rowsRaw = useMemo(() => {
//         const fmt = (iso: string) => {
//             const d = new Date(iso);
//             const dd = d.toLocaleString(undefined, {
//                 day: "2-digit",
//                 month: "short",
//                 year: "2-digit",
//             });
//             const time = d
//                 .toLocaleString(undefined, {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                 })
//                 .replace(" ", "");
//             return `${dd}, ${time}`;
//         };

//         return (data?.data ?? []).map((row) => ({
//             key: row.id,
//             datetime: fmt(row.created_at),
//             created_at: row.created_at, // keep raw for filtering
//             desc: row.remark || `${row.wallet_name} • ${row.txn_type}`,
//             type: row.subtype === "CR" ? "Credited" : "Debited",
//             subtype: row.subtype,
//             amountNum: Number(row.balance),
//             amount: `₹${Number(row.balance).toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//             })}`,
//             balanceNum: Number(row.current_balance),
//             balance: `₹${Number(row.current_balance).toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//             })}`,
//             status: row.txn_status === "SUCCESS" ? "Completed" : row.txn_status,
//             rawStatus: row.txn_status,
//             wallet_name: row.wallet_name,
//             txn_type: row.txn_type,
//             remark: row.remark ?? "",
//         }));
//     }, [data]);

//     // ---- apply client-side filters (in-memory on the fetched page) ----
//     const txData = useMemo(() => {
//         let arr = rowsRaw;

//         if (filters?.subtype) {
//             arr = arr.filter((r) => r.subtype === filters.subtype);
//         }
//         if (filters?.statuses && filters.statuses.length > 0) {
//             const set = new Set(filters.statuses.map((s) => s.toUpperCase()));
//             arr = arr.filter((r) => set.has(r.rawStatus.toUpperCase()) || set.has(r.status.toUpperCase()));
//         }
//         if (filters?.walletNames && filters.walletNames.length > 0) {
//             const set = new Set(filters.walletNames.map((w) => w.toUpperCase()));
//             arr = arr.filter((r) => set.has(r.wallet_name.toUpperCase()));
//         }
//         if (filters?.txnTypes && filters.txnTypes.length > 0) {
//             const set = new Set(filters.txnTypes.map((t) => t.toUpperCase()));
//             arr = arr.filter((r) => set.has(r.txn_type.toUpperCase()));
//         }
//         if (filters?.search && filters.search.trim().length > 0) {
//             const q = filters.search.trim().toLowerCase();
//             arr = arr.filter(
//                 (r) =>
//                     r.remark.toLowerCase().includes(q) ||
//                     r.wallet_name.toLowerCase().includes(q) ||
//                     r.txn_type.toLowerCase().includes(q)
//             );
//         }
//         if (filters?.from || filters?.to) {
//             const fromTs = filters.from ? filters.from.getTime() : Number.NEGATIVE_INFINITY;
//             const toTs = filters.to ? filters.to.getTime() : Number.POSITIVE_INFINITY;
//             arr = arr.filter((r) => {
//                 const ts = new Date(r.created_at).getTime();
//                 return ts >= fromTs && ts <= toTs;
//             });
//         }
//         return arr;
//     }, [rowsRaw, filters]);

//     // ---- columns (unchanged UI) ----
//     const columns = [
//         {
//             title: "Date & Time",
//             dataIndex: "datetime",
//             render: (text: string) => (
//                 <Text className="!text-[13px] !text-[#9A9595] !font-medium">{text}</Text>
//             ),
//         },
//         {
//             title: "Description",
//             dataIndex: "desc",
//             render: (text: string) => <Text className="!text-[13px] !font-medium">{text}</Text>,
//         },
//         {
//             title: "Type",
//             dataIndex: "type",
//             render: (t: string) => (
//                 <span
//                     className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${t === "Credited" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"
//                         }`}
//                 >
//                     {t}
//                 </span>
//             ),
//         },
//         {
//             title: "Amount",
//             dataIndex: "amount",
//             render: (amt: string) => <Text className="!text-[13px] !font-medium">{amt}</Text>,
//         },
//         {
//             title: "Balance",
//             dataIndex: "balance",
//             render: (bal: string) => <Text className="text-[13px] !font-medium">{bal}</Text>,
//         },
//         {
//             title: "Status",
//             dataIndex: "status",
//             render: (s: string) => (
//                 <span
//                     className={`px-2 py-[1px] rounded-[6px] text-[12px] font-medium ${s === "Completed" ? "bg-[#DFF5DD] text-[#0BA82F]" : "bg-[#FFCCCC] text-[#FF4D4F]"
//                         }`}
//                 >
//                     {s}
//                 </span>
//             ),
//         },
//         {
//             title: "Help",
//             render: () => <Image src="/info.svg" alt="help" width={18} height={18} />,
//         },
//     ];

//     // export uses the filtered list shown on screen
//     const handleExport = () => {
//         const headers = ["Date & Time", "Description", "Type", "Amount", "Balance", "Status"];
//         const rows = (txData ?? []).map((r) =>
//             [r.datetime, r.desc, r.type, r.amount, r.balance, r.status].join(",")
//         );
//         const csvContent = [headers.join(","), ...rows].join("\n");
//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", "Wallet_Transactions.csv");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  mb-6">
//             {/* Wallet Transactions */}
//             <div className="lg:col-span-2">
//                 <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
//                     <div className="flex justify-between items-start p-4 mb-0">
//                         <div>
//                             <Text className="!text-[20px] !font-medium block">Wallet Transactions</Text>
//                             <Text className="!text-[12px] !font-light text-gray-500">
//                                 Recent money transfer transactions
//                             </Text>
//                         </div>

//                         <Button
//                             className="bg-white shadow-xl px-4 rounded-lg flex items-center h-fit"
//                             onClick={handleExport}
//                         >
//                             <Image src="/download.svg" alt="export" width={15} height={15} />
//                             <Text className="inline ml-2">Export</Text>
//                         </Button>
//                     </div>

//                     <Table
//                         columns={columns}
//                         dataSource={txData}
//                         loading={isLoading}
//                         pagination={{
//                             current: page,
//                             pageSize,
//                             total: data?.total ?? 0, // API total (unfiltered)
//                             onChange: (p, ps) => {
//                                 setPage(p);
//                                 if (ps && ps !== pageSize) setPageSize(ps);
//                                 onPageChange?.(p, ps ?? pageSize);
//                             },
//                             showSizeChanger: true,
//                         }}
//                         bordered={false}
//                     />
//                 </Card>
//             </div>

//             {/* Wallet Summary (unchanged placeholder values) */}
//             <Card className="rounded-2xl shadow-md p-6">
//                 <div className="!mt-8">
//                     <Text className="!text-[16px] !font-medium ">Wallet Summary</Text>
//                 </div>
//                 <div className="mt-6 space-y-2 text-[14px]">
//                     <div className="flex justify-between !text-[12px] !font-medium">
//                         <Text>Opening Balance</Text>
//                         <Text>₹15,000</Text>
//                     </div>
//                     <div className="flex justify-between !text-[12px] !font-medium">
//                         <Text>Credits</Text>
//                         <Text className="!text-[#0BA82F]">+₹10,045</Text>
//                     </div>
//                     <div className="flex justify-between !text-[12px] !font-medium">
//                         <Text>Debits</Text>
//                         <Text className="!text-[#FF4D4F]">-₹2,819</Text>
//                     </div>
//                     <div className="flex justify-between !text-[12px] !font-medium">
//                         <Text strong>Closing Balance</Text>
//                         <Text strong>₹26,000</Text>
//                     </div>
//                 </div>
//                 <Button className="!bg-[#3386FF] !w-full !mt-18 !rounded-2xl !text-[12px] !font-medium !h-[40px] !text-white">
//                     Add Funds
//                 </Button>
//                 <Button className=" !border !border-[#3386FF] !w-full !mt-6 !rounded-2xl !text-[#3386FF] !text-[12px] !font-medium !h-[40px]">
//                     Download Statement
//                 </Button>
//             </Card>
//         </div>
//     );
// }

"use client";

import { Card, Table, Button, Typography } from "antd";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useWalletStatement } from "@/features/wallet/data/hooks";

const { Text } = Typography;

/** ----- Filter types the parent can pass ----- */
export type WalletStatementFilters = {
  /** "CR" or "DR" */
  subtype?: "CR" | "DR";
  /** e.g. ["SUCCESS","FAILED"] */
  statuses?: string[];
  /** wallet names to include: e.g. ["MAIN","AEPS"] */
  walletNames?: string[];
  /** txn types to include: e.g. ["AEPS","DMT","COMMISSION"] */
  txnTypes?: string[];
  /** free-text search on remark + wallet + txn_type (case-insensitive) */
  search?: string;
  /** inclusive UTC start time */
  from?: Date | null;
  /** inclusive UTC end time */
  to?: Date | null;
};

export type WalletStatementProps = {
  /** optional defaults for server paging/sort */
  perPage?: number;
  order?: "asc" | "desc";
  sortBy?: string;

  /** parent-controlled pagination (optional) */
  page?: number;
  onPageChange?: (page: number, pageSize: number) => void;

  /** parent-provided filters (client-side) */
  filters?: WalletStatementFilters;
};

export default function WalletStatement({
  perPage = 10,
  order = "desc",
  sortBy = "created_at",
  page: controlledPage,
  onPageChange,
  filters,
}: WalletStatementProps) {
  // ---- pagination state (uncontrolled by default) ----
  const [page, setPage] = useState<number>(controlledPage ?? 1);
  const [pageSize, setPageSize] = useState<number>(perPage);

  // keep internal page in sync if parent controls it
  useEffect(() => {
    if (typeof controlledPage === "number" && controlledPage > 0) {
      setPage(controlledPage);
    }
  }, [controlledPage]);

  // reset to page 1 whenever filters change (common UX)
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // ---- fetch server page (unfiltered page from backend) ----
  const { data, isLoading } = useWalletStatement(
    {
      per_page: pageSize,
      page,
      order,
      sort_by: sortBy,
    },
    true
  );

  // ---- map upstream -> row model (kept identical to your UI) ----
  const rowsRaw = useMemo(() => {
    const fmt = (iso: string) => {
      const d = new Date(iso);
      const dd = d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const time = d
        .toLocaleString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "");
      return `${dd}, ${time}`;
    };

    return (data?.data ?? []).map((row) => ({
      key: row.id,
      datetime: fmt(row.created_at),
      created_at: row.created_at, // keep raw for filtering
      desc: row.remark || `${row.wallet_name} • ${row.txn_type}`,
      type: row.subtype === "CR" ? "Credited" : "Debited",
      subtype: row.subtype,
      amountNum: Number(row.balance),
      amount: `₹${Number(row.balance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      balanceNum: Number(row.current_balance),
      balance: `₹${Number(row.current_balance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      status: row.txn_status === "SUCCESS" ? "Completed" : row.txn_status,
      rawStatus: row.txn_status,
      wallet_name: row.wallet_name,
      txn_type: row.txn_type,
      remark: row.remark ?? "",
    }));
  }, [data]);

  // ---- apply client-side filters (in-memory on the fetched page) ----
  const txData = useMemo(() => {
    let arr = rowsRaw;

    if (filters?.subtype) {
      arr = arr.filter((r) => r.subtype === filters.subtype);
    }
    if (filters?.statuses && filters.statuses.length > 0) {
      const set = new Set(filters.statuses.map((s) => s.toUpperCase()));
      arr = arr.filter(
        (r) => set.has(r.rawStatus.toUpperCase()) || set.has(r.status.toUpperCase())
      );
    }
    if (filters?.walletNames && filters.walletNames.length > 0) {
      const set = new Set(filters.walletNames.map((w) => w.toUpperCase()));
      arr = arr.filter((r) => set.has(r.wallet_name.toUpperCase()));
    }
    if (filters?.txnTypes && filters.txnTypes.length > 0) {
      const set = new Set(filters.txnTypes.map((t) => t.toUpperCase()));
      arr = arr.filter((r) => set.has(r.txn_type.toUpperCase()));
    }
    if (filters?.search && filters.search.trim().length > 0) {
      const q = filters.search.trim().toLowerCase();
      arr = arr.filter(
        (r) =>
          r.remark.toLowerCase().includes(q) ||
          r.wallet_name.toLowerCase().includes(q) ||
          r.txn_type.toLowerCase().includes(q)
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

  // ---- slice FOR PAGINATION **AFTER** FILTERING ----
  const pagedTxData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return txData.slice(start, start + pageSize);
  }, [txData, page, pageSize]);

  // ---- columns (unchanged UI) ----
  const columns = [
    {
      title: "Date & Time",
      dataIndex: "datetime",
      render: (text: string) => (
        <Text className="!text-[13px] !text-[#9A9595] !font-medium">{text}</Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "desc",
      render: (text: string) => <Text className="!text-[13px] !font-medium">{text}</Text>,
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
      render: (amt: string) => <Text className="!text-[13px] !font-medium">{amt}</Text>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (bal: string) => <Text className="text-[13px] !font-medium">{bal}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
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
    {
      title: "Help",
      render: () => <Image src="/info.svg" alt="help" width={18} height={18} />,
    },
  ];

  // export uses the filtered list shown on screen
  const handleExport = () => {
    const headers = ["Date & Time", "Description", "Type", "Amount", "Balance", "Status"];
    const rows = (txData ?? []).map((r) =>
      [r.datetime, r.desc, r.type, r.amount, r.balance, r.status].join(",")
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  mb-6">
      {/* Wallet Transactions */}
      <div className="lg:col-span-2">
        <Card className="rounded-2xl shadow-md bg-[#FEFAF6]">
          <div className="flex justify-between items-start p-4 mb-0">
            <div>
              <Text className="!text-[20px] !font-medium block">Wallet Transactions</Text>
              <Text className="!text-[12px] !font-light text-gray-500">
                Recent money transfer transactions
              </Text>
            </div>

            <Button className="bg-white shadow-xl px-4 rounded-lg flex items-center h-fit" onClick={handleExport}>
              <Image src="/download.svg" alt="export" width={15} height={15} />
              <Text className="inline ml-2">Export</Text>
            </Button>
          </div>

          <Table
            columns={columns}
            /** 🔸 use filtered+paginated rows */
            dataSource={pagedTxData}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize,
              /** 🔸 total reflects filtered count */
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

      {/* Wallet Summary (unchanged placeholder values) */}
      <Card className="rounded-2xl shadow-md p-6">
        <div className="!mt-8">
          <Text className="!text-[16px] !font-medium ">Wallet Summary</Text>
        </div>
        <div className="mt-6 space-y-2 text-[14px]">
          <div className="flex justify-between !text-[12px] !font-medium">
            <Text>Opening Balance</Text>
            <Text>₹15,000</Text>
          </div>
          <div className="flex justify-between !text-[12px] !font-medium">
            <Text>Credits</Text>
            <Text className="!text-[#0BA82F]">+₹10,045</Text>
          </div>
          <div className="flex justify-between !text-[12px] !font-medium">
            <Text>Debits</Text>
            <Text className="!text-[#FF4D4F]">-₹2,819</Text>
          </div>
          <div className="flex justify-between !text-[12px] !font-medium">
            <Text strong>Closing Balance</Text>
            <Text strong>₹26,000</Text>
          </div>
        </div>
        <Button className="!bg-[#3386FF] !w-full !mt-18 !rounded-2xl !text-[12px] !font-medium !h-[40px] !text-white">
          Add Funds
        </Button>
        <Button className=" !border !border-[#3386FF] !w-full !mt-6 !rounded-2xl !text-[#3386FF] !text-[12px] !font-medium !h-[40px]">
          Download Statement
        </Button>
      </Card>
    </div>
  );
}
