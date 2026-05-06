import { useEffect, type PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './icon-button';

interface ModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function Modal({ open, title, subtitle, onClose, children }: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
            {subtitle ? <p className="mt-1 text-xs text-[var(--color-muted)]">{subtitle}</p> : null}
          </div>
          <IconButton type="button" className="h-8 w-8 rounded-xl" onClick={onClose} title="Tutup modal">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="medical-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
