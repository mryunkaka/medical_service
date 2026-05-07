import { env } from '@/lib/env';
import type { ApiResponse } from '@/types/api';

type Primitive = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, Primitive>) {
  const base = env.apiBaseUrl ? env.apiBaseUrl.replace(/\/$/, '') : '';
  const nextPath = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const url = new URL(nextPath, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(path: string, init?: RequestInit, query?: Record<string, Primitive>) {
  const resolvedInit = normalizeRequestInit(init);
  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(resolvedInit.body && !(resolvedInit.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...resolvedInit.headers,
    },
    ...resolvedInit,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('medical-service:unauthorized'));
  }

  if (!response.ok && !payload.success) {
    return payload;
  }

  return payload;
}

export const httpClient = {
  get<T>(path: string, query?: Record<string, Primitive>) {
    return request<T>(path, { method: 'GET' }, query);
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
  },
  put<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' });
  },
};

function normalizeRequestInit(init?: RequestInit): RequestInit {
  if (!init?.body || !(init.body instanceof FormData) || init.method !== 'PUT') {
    return init ?? {};
  }

  init.body.set('_method', 'PUT');

  return {
    ...init,
    method: 'POST',
  };
}
