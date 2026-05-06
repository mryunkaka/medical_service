import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-8 text-center">
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
