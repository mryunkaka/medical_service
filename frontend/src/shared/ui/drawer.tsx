import type { PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function Drawer({ open, title, subtitle, onClose, children }: PropsWithChildren<DrawerProps>) {
  return (
    <div className={cn('fixed inset-0 z-50 transition', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        className={cn(
          'absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-white shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
              {subtitle ? <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p> : null}
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              <X className="h-4 w-4" />
              Tutup
            </Button>
          </div>
          <div className="medical-scrollbar flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </aside>
    </div>
  );
}
