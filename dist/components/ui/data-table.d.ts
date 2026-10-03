import * as React from "react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, RowSelectionState, OnChangeFn, Table as TanStackTable } from "@tanstack/react-table";
                          
export type { ColumnDef, SortingState, ColumnFiltersState, VisibilityState, RowSelectionState, };
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
export declare function DataTable<TData, TValue>({ columns, data, className, tableClassName, emptyMessage, showPagination, pageSize, pageSizeOptions, onRowClick, sorting: controlledSorting, onSortingChange: controlledOnSortingChange, columnFilters: controlledColumnFilters, onColumnFiltersChange: controlledOnColumnFiltersChange, columnVisibility: controlledColumnVisibility, onColumnVisibilityChange: controlledOnColumnVisibilityChange, rowSelection: controlledRowSelection, onRowSelectionChange: controlledOnRowSelectionChange, table: callerTable, }: DataTableProps<TData, TValue>): React.JSX.Element;
export interface DataTablePaginationProps<TData> {
    table: TanStackTable<TData>;
    className?: string;
    pageSizeOptions?: number[];
}
export declare function DataTablePagination<TData>({ table, className, pageSizeOptions, }: DataTablePaginationProps<TData>): React.JSX.Element;
export interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: any;
    title: string;
}
export declare function DataTableColumnHeader<TData, TValue>({ column, title, className, }: DataTableColumnHeaderProps<TData, TValue>): React.JSX.Element;
//# sourceMappingURL=data-table.d.ts.map