import { useEffect, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/api/query/query-client';
import { useSessionQuery } from '@/features/auth/api/auth-api';
import { useRealtimeBridge } from '@/realtime/handlers/use-realtime-bridge';
import { useSessionStore } from '@/state/session-store';

function RealtimeBootstrap() {
  useRealtimeBridge();
  return null;
}

function SessionBootstrap() {
  const { data } = useSessionQuery();
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  useEffect(() => {
    if (data) {
      setSession(data.data);
    }
  }, [data, setSession]);

  useEffect(() => {
    function handleUnauthorized() {
      clearSession();
    }

    window.addEventListener('medical-service:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('medical-service:unauthorized', handleUnauthorized);
  }, [clearSession]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrap />
      <RealtimeBootstrap />
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
