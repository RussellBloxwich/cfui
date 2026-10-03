import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  RowSelectionState,
  OnChangeFn,
  Table as TanStackTable,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";
import { cn } from "../../utils.js";
import "./data-table.css";

export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  tableClassName?: string;
  emptyMessage?: React.ReactNode;
  showPagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  table?: TanStackTable<TData>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  tableClassName,
  emptyMessage = "No results.",
  showPagination = false,
  pageSize = 10,
  pageSizeOptions,
  onRowClick,
  sorting: controlledSorting,
  onSortingChange: controlledOnSortingChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange: controlledOnColumnFiltersChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange: controlledOnColumnVisibilityChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
  table: callerTable,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>({});
  const [internalRowSelection, setInternalRowSelection] =
    React.useState<RowSelectionState>({});

  const sorting = controlledSorting ?? internalSorting;
  const onSortingChange = controlledOnSortingChange ?? setInternalSorting;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const onColumnFiltersChange =
    controlledOnColumnFiltersChange ?? setInternalColumnFilters;
  const columnVisibility =
    controlledColumnVisibility ?? internalColumnVisibility;
  const onColumnVisibilityChange =
    controlledOnColumnVisibilityChange ?? setInternalColumnVisibility;
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const onRowSelectionChange =
    controlledOnRowSelectionChange ?? setInternalRowSelection;

  const defaultTable = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const prevPageSizeRef = React.useRef(pageSize);
  React.useEffect(() => {
    if (prevPageSizeRef.current !== pageSize) {
      prevPageSizeRef.current = pageSize;
      if (!callerTable) {
        defaultTable.setPageSize(pageSize);
      }
    }
  }, [callerTable, defaultTable, pageSize]);

  const table = callerTable ?? defaultTable;

  return (
    <div className={cn("cfui-data-table", className)}>
      <div className="cfui-data-table-wrapper">
        <Table className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick && "cfui-data-table-row-clickable"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="cfui-data-table-empty"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}

const DEFAULT_PAGE_SIZE_OPTIONS: number[] = [10, 20, 30, 40, 50];

export interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  className?: string;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  className,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;
  const currentPageSize = table.getState().pagination?.pageSize;

  const resolvedPageSizeOptions = React.useMemo(() => {
    const uniqueOptions = Array.from(new Set(pageSizeOptions));
    if (
      typeof currentPageSize === "number" &&
      currentPageSize > 0 &&
      !uniqueOptions.includes(currentPageSize)
    ) {
      return [...uniqueOptions, currentPageSize].sort((a, b) => a - b);
    }
    return uniqueOptions;
  }, [pageSizeOptions, currentPageSize]);

  return (
    <div
      className={cn(
        "cfui-data-table-pagination",
        className
      )}
    >
      <div className="cfui-data-table-pagination-status">
        {selectedCount > 0
          ? `${selectedCount} of ${totalCount} row(s) selected.`
          : `Total ${totalCount} row(s).`}
      </div>
      <div className="cfui-data-table-pagination-controls">
        <div className="cfui-data-table-page-size">
          <span className="cfui-data-table-page-size-label">
            Rows per page
          </span>
          <select
            value={currentPageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="cfui-data-table-select"
            aria-label="Rows per page"
          >
            {resolvedPageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="cfui-data-table-page-info">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </div>
        <div className="cfui-data-table-page-buttons">
          <button
            type="button"
            className="cfui-data-table-page-button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            {"«"}
          </button>
          <button
            type="button"
            className="cfui-data-table-page-button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            {"‹"}
          </button>
          <button
            type="button"
            className="cfui-data-table-page-button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            {"›"}
          </button>
          <button
            type="button"
            className="cfui-data-table-page-button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            {"»"}
          </button>
        </div>
      </div>
    </div>
  );
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: any;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn("cfui-data-table-column-header-title", className)}>
        {title}
      </div>
    );
  }

  const isSorted = column.getIsSorted();

  return (
    <div
      className={cn("cfui-data-table-column-header", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          column.toggleSorting(column.getIsSorted() === "asc");
        }
      }}
      aria-sort={
        isSorted === "asc"
          ? "ascending"
          : isSorted === "desc"
          ? "descending"
          : "none"
      }
    >
      <span className="cfui-data-table-column-header-title">{title}</span>
      <span className="cfui-data-table-column-header-icon" aria-hidden="true">
        {isSorted === "desc" ? "▼" : isSorted === "asc" ? "▲" : "⇅"}
      </span>
    </div>
  );
}
