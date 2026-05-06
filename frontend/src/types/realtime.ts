import type { RealtimeEventPayload } from '@/realtime/contracts/event-types';

export interface RealtimeDeltaPayload {
  hasChanges: boolean;
  latestCursor: string;
  events: RealtimeEventPayload[];
}
