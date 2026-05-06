import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpDown, CalendarRange, Check, ChevronDown, ChevronUp, Download, FileSpreadsheet, FileText, RotateCcw, Trash2, Upload } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { DateInput } from '@/shared/forms/date-input';
import { Input, Select } from '@/shared/forms/controls';
import { Checkbox } from '@/shared/forms/checkbox';
import { Pagination } from '@/shared/tables/pagination';
import { EmptyState } from '@/shared/ui/empty-state';
import { IconButton } from '@/shared/ui/icon-button';

const pageSizeOptions = [10, 20, 30, 50, 100, 200, 500];

interface DataTableProps<T> {
  data: T[];
  columns: Array<ColumnDef<T>>;
  search: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
  mobileCard?: (item: T, index: number) => ReactNode;
  onBulkDelete?: (items: T[]) => void;
  primaryAction?: ReactNode;
}

export function DataTable<T>({ data, columns, search, onSearchChange, filters, mobileCard, onBulkDelete, primaryAction }: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>(() => {
    const defaultSortId = getDefaultSortId(columns);
    return defaultSortId ? [{ id: defaultSortId, desc: true }] : [];
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [draftDateRange, setDraftDateRange] = useState(() => getCurrentWeekRange());
  const [appliedDateRange, setAppliedDateRange] = useState(() => getCurrentWeekRange());

  const selectionColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: 'select',
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          ref={undefined}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Pilih semua baris"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          ref={undefined}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Pilih baris"
        />
      ),
    }),
    [],
  );

  const filteredData = useMemo(
    () => data.filter((item) => isWithinDateRange(item, appliedDateRange.start, appliedDateRange.end)),
    [data, appliedDateRange.end, appliedDateRange.start],
  );

  const tableColumns = useMemo(() => [selectionColumn, ...columns], [columns, selectionColumn]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      globalFilter: search,
      rowSelection,
      pagination,
      sorting,
    },
    onGlobalFilterChange: onSearchChange,
    getRowId: (_, index) => String(index),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
            <span>Total {table.getRowModel().rows.length} data</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              className="h-6 w-[64px] rounded-md px-2 py-0.5 text-[11px]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari data..."
            className="h-8 min-w-0 rounded-lg px-2.5 py-1 text-[11px] md:max-w-[220px]"
          />
        </div>

        <div className="grid gap-2 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-white px-2 py-1">
              <CalendarRange className="h-3 w-3 text-[var(--color-muted)]" />
              <DateInput
                value={draftDateRange.start}
                onChange={(event) => setDraftDateRange((state) => ({ ...state, start: event.target.value }))}
                className="h-auto min-w-[98px] border-0 px-0 py-0 text-[11px] shadow-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-white px-2 py-1">
              <CalendarRange className="h-3 w-3 text-[var(--color-muted)]" />
              <DateInput
                value={draftDateRange.end}
                onChange={(event) => setDraftDateRange((state) => ({ ...state, end: event.target.value }))}
                className="h-auto min-w-[98px] border-0 px-0 py-0 text-[11px] shadow-none focus:ring-0"
              />
            </div>
            <IconButton
              type="button"
              title="Terapkan filter"
              className="h-6 w-6 rounded-md"
              onClick={() => setAppliedDateRange(draftDateRange)}
            >
              <Check className="h-3 w-3" />
            </IconButton>
            <IconButton
              type="button"
              title="Reset filter"
              className="h-6 w-6 rounded-md"
              onClick={() => {
                const nextRange = getCurrentWeekRange();
                setDraftDateRange(nextRange);
                setAppliedDateRange(nextRange);
              }}
            >
              <RotateCcw className="h-3 w-3" />
            </IconButton>
            {filters}
          </div>
          <div className="flex flex-wrap items-center gap-1 self-start xl:justify-end">
            {primaryAction}
            <IconButton
              type="button"
              title="Bulk delete"
              aria-label="Bulk delete"
              className="h-6 w-6 rounded-md border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-rose-50 disabled:border-slate-300 disabled:text-slate-400"
              onClick={() => onBulkDelete?.(selectedRows.map((row) => row.original))}
              disabled={!onBulkDelete || selectedRows.length === 0}
            >
              <Trash2 className="h-3 w-3" />
            </IconButton>
            <IconButton type="button" title="Import Excel" className="h-6 w-6 rounded-md">
              <Upload className="h-3 w-3" />
            </IconButton>
            <IconButton type="button" title="Export Excel" className="h-6 w-6 rounded-md">
              <FileSpreadsheet className="h-3 w-3" />
            </IconButton>
            <IconButton type="button" title="Export PDF" className="h-6 w-6 rounded-md">
              <FileText className="h-3 w-3" />
            </IconButton>
            <IconButton type="button" title="Export Data" className="h-6 w-6 rounded-md">
              <Download className="h-3 w-3" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)]">
        {table.getRowModel().rows.length === 0 ? (
          <div className="bg-white p-5">
            <EmptyState
              title="Data tidak ditemukan"
              description="Periksa kata kunci pencarian atau lanjutkan dengan menambah data baru dari modul terkait."
            />
          </div>
        ) : (
          <>
            {mobileCard ? (
              <div className="grid gap-3 bg-white p-4 md:hidden">
                {table.getRowModel().rows.map((row, index) => (
                  <div key={row.id}>{mobileCard(row.original, index)}</div>
                ))}
              </div>
            ) : null}
            <div className="hidden md:block">
            <div className="max-h-[520px] overflow-auto">
            <table className="min-w-max bg-white">
              <thead className="sticky top-0 z-10 bg-[var(--color-bg)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="whitespace-nowrap px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {header.isPlaceholder ? null : (
                          header.column.getCanSort() ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 transition hover:text-[var(--color-text)]"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <SortIcon direction={header.column.getIsSorted()} />
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--color-border)]">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-3 py-2.5 align-middle text-xs text-[var(--color-text)]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            </div>
          </>
        )}
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPreviousPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
        />
      </div>
    </div>
  );
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') {
    return <ChevronUp className="h-3 w-3" />;
  }

  if (direction === 'desc') {
    return <ChevronDown className="h-3 w-3" />;
  }

  return <ArrowUpDown className="h-3 w-3 opacity-60" />;
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + offsetToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: toInputDate(monday),
    end: toInputDate(sunday),
  };
}

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isWithinDateRange<T>(item: T, start: string, end: string) {
  const candidate = extractDateValue(item);

  if (!candidate || !start || !end) {
    return true;
  }

  const date = new Date(candidate);
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T23:59:59`);

  if (Number.isNaN(date.getTime())) {
    return true;
  }

  return date >= startDate && date <= endDate;
}

function extractDateValue<T>(item: T) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const record = item as Record<string, unknown>;
  const value = record.createdAt ?? record.documentDate ?? null;

  return typeof value === 'string' ? value : null;
}

function getDefaultSortId<T>(columns: Array<ColumnDef<T>>) {
  for (const column of columns) {
    const candidate = getColumnIdentity(column);
    if (candidate === 'createdAt' || candidate === 'documentDate') {
      return candidate;
    }
  }

  return null;
}

function getColumnIdentity<T>(column: ColumnDef<T>) {
  if ('id' in column && typeof column.id === 'string') {
    return column.id;
  }

  if ('accessorKey' in column && typeof column.accessorKey === 'string') {
    return column.accessorKey;
  }

  return null;
}
