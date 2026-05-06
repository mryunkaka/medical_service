export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
  meta: {
    toastType?: ToastType;
    pagination?: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
    realtime?: {
      enabled: boolean;
      fallback: 'sse' | 'polling';
    };
    version?: string;
  };
}
