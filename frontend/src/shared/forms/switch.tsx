import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <label className={cn('relative inline-flex cursor-pointer items-center', className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[var(--color-accent)] peer-focus-visible:ring-4 peer-focus-visible:ring-[var(--color-accent-soft)]" />
      <span className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </label>
  ),
);
Switch.displayName = 'Switch';
