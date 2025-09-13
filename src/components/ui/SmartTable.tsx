/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Pagination, Tooltip } from "antd";

type Align = "left" | "center" | "right";

export type SmartTableColumn<T> = {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  width?: number;
  align?: Align;
  className?: string;
  render?: (opts: { value: any; record: T; rowIndex: number }) => React.ReactNode;
};

export type SmartTableColors = {
  headerBg?: string;
  headerText?: string;
  rowBg?: string;
  altRowBg?: string;
  rowText?: string;
  border?: string;
  hoverBg?: string;
};

export type SmartTablePagination = {
  mode?: "server" | "client";
  page?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[]; // [5, 10, 20, 50]
  simple?: boolean;
  showSizeChanger?: boolean;
  align?: "left" | "center" | "right";
};

export type SmartTableProps<T> = {
  columns: SmartTableColumn<T>[];
  data: T[];
  dense?: boolean;
  striped?: boolean;
  card?: boolean;
  colors?: SmartTableColors;
  className?: string;
  caption?: string;
  /** pass `false` to disable pagination */
  pagination?: SmartTablePagination | false;
};

/** Type guard to strip `false` out of the union */
function isPagination(
  val: SmartTableProps<any>["pagination"]
): val is SmartTablePagination {
  return !!val;
}

export default function SmartTable<T>({
  columns,
  data,
  dense = true,
  striped = false,
  card = true,
  colors,
  className,
  caption,
  pagination,
}: SmartTableProps<T>) {
  const {
    headerBg = "#f7f7f7",
    headerText = "#222",
    rowBg = "#ffffff",
    altRowBg = "#fafafa",
    rowText = "#222",
    border = "#eaeaea",
    hoverBg = "#f5faff",
  } = colors || {};

  // ---- safe pagination ref (SmartTablePagination | undefined)
  const p = isPagination(pagination) ? pagination : undefined;

  // ----- pagination plumbing -----
  const isPaged = !!p;
  const mode = p?.mode ?? "server";
  const psOpts = p?.pageSizeOptions ?? [5, 10, 20, 50];

  // client mode keeps its own page state if not provided
  const [clientPage, setClientPage] = useState<number>(p?.page ?? 1);
  const [clientPageSize, setClientPageSize] = useState<number>(p?.pageSize ?? 10);

  const page = mode === "server" ? (p?.page ?? 1) : clientPage;
  const pageSize = mode === "server" ? (p?.pageSize ?? 10) : clientPageSize;

  const total = mode === "server" ? Math.max(0, p?.total ?? 0) : data.length;

  const pagedData = useMemo(() => {
    if (!isPaged) return data;
    if (mode === "server") return data; // already sliced by caller
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, isPaged, mode, page, pageSize]);

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    if (mode === "client") {
      setClientPage(nextPage);
      setClientPageSize(nextPageSize);
    }
    p?.onChange?.(nextPage, nextPageSize);
  };

  // ----- render -----
  return (
    <div
      className={[
        "overflow-x-auto w-full",
        card ? "rounded-xl shadow-sm border" : "",
        className || "",
      ].join(" ")}
      style={{ borderColor: border, background: rowBg }}
    >
      <table className="w-full border-separate [border-spacing:0]">
        {caption ? <caption className="sr-only">{caption}</caption> : null}

        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  "text-xs font-semibold uppercase tracking-wide",
                  dense ? "py-3" : "py-4",
                  "px-4 text-left border-b",
                ].join(" ")}
                style={{
                  background: headerBg,
                  color: headerText,
                  borderColor: border,
                  textAlign: col.align || "left",
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pagedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-gray-500"
                style={{ color: rowText }}
              >
                No data
              </td>
            </tr>
          ) : (
            pagedData.map((row, rowIndex) => {
              const absoluteIndex = (page - 1) * pageSize + rowIndex;
              const bg = striped && absoluteIndex % 2 ? altRowBg : rowBg;
              return (
                <tr
                  key={absoluteIndex}
                  className="transition-colors"
                  style={{ background: bg }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      striped && absoluteIndex % 2 ? altRowBg : rowBg)
                  }
                >
                  {columns.map((col) => {
                    const value =
                      col.dataIndex != null
                        ? (get(row as any, col.dataIndex as string) as any)
                        : undefined;

                    return (
                      <td
                        key={col.key}
                        className={[
                          dense ? "py-3" : "py-4",
                          "px-4 text-sm align-top border-b",
                          col.className || "",
                        ].join(" ")}
                        style={{
                          borderColor: border,
                          color: rowText,
                          textAlign: col.align || "left",
                          width: col.width,
                        }}
                      >
                        {col.render
                          ? col.render({ value, record: row, rowIndex: absoluteIndex })
                          : safeText(value)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {isPaged && (
        <div
          className={[
            "w-full border-t px-3 py-2",
            p?.align === "left" ? "text-left" : p?.align === "center" ? "text-center" : "text-right",
          ].join(" ")}
          style={{ borderColor: border, background: rowBg }}
        >
          <Pagination
            size="small"
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger={p?.showSizeChanger ?? true}
            pageSizeOptions={(psOpts ?? [5, 10, 20, 50]).map(String)}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            simple={p?.simple}
          />
        </div>
      )}
    </div>
  );
}

/** nested path like "user.name" */
function get(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
function safeText(v: any) {
  if (v === null || v === undefined) return "—";
  return String(v);
}

export function IconCircleButton({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
}) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full"
      style={{ background: "#eaf3ff", color: "#2f6fe4" }}
    >
      {icon}
    </button>
  );
  return title ? <Tooltip title={title}>{btn}</Tooltip> : btn;
}
