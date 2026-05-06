import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function IconButton({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent-soft)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
