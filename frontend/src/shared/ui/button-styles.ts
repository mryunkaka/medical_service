import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  primary: 'border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:border-slate-950 hover:bg-slate-950',
  secondary: 'border border-[var(--color-border-strong)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)]',
  ghost: 'border border-transparent bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg)]',
  danger: 'border border-[var(--color-danger)] bg-[var(--color-danger)] text-white hover:opacity-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
};

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold leading-none no-underline transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-100';

export function buttonClass({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    baseClass,
    sizeClasses[size],
    variants[variant],
    fullWidth && 'w-full',
    className,
  );
}
