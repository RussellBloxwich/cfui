import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./table.js";
import { cn } from "../../utils.js";
                          
export function DataTable({ columns, data, className, tableClassName, emptyMessage = "No results.", showPagination = false, pageSize = 10, pageSizeOptions, onRowClick, sorting: controlledSorting, onSortingChange: controlledOnSortingChange, columnFilters: controlledColumnFilters, onColumnFiltersChange: controlledOnColumnFiltersChange, columnVisibility: controlledColumnVisibility, onColumnVisibilityChange: controlledOnColumnVisibilityChange, rowSelection: controlledRowSelection, onRowSelectionChange: controlledOnRowSelectionChange, table: callerTable, }) {
    const [internalSorting, setInternalSorting] = React.useState([]);
    const [internalColumnFilters, setInternalColumnFilters] = React.useState([]);
    const [internalColumnVisibility, setInternalColumnVisibility] = React.useState({});
    const [internalRowSelection, setInternalRowSelection] = React.useState({});
    const sorting = controlledSorting ?? internalSorting;
    const onSortingChange = controlledOnSortingChange ?? setInternalSorting;
    const columnFilters = controlledColumnFilters ?? internalColumnFilters;
    const onColumnFiltersChange = controlledOnColumnFiltersChange ?? setInternalColumnFilters;
    const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility;
    const onColumnVisibilityChange = controlledOnColumnVisibilityChange ?? setInternalColumnVisibility;
    const rowSelection = controlledRowSelection ?? internalRowSelection;
    const onRowSelectionChange = controlledOnRowSelectionChange ?? setInternalRowSelection;
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
    return (_jsxs("div", { className: cn("cfui-data-table", className), children: [_jsx("div", { className: "cfui-data-table-wrapper", children: _jsxs(Table, { className: tableClassName, children: [_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { children: headerGroup.headers.map((header) => (_jsx(TableHead, { colSpan: header.colSpan, children: header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx(TableBody, { children: table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { "data-state": row.getIsSelected() && "selected", className: cn(onRowClick && "cfui-data-table-row-clickable"), onClick: () => onRowClick?.(row.original), children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "cfui-data-table-empty", children: emptyMessage }) })) })] }) }), showPagination && (_jsx(DataTablePagination, { table: table, pageSizeOptions: pageSizeOptions }))] }));
}
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
export function DataTablePagination({ table, className, pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS, }) {
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    const totalCount = table.getFilteredRowModel().rows.length;
    const currentPageSize = table.getState().pagination?.pageSize;
    const resolvedPageSizeOptions = React.useMemo(() => {
        const uniqueOptions = Array.from(new Set(pageSizeOptions));
        if (typeof currentPageSize === "number" &&
            currentPageSize > 0 &&
            !uniqueOptions.includes(currentPageSize)) {
            return [...uniqueOptions, currentPageSize].sort((a, b) => a - b);
        }
        return uniqueOptions;
    }, [pageSizeOptions, currentPageSize]);
    return (_jsxs("div", { className: cn("cfui-data-table-pagination", className), children: [_jsx("div", { className: "cfui-data-table-pagination-status", children: selectedCount > 0
                    ? `${selectedCount} of ${totalCount} row(s) selected.`
                    : `Total ${totalCount} row(s).` }), _jsxs("div", { className: "cfui-data-table-pagination-controls", children: [_jsxs("div", { className: "cfui-data-table-page-size", children: [_jsx("span", { className: "cfui-data-table-page-size-label", children: "Rows per page" }), _jsx("select", { value: currentPageSize, onChange: (e) => {
                                    table.setPageSize(Number(e.target.value));
                                }, className: "cfui-data-table-select", "aria-label": "Rows per page", children: resolvedPageSizeOptions.map((size) => (_jsx("option", { value: size, children: size }, size))) })] }), _jsxs("div", { className: "cfui-data-table-page-info", children: ["Page ", table.getState().pagination.pageIndex + 1, " of", " ", Math.max(1, table.getPageCount())] }), _jsxs("div", { className: "cfui-data-table-page-buttons", children: [_jsx("button", { type: "button", className: "cfui-data-table-page-button", onClick: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage(), "aria-label": "Go to first page", children: "«" }), _jsx("button", { type: "button", className: "cfui-data-table-page-button", onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), "aria-label": "Go to previous page", children: "‹" }), _jsx("button", { type: "button", className: "cfui-data-table-page-button", onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), "aria-label": "Go to next page", children: "›" }), _jsx("button", { type: "button", className: "cfui-data-table-page-button", onClick: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage(), "aria-label": "Go to last page", children: "»" })] })] })] }));
}
export function DataTableColumnHeader({ column, title, className, }) {
    if (!column.getCanSort()) {
        return (_jsx("div", { className: cn("cfui-data-table-column-header-title", className), children: title }));
    }
    const isSorted = column.getIsSorted();
    return (_jsxs("div", { className: cn("cfui-data-table-column-header", className), onClick: () => column.toggleSorting(column.getIsSorted() === "asc"), role: "button", tabIndex: 0, onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                column.toggleSorting(column.getIsSorted() === "asc");
            }
        }, "aria-sort": isSorted === "asc"
            ? "ascending"
            : isSorted === "desc"
                ? "descending"
                : "none", children: [_jsx("span", { className: "cfui-data-table-column-header-title", children: title }), _jsx("span", { className: "cfui-data-table-column-header-icon", "aria-hidden": "true", children: isSorted === "desc" ? "▼" : isSorted === "asc" ? "▲" : "⇅" })] }));
}
//# sourceMappingURL=data-table.js.map