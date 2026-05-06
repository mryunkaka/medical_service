import { useDashboardQuery } from '@/features/dashboard/api/dashboard-api';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { ButtonLink } from '@/shared/ui/button';
import { ErrorState } from '@/shared/feedback/error-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { MetricsGrid } from '@/shared/ui/actions';

export function DashboardHome() {
  const { data, isLoading, isError, refetch } = useDashboardQuery();

  const payload = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <MetricsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </MetricsGrid>
      </div>
    );
  }

  if (isError || !payload) {
    return (
      <ErrorState
        title="Dashboard gagal dimuat"
        description="Periksa adapter backend atau response contract dashboard sebelum melanjutkan validasi operasional."
        action={<ButtonLink to="/" onClick={() => void refetch()}>Coba muat ulang</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <MetricsGrid>
        {payload?.summaryCards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{card.label}</p>
                <p className="mt-3 text-3xl font-black text-[var(--color-text)]">{card.value}</p>
              </div>
              <Badge tone={card.tone}>Live</Badge>
            </div>
          </Card>
        ))}
      </MetricsGrid>

      <Card>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Quick Actions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {payload?.quickActions.map((action) => (
            <ButtonLink key={action.href} to={action.href} variant="secondary" className="h-full items-start justify-start rounded-[24px] p-4 text-left">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">{action.title}</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">Arahkan user ke flow operasional utama tanpa pindah pola interaksi.</p>
              </div>
            </ButtonLink>
          ))}
        </div>
      </Card>
    </div>
  );
}
