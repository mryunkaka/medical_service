import { useEffect } from 'react';
import { queryClient } from '@/api/query/query-client';
import { realtimeClient } from '@/realtime/client/realtime-client';
import { showToast } from '@/shared/feedback/toast';
import { useSessionStore } from '@/state/session-store';

export function useRealtimeBridge() {
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (status !== 'authenticated') {
      realtimeClient.disconnect();
      return;
    }

    realtimeClient.connect();

    const unsubscribe = realtimeClient.subscribe((payload) => {
      if (payload.meta.toastType && payload.event !== 'notification.info') {
        showToast(payload.meta.toastType, `Realtime: ${payload.data.action} ${payload.data.module}`);
      }

      if (payload.data.module === 'medical-records') {
        void queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      }
    });

    return () => {
      unsubscribe();
      realtimeClient.disconnect();
    };
  }, [status]);
}
