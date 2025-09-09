import { ReactNode, CSSProperties } from "react";

export type Align = "left" | "center" | "right";
export type ThemeVariant = "auto" | "light" | "dark";

export type Accessor<T> =
  | keyof T
  | ((row: T, rowIndex: number) => ReactNode);

export type CellRenderer<T> = (opts: {
  value: unknown;
  row: T;
  rowIndex: number;
  colIndex: number;
}) => ReactNode;

export type ColumnDef<T> = {
  key: string;
  header: ReactNode;
  accessor?: Accessor<T>;
  cell?: CellRenderer<T>;
  width?: string;
  align?: Align;
  className?: string;
  headerClassName?: string;
  sticky?: "left" | "right";
  sortable?: boolean;
  footer?: ReactNode | ((rows: T[]) => ReactNode);
};

export type FooterCell<T> =
  | ReactNode
  | ((rows: T[]) => ReactNode);

export type DataGridProps<T> = {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;

  /** Visual */
  bordered?: boolean;
  rounded?: boolean;
  dense?: boolean;

  /** Row & column zebra */
  zebraRows?: boolean;                // alternate row background
  zebraCols?: boolean;                // alternate column background
  zebraColsColors?: [string, string]; // EXACT colors for odd/even columns (default ["#FFFFFF","#F5F5F5"])
  headerZebraCols?: boolean;          // apply zebra to header too (default true)

  stickyHeader?: boolean;
  maxHeight?: number;

  /** Theme control */
  variant?: ThemeVariant; // "auto" respects system; "light"/"dark" force theme

  /** Per-row customization (NEW) */
  rowBackground?: (row: T, index: number) => string | undefined;       // e.g. "#FFF8E1"
  rowStyle?: (row: T, index: number) => CSSProperties | undefined;      // any CSS overrides (borders, text color, etc.)
  rowHoverClassName?: (row: T, index: number) => string | undefined;    // per-row hover utility/classes
  rowColorOverridesCols?: boolean;                                      // if true (default), row color beats column zebra

  /** Styling hooks */
  rowClassName?: (row: T, index: number) => string | undefined;
  cellClassName?: (row: T, rowIndex: number, colIndex: number) => string | undefined;

  /** Interactions */
  onRowClick?: (row: T, index: number) => void;

  /** States */
  loading?: boolean;
  emptyText?: ReactNode;

  /** Optional single summary/footer row */
  footer?: FooterCell<T>[];
};
