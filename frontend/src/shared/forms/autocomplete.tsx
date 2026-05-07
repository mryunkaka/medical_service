import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

interface AutocompleteProps {
  value: string;
  search: string;
  options: AutocompleteOption[];
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  onSearchChange: (value: string) => void;
  onSelect: (option: AutocompleteOption) => void;
}

export function Autocomplete({
  value,
  search,
  options,
  placeholder = 'Cari data...',
  emptyLabel = 'Data tidak ditemukan.',
  disabled,
  onSearchChange,
  onSelect,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const displayValue = useMemo(() => (open ? search : value || search), [open, search, value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          value={displayValue}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3 pl-10 pr-4 text-sm text-[var(--color-text)] shadow-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]"
          onFocus={() => {
            setOpen(true);
            onSearchChange(value);
          }}
          onChange={(event) => {
            setOpen(true);
            onSearchChange(event.target.value);
          }}
        />
      </div>

      {open ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-xl">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--color-muted)]">{emptyLabel}</p>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-[var(--color-bg)]',
                  option.label === value && 'bg-[var(--color-bg)]',
                )}
                onClick={() => {
                  onSelect(option);
                  onSearchChange(option.label);
                  setOpen(false);
                }}
              >
                <span className="text-sm font-semibold text-[var(--color-text)]">{option.label}</span>
                {option.description ? <span className="text-xs text-[var(--color-muted)]">{option.description}</span> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
