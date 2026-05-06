import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-5 py-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-white text-rose-600 shadow-sm">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-rose-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-rose-900/80">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
