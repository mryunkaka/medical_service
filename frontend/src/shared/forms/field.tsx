import type { PropsWithChildren, ReactNode } from 'react';

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: PropsWithChildren<{ label: string; hint?: string; error?: string; required?: boolean }>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--color-text)]">
        {label} {required ? <span className="text-[var(--color-accent)]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-[var(--color-muted)]">{hint}</span> : null}
      {error ? <span className="text-xs font-medium text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
}

export function FieldSection({ title, description, children }: PropsWithChildren<{ title: string; description?: ReactNode }>) {
  return (
    <div className="space-y-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
        {description ? <div className="mt-1 text-sm text-[var(--color-muted)]">{description}</div> : null}
      </div>
      {children}
    </div>
  );
}
