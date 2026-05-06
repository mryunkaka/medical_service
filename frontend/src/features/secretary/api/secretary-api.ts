import { useMutation, useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';
import type { SecretaryFileRecordFormValues } from '@/types/secretary';

export function useSecretaryQuery() {
  return useQuery({
    queryKey: queryKeys.secretary,
    queryFn: () => appApi.getSecretaryData(),
  });
}

export function useSecretaryFileRecordSaveMutation() {
  return useMutation({
    mutationFn: (values: SecretaryFileRecordFormValues) => appApi.saveSecretaryFileRecord(values),
  });
}
