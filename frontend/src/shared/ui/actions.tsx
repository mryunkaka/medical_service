import type { PropsWithChildren, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import type { ButtonVariant } from '@/shared/ui/button-styles';
import { buttonClass } from '@/shared/ui/button-styles';
import { Card } from '@/shared/ui/card';
import { IconButton } from '@/shared/ui/icon-button';
import { cn } from '@/lib/utils';

export function PageAction({
  children,
  href,
  onClick,
  variant = 'primary',
  fullWidth = false,
  className,
}: PropsWithChildren<{ href?: LinkProps['to']; onClick?: () => void; variant?: ButtonVariant; fullWidth?: boolean; className?: string }>) {
  if (href) {
    return (
      <Link to={href} className={buttonClass({ variant, size: 'lg', fullWidth, className })}>
        {children}
      </Link>
    );
  }

  return (
    <Button type="button" variant={variant} size="lg" fullWidth={fullWidth} className={className} onClick={onClick}>
      {children}
    </Button>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 whitespace-nowrap">{children}</div>;
}

export function RowActionButton({
  children,
  href,
  variant = 'secondary',
  onClick,
}: PropsWithChildren<{ href?: LinkProps['to']; variant?: 'primary' | 'secondary'; onClick?: () => void }>) {
  if (href) {
    return (
      <Link to={href} className={buttonClass({ variant, size: 'sm', className: 'whitespace-nowrap px-3' })}>
        {children}
      </Link>
    );
  }

  return (
    <Button type="button" variant={variant} size="sm" className="whitespace-nowrap px-3" onClick={onClick}>
      {children}
    </Button>
  );
}

export function RowActionIcon({
  children,
  href,
  onClick,
  title,
}: PropsWithChildren<{ href?: LinkProps['to']; onClick?: () => void; title: string }>) {
  if (href) {
    return (
      <Link to={href} title={title} aria-label={title} className="inline-flex">
        <IconButton type="button" className="h-7 w-7 rounded-lg">
          {children}
        </IconButton>
      </Link>
    );
  }

  return (
    <IconButton type="button" className="h-7 w-7 rounded-lg" onClick={onClick} title={title} aria-label={title}>
      {children}
    </IconButton>
  );
}

export function InlineMetricCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={cn('rounded-[28px] border border-[var(--color-border)] bg-white/96 p-5 shadow-[var(--shadow-card)] backdrop-blur')}>
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[var(--color-text)]">{value}</p>
    </div>
  );
}

export function MetricsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function ActionGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap gap-3', className)}>{children}</div>;
}

export function FormFooter({
  hint,
  children,
}: {
  hint: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-[var(--color-muted)]">{hint}</div>
      <ActionGroup>{children}</ActionGroup>
    </Card>
  );
}
