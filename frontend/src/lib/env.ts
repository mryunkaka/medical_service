export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Medical Service',
  apiMode: (import.meta.env.VITE_API_MODE ?? 'mock') as 'api' | 'mock',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  realtimeSsePath: import.meta.env.VITE_REALTIME_SSE_PATH ?? '/api/realtime/stream',
  realtimeDeltaPath: import.meta.env.VITE_REALTIME_DELTA_PATH ?? '/api/realtime/delta',
};
