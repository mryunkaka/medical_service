import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Radio = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn(
        'h-5 w-5 border border-[var(--color-border-strong)] text-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-soft)]',
        className,
      )}
      {...props}
    />
  ),
);
Radio.displayName = 'Radio';
