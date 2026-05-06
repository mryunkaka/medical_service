import { appApi } from '@/api/client/app-api';
import { env } from '@/lib/env';
import type { RealtimeEventPayload } from '@/realtime/contracts/event-types';

type Listener = (payload: RealtimeEventPayload) => void;

class RealtimeClient {
  private listeners = new Set<Listener>();
  private heartbeatId: number | null = null;
  private pollingId: number | null = null;
  private eventSource: EventSource | null = null;
  private latestCursor: string | null = null;
  private usingPolling = false;
  private reconnectTimeoutId: number | null = null;
  private visibilityBound = false;

  connect() {
    this.bindVisibilityHandling();

    if (env.apiMode === 'api') {
      this.connectApiMode();
      return;
    }

    this.connectMockMode();
  }

  disconnect() {
    if (this.heartbeatId !== null) {
      window.clearInterval(this.heartbeatId);
      this.heartbeatId = null;
    }

    if (this.pollingId !== null) {
      window.clearInterval(this.pollingId);
      this.pollingId = null;
    }

    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.usingPolling = false;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(payload: RealtimeEventPayload) {
    this.listeners.forEach((listener) => listener(payload));
  }

  private connectMockMode() {
    if (this.heartbeatId !== null) {
      return;
    }

    this.heartbeatId = window.setInterval(() => {
      this.emit({
        event: 'notification.info',
        data: {
          module: 'system',
          action: 'heartbeat',
        },
        meta: {
          toastType: 'info',
        },
      });
    }, 60_000);
  }

  private connectApiMode() {
    if (this.eventSource || this.pollingId !== null) {
      return;
    }

    const streamUrl = new URL(env.realtimeSsePath, env.apiBaseUrl || window.location.origin);
    this.eventSource = new EventSource(streamUrl.toString(), { withCredentials: true });
    this.eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data) as RealtimeEventPayload;
      this.emit(payload);
    };
    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.eventSource = null;
      this.startPollingFallback();
      this.scheduleReconnect();
    };
  }

  private startPollingFallback() {
    if (this.usingPolling) {
      return;
    }

    this.usingPolling = true;
    this.pollingId = window.setInterval(() => {
      if (document.visibilityState === 'hidden') {
        return;
      }

      void appApi.getRealtimeDelta(this.latestCursor ?? undefined).then((response) => {
        if (!response.success || !response.data) {
          return;
        }

        this.latestCursor = response.data.latestCursor;
        response.data.events.forEach((event) => this.emit(event));
      });
    }, 15_000);
  }

  private scheduleReconnect() {
    if (this.reconnectTimeoutId !== null || env.apiMode !== 'api') {
      return;
    }

    this.reconnectTimeoutId = window.setTimeout(() => {
      this.reconnectTimeoutId = null;
      this.stopPollingFallback();
      this.connectApiMode();
    }, 8_000);
  }

  private stopPollingFallback() {
    if (this.pollingId !== null) {
      window.clearInterval(this.pollingId);
      this.pollingId = null;
    }
    this.usingPolling = false;
  }

  private bindVisibilityHandling() {
    if (this.visibilityBound) {
      return;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && env.apiMode === 'api') {
        this.stopPollingFallback();
        if (!this.eventSource) {
          this.connectApiMode();
        }
      }
    });

    this.visibilityBound = true;
  }
}

export const realtimeClient = new RealtimeClient();
