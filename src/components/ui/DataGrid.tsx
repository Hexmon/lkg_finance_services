/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import type { DataGridProps, ColumnDef } from "./DataGrid.types";

/**
 * DataGrid: typed, tailwind-only table with exact column zebra colors
 * and full-row color/styling overrides.
 */
export default function DataGrid<T>({
  columns,
  rows,
  rowKey,
  bordered = true,
  rounded = true,
  dense = false,

  zebraRows = true,
  zebraCols = false,
  zebraColsColors = ["#FFFFFF", "#F5F5F5"],
  headerZebraCols = true,

  stickyHeader = true,
  maxHeight,

  rowClassName,
  cellClassName,
  onRowClick,

  // NEW row options
  rowBackground,
  rowStyle,
  rowHoverClassName,
  rowColorOverridesCols = true,

  loading = false,
  emptyText = "No data",
  footer,

  variant = "auto",
}: DataGridProps<T>) {
  const [sort, setSort] = React.useState<{ key?: string; dir: "asc" | "desc" }>(
    { key: undefined, dir: "asc" }
  );

  const isLight = variant === "light";
  const isDark = variant === "dark";
  const colCount = columns.length;

  /** sorting */
  const sortedRows = React.useMemo(() => {
    if (!sort.key) return rows;
    const col = columns.find(c => c.key === sort.key);
    if (!col) return rows;

    const getVal = (row: T, idx: number) => {
      if (col.cell) return col.cell({ value: undefined, row, rowIndex: idx, colIndex: 0 }) as any;
      if (typeof col.accessor === "function") return col.accessor(row, idx) as any;
      if (typeof col.accessor === "string") return (row as any)[col.accessor];
      return undefined;
    };

    const arr = [...rows];
    arr.sort((a, b) => {
      const av = getVal(a, 0);
      const bv = getVal(b, 0);
      const ax = av instanceof Date ? av.getTime() : av;
      const bx = bv instanceof Date ? bv.getTime() : bv;
      if (ax == null && bx == null) return 0;
      if (ax == null) return -1;
      if (bx == null) return 1;
      if (ax < bx) return sort.dir === "asc" ? -1 : 1;
      if (ax > bx) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sort, columns]);

  /** classes */
  const thBase =
    "px-3 select-none whitespace-nowrap font-medium text-[13px] leading-5 " +
    (dense ? "py-2" : "py-3") +
    " transition-colors duration-200";

  const tdBase =
    "px-3 text-[13px] leading-6 " +
    (dense ? "py-2" : "py-3") +
    " transition-[background-color,color] duration-200";

  const tableShell =
    (bordered ? "ring-1 ring-neutral-200 " : "") +
    (rounded ? "rounded-2xl overflow-hidden " : "");

  /** exact column background resolver */
  const colBg = (colIndex: number): string | undefined => {
    if (!zebraCols) return undefined;
    const isEven = colIndex % 2 === 0;
    return isEven ? zebraColsColors[0] : zebraColsColors[1];
  };

  /** header/body base backgrounds (used when zebraCols=false) */
  const headerRowBgNoZebra =
    isLight ? "bg-[#EFEFEF]" :
    isDark  ? "bg-neutral-900/60" :
              "bg-[#EFEFEF] dark:bg-neutral-900/60";

  const bodyBgNoZebra =
    isLight ? "bg-white" :
    isDark  ? "bg-neutral-950" :
              "bg-white dark:bg-neutral-950";

  const headerSticky = stickyHeader ? "sticky top-0 z-10" : "";

  /** Hover base (still allows per-row override via rowHoverClassName) */
  const baseHover =
    isLight ? "hover:bg-neutral-50/60" :
    isDark  ? "hover:bg-neutral-900/40" :
              "hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40";

  /** Row zebra only when column zebra is OFF */
  const useRowZebra = zebraRows && !zebraCols;
  const zebraRowBg = (idx: number) =>
    useRowZebra && idx % 2 === 1
      ? (isLight ? "bg-neutral-50" : isDark ? "bg-neutral-900/30" : "bg-neutral-50 dark:bg-neutral-900/30")
      : "";

  /** animations */
  const rowAppear =
    "animate-[fadeIn_250ms_ease-out] [@keyframes_fadeIn]{from{opacity:.0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}";

  const handleSort = (c: ColumnDef<T>) => {
    if (!c.sortable) return;
    setSort(prev => {
      if (prev.key !== c.key) return { key: c.key, dir: "asc" };
      return { key: c.key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  return (
    <div
      className={[
        tableShell,
        isLight ? "[color-scheme:light]" : "",
        isDark ? "[color-scheme:dark]" : "",
      ].join(" ").trim()}
    >
      <div className="relative" style={maxHeight ? { maxHeight, overflow: "auto" } : undefined}>
        <table className="w-full border-collapse">
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={c.width ? { width: c.width } : undefined} />
            ))}
          </colgroup>

          {/* Header */}
          <thead>
            <tr className={!headerZebraCols ? headerRowBgNoZebra : ""}>
              {columns.map((c, i) => {
                const align =
                  c.align === "right" ? "text-right" :
                  c.align === "center" ? "text-center" : "text-left";

                const stickyCol =
                  c.sticky === "left" ? "sticky left-0 z-20" :
                  c.sticky === "right" ? "sticky right-0 z-20" : "";

                const sortState = c.sortable && sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : "";
                const headerStyle: React.CSSProperties = {};

                // Apply exact column color to header if enabled
                if (zebraCols && headerZebraCols) {
                  headerStyle.backgroundColor = colBg(i);
                }

                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={[
                      thBase,
                      align,
                      headerSticky,
                      stickyCol,
                      c.headerClassName ?? "",
                      "text-neutral-600",
                    ].join(" ")}
                    style={headerStyle}
                    onClick={() => handleSort(c)}
                    title={c.sortable ? "Sort" : undefined}
                  >
                    <div className="inline-flex items-center gap-1 cursor-default">
                      <span>{c.header}</span>
                      {c.sortable && (
                        <span className="text-[10px] opacity-60 translate-y-[1px]">
                          {sortState || "⇅"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className={!zebraCols ? bodyBgNoZebra : ""}>
            {loading ? (
              Array.from({ length: Math.max(3, Math.min(6, rows.length || 5)) }).map((_, r) => (
                <tr key={`s-${r}`} className="animate-pulse">
                  {columns.map((c, i) => (
                    <td key={`s-${r}-${c.key}`} className={tdBase} style={{ backgroundColor: colBg(i) }}>
                      <div className="h-3 rounded bg-neutral-200/70 dark:bg-neutral-800/70 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedRows.length === 0 ? (
              <tr>
                <td className={tdBase + " text-center text-neutral-500"} colSpan={colCount}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rIdx) => {
                const rk = rowKey(row, rIdx);
                const rc = rowClassName?.(row, rIdx) ?? "";
                const bgColor = rowBackground?.(row, rIdx);          // NEW
                const trStyle = rowStyle?.(row, rIdx) ?? {};          // NEW
                if (bgColor) (trStyle as any).backgroundColor = bgColor;

                // If row has its own color and it's meant to override columns,
                // don't apply column zebra for this row.
                const useColBgThisRow = zebraCols && !(bgColor && rowColorOverridesCols);

                const customHover = rowHoverClassName?.(row, rIdx) ?? "";
                const hoverClass = customHover || baseHover;

                return (
                  <tr
                    key={rk}
                    className={[
                      rowAppear,
                      hoverClass,
                      zebraRowBg(rIdx),
                      rc,
                      onRowClick ? "cursor-pointer" : "",
                    ].join(" ")}
                    style={trStyle}
                    onClick={() => onRowClick?.(row, rIdx)}
                  >
                    {columns.map((c, cIdx) => {
                      const align =
                        c.align === "right" ? "text-right" :
                        c.align === "center" ? "text-center" : "text-left";

                      const stickyCol =
                        c.sticky === "left"
                          ? "sticky left-0 z-10"
                          : c.sticky === "right"
                          ? "sticky right-0 z-10"
                          : "";

                      const val =
                        c.cell
                          ? c.cell({ value: undefined, row, rowIndex: rIdx, colIndex: cIdx })
                          : typeof c.accessor === "function"
                            ? c.accessor(row, rIdx)
                            : typeof c.accessor === "string"
                              ? (row as any)[c.accessor]
                              : null;

                      const cc = cellClassName?.(row, rIdx, cIdx) ?? "";
                      const style: React.CSSProperties = {};

                      if (useColBgThisRow) {
                        const bg = colBg(cIdx);
                        if (bg) style.backgroundColor = bg;
                      } else if (bgColor) {
                        // keep cells matching the row background exactly
                        style.backgroundColor = bgColor;
                      }

                      return (
                        <td
                          key={`${rk}-${c.key}`}
                          className={[tdBase, align, stickyCol, cc].join(" ")}
                          style={style}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer */}
          {footer && footer.length > 0 && !loading && (
            <tfoot>
              <tr className={!headerZebraCols ? headerRowBgNoZebra : ""}>
                {columns.map((c, i) => {
                  const f = footer[i];
                  const content =
                    typeof f === "function" ? f(sortedRows) :
                    typeof f !== "undefined" ? f :
                    (c.footer
                      ? typeof c.footer === "function"
                        ? (c.footer as any)(sortedRows)
                        : c.footer
                      : null);

                  const style: React.CSSProperties = {};
                  if (zebraCols && headerZebraCols) {
                    const bg = colBg(i);
                    if (bg) style.backgroundColor = bg;
                  }

                  return (
                    <td
                      key={`f-${c.key}`}
                      className={[tdBase, "font-semibold", i === 0 ? "text-left" : "text-right"].join(" ")}
                      style={style}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
