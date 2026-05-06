export type RealtimeEventName =
  | 'medical-record.created'
  | 'medical-record.updated'
  | 'medical-record.deleted'
  | 'notification.info';

export interface RealtimeEventPayload {
  event: RealtimeEventName;
  data: {
    module: string;
    recordId?: string;
    action: string;
    actorId?: string;
  };
  meta: {
    toastType?: 'success' | 'error' | 'warning' | 'info';
    invalidate?: string[];
  };
}
