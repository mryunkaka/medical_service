import { useMutation, useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';
import type { MedicalRecordFormValues } from '@/types/medical-record';

export function useMedicalRecordsQuery(search: string) {
  return useQuery({
    queryKey: [...queryKeys.medicalRecords, search],
    queryFn: () => appApi.getMedicalRecords(search),
  });
}

export function useMedicalRecordDetailQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.medicalRecordDetail(id),
    queryFn: () => appApi.getMedicalRecord(id),
    enabled,
  });
}

export function useMedicalRecordSaveMutation(recordId?: number) {
  return useMutation({
    mutationFn: (values: MedicalRecordFormValues) => appApi.saveMedicalRecord(values, recordId),
  });
}

export function useMedicalRecordDeleteMutation() {
  return useMutation({
    mutationFn: (recordId: number) => appApi.deleteMedicalRecord(recordId),
  });
}

export function useUserLookupQuery(scope: 'doctor' | 'assistant' | 'all', q: string) {
  return useQuery({
    queryKey: queryKeys.lookups(scope, q),
    queryFn: () => appApi.getUserLookup(scope, q),
  });
}
