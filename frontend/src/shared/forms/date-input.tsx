import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const base =
  'w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] shadow-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]';

export const DateInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} type="date" className={cn(base, className)} {...props} />,
);
DateInput.displayName = 'DateInput';
