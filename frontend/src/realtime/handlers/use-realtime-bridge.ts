import { useEffect } from 'react';
import { queryClient } from '@/api/query/query-client';
import { realtimeClient } from '@/realtime/client/realtime-client';
import { showToast } from '@/shared/feedback/toast';

export function useRealtimeBridge() {
  useEffect(() => {
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
  }, []);
}
