import type { DashboardPayload } from '@/types/dashboard';
import type { ApiResponse } from '@/types/api';
import type { LoginPayload, SessionUser } from '@/types/auth';
import type { EmsServiceFormValues, EmsServiceRecord } from '@/types/ems-service';
import type { MedicalRecord, MedicalRecordFormValues, UserLookupItem } from '@/types/medical-record';
import type { PharmacyRecapFormValues, PharmacyRecapRecord } from '@/types/pharmacy-recap';
import type { RealtimeDeltaPayload } from '@/types/realtime';
import type { SecretaryFileRecord, SecretaryFileRecordFormValues, SecretaryPayload } from '@/types/secretary';

export interface MedicalServiceApi {
  login: (payload: LoginPayload) => Promise<ApiResponse<SessionUser | null>>;
  logout: () => Promise<ApiResponse<null>>;
  getSession: () => Promise<ApiResponse<SessionUser | null>>;
  getDashboard: () => Promise<ApiResponse<DashboardPayload>>;
  getMedicalRecords: (search?: string) => Promise<ApiResponse<MedicalRecord[]>>;
  getMedicalRecord: (id: number) => Promise<ApiResponse<MedicalRecord | null>>;
  saveMedicalRecord: (values: MedicalRecordFormValues, recordId?: number) => Promise<ApiResponse<MedicalRecord>>;
  deleteMedicalRecord: (recordId: number) => Promise<ApiResponse<null>>;
  getEmsServices: (search?: string, type?: string) => Promise<ApiResponse<EmsServiceRecord[]>>;
  saveEmsService: (values: EmsServiceFormValues) => Promise<ApiResponse<EmsServiceRecord>>;
  getPharmacyRecap: (search?: string, status?: string) => Promise<ApiResponse<PharmacyRecapRecord[]>>;
  savePharmacyRecap: (values: PharmacyRecapFormValues) => Promise<ApiResponse<PharmacyRecapRecord>>;
  getSecretaryData: () => Promise<ApiResponse<SecretaryPayload>>;
  saveSecretaryFileRecord: (values: SecretaryFileRecordFormValues) => Promise<ApiResponse<SecretaryFileRecord>>;
  getUserLookup: (scope: 'doctor' | 'assistant' | 'all', q?: string) => Promise<ApiResponse<UserLookupItem[]>>;
  getRealtimeDelta: (cursor?: string) => Promise<ApiResponse<RealtimeDeltaPayload>>;
}
