import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/state/session-store';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';

export function ProtectedRoute() {
  const location = useLocation();
  const status = useSessionStore((state) => state.status);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <Card className="flex items-center gap-3 px-5 py-4">
          <Spinner className="h-4 w-4" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Memuat session...</span>
        </Card>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
