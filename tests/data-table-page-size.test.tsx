import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { type ColumnDef, type PaginationState, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { DataTable, DataTablePagination } from '../src/components/ui/data-table.js';

const records = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, name: `Demo work ${index + 1}` }));
const columns: ColumnDef<(typeof records)[number]>[] = [{ accessorKey: 'name', header: 'Work' }];
const bodyRowCount = () => screen.getByRole('table').querySelectorAll('tbody tr').length;

function ControlledTable({ explicitOptions }: { explicitOptions?: number[] }) {
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 3 });
  const table = useReactTable({
    data: records,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return <>
    <button onClick={() => setPagination({ pageIndex: 0, pageSize: 6 })}>Set caller page size to six</button>
    <DataTable columns={columns} data={records} table={table} showPagination={!explicitOptions} />
    {explicitOptions && <DataTablePagination table={table} pageSizeOptions={explicitOptions} />}
  </>;
}

describe('DataTable page size matches the rendered rows', () => {
  it('includes an arbitrary initial page size and keeps native changes functional', () => {
    render(<DataTable columns={columns} data={records} pageSize={3} showPagination />);
    const size = screen.getByRole('combobox') as HTMLSelectElement;
    expect(size.value).toBe('3');
    expect(within(size).getByRole('option', { name: '3' }).textContent).toBe('3');
    expect(bodyRowCount()).toBe(3);
    expect(screen.getByText(/Page\s+1\s+of\s+2/)).toBeTruthy();

    fireEvent.change(size, { target: { value: '10' } });
    expect(size.value).toBe('10');
    expect(bodyRowCount()).toBe(6);
    expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeTruthy();
  });

  it('reflects a caller-controlled table page size changed after mount', () => {
    render(<ControlledTable />);
    const size = screen.getByRole('combobox') as HTMLSelectElement;
    expect(size.value).toBe('3');
    expect(bodyRowCount()).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: 'Set caller page size to six' }));
    expect(size.value).toBe('6');
    expect(within(size).getByRole('option', { name: '6' }).textContent).toBe('6');
    expect(bodyRowCount()).toBe(6);
    expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeTruthy();
  });

  it('does not duplicate a current size already in caller-provided options', () => {
    render(<ControlledTable explicitOptions={[3, 6, 12]} />);
    const size = screen.getByRole('combobox') as HTMLSelectElement;
    expect(size.value).toBe('3');
    expect(within(size).getAllByRole('option', { name: '3' })).toHaveLength(1);
    expect(Array.from(size.options, option => option.value)).toEqual(['3', '6', '12']);
  });
});
