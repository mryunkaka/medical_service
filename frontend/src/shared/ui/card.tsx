import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-[var(--color-border)] bg-white/96 p-5 shadow-[var(--shadow-card)] backdrop-blur',
        className,
      )}
    >
      {children}
    </section>
  );
}
