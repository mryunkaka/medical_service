import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/state/session-store';

export function ProtectedRoute() {
  const location = useLocation();
  const status = useSessionStore((state) => state.status);

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
