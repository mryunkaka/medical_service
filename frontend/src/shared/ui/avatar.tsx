import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Avatar({
  initials,
  size = 'md',
  className,
}: {
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClass = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-[72px] w-[72px] text-lg',
  }[size];

  return (
    <div
      className={cn(
        'grid place-items-center rounded-[22px] border border-[var(--color-border)] bg-[var(--color-accent-soft)] font-black text-[var(--color-accent)]',
        sizeClass,
        className,
      )}
      aria-label="Avatar user"
    >
      {initials ? initials : <UserRound className="h-1/2 w-1/2" />}
    </div>
  );
}
