import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, tone = 'dark' }: { items: BreadcrumbItem[]; tone?: 'light' | 'dark' }) {
  const itemClass = tone === 'light' ? 'text-white/55' : 'text-[var(--color-muted)]';
  const activeClass = tone === 'light' ? 'text-white' : 'text-[var(--color-text)]';

  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn('flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]', itemClass)}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link to={item.href} className={cn('transition', tone === 'light' ? 'hover:text-white' : 'hover:text-[var(--color-text)]')}>
                {item.label}
              </Link>
            ) : (
              <span className={activeClass}>{item.label}</span>
            )}
            {index < items.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
