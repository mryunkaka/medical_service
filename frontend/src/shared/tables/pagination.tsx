import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/shared/ui/icon-button';

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function Pagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-white px-4 py-3">
      <p className="text-xs text-[var(--color-muted)]">
        Halaman {pageCount === 0 ? 0 : pageIndex + 1} dari {pageCount}
      </p>
      <div className="flex items-center gap-1.5">
        <IconButton type="button" onClick={onPreviousPage} disabled={!canPreviousPage} className="h-7 w-7 rounded-lg">
          <ChevronLeft className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton type="button" onClick={onNextPage} disabled={!canNextPage} className="h-7 w-7 rounded-lg">
          <ChevronRight className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </div>
  );
}
