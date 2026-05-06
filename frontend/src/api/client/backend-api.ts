import { httpClient } from '@/api/client/http-client';
import type { MedicalServiceApi } from '@/api/client/medical-service-api';
import { env } from '@/lib/env';
import type { LoginPayload, SessionUser } from '@/types/auth';
import type { DashboardPayload } from '@/types/dashboard';
import type { EmsServiceFormValues, EmsServiceRecord } from '@/types/ems-service';
import type { MedicalRecord, MedicalRecordFormValues, UserLookupItem } from '@/types/medical-record';
import type { PharmacyRecapFormValues, PharmacyRecapRecord } from '@/types/pharmacy-recap';
import type { SecretaryFileRecord, SecretaryFileRecordFormValues, SecretaryPayload } from '@/types/secretary';

export const backendApi = {
  login(payload: LoginPayload) {
    return httpClient.post<SessionUser | null>('/api/auth/login', payload);
  },
  logout() {
    return httpClient.post<null>('/api/auth/logout');
  },
  getSession() {
    return httpClient.get<SessionUser | null>('/api/auth/session');
  },
  getDashboard() {
    return httpClient.get<DashboardPayload>('/api/dashboard');
  },
  getMedicalRecords(search = '') {
    return httpClient.get<MedicalRecord[]>('/api/medical-records', { search });
  },
  getMedicalRecord(id: number) {
    return httpClient.get<MedicalRecord | null>(`/api/medical-records/${id}`);
  },
  saveMedicalRecord(values: MedicalRecordFormValues, recordId?: number) {
    return recordId
      ? httpClient.put<MedicalRecord>(`/api/medical-records/${recordId}`, values)
      : httpClient.post<MedicalRecord>('/api/medical-records', values);
  },
  getEmsServices(search = '', type = '') {
    return httpClient.get<EmsServiceRecord[]>('/api/ems-services', { search, type });
  },
  saveEmsService(values: EmsServiceFormValues) {
    return httpClient.post<EmsServiceRecord>('/api/ems-services', values);
  },
  getPharmacyRecap(search = '', status = '') {
    return httpClient.get<PharmacyRecapRecord[]>('/api/pharmacy-recap', { search, status });
  },
  savePharmacyRecap(values: PharmacyRecapFormValues) {
    return httpClient.post<PharmacyRecapRecord>('/api/pharmacy-recap', values);
  },
  getSecretaryData() {
    return httpClient.get<SecretaryPayload>('/api/secretary');
  },
  saveSecretaryFileRecord(values: SecretaryFileRecordFormValues) {
    return httpClient.post<SecretaryFileRecord>('/api/secretary/file-records', values);
  },
  getUserLookup(scope: 'doctor' | 'assistant' | 'all', q = '') {
    return httpClient.get<UserLookupItem[]>('/api/lookups/users', { scope, q });
  },
  getRealtimeDelta(cursor?: string) {
    return httpClient.get(env.realtimeDeltaPath, { cursor });
  },
} satisfies MedicalServiceApi;
