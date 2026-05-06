import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Medical Service</p>
        <h1 className="mt-0.5 text-[1.3rem] font-black tracking-tight text-[var(--color-text)] md:text-[1.5rem]">{title}</h1>
        {description ? <p className="mt-0.5 max-w-2xl text-[11px] leading-4 text-[var(--color-muted)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
