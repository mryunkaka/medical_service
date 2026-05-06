import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const tones: Record<AlertTone, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
};

export function Alert({
  title,
  description,
  tone = 'info',
  className,
  children,
}: PropsWithChildren<{ title: string; description?: string; tone?: AlertTone; className?: string }>) {
  return (
    <div className={cn('rounded-[24px] border px-4 py-4 shadow-sm', tones[tone], className)} role="alert">
      <div className="space-y-1">
        <p className="text-sm font-bold">{title}</p>
        {description ? <p className="text-sm/6 opacity-85">{description}</p> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
