import { backendApi } from '@/api/client/backend-api';
import type { MedicalServiceApi } from '@/api/client/medical-service-api';
import { mockApi } from '@/api/client/mock-api';
import { env } from '@/lib/env';

export const appApi: MedicalServiceApi = env.apiMode === 'api' ? backendApi : mockApi;
