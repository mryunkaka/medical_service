import { useMutation, useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';
import type { EmsServiceFormValues } from '@/types/ems-service';

export function useEmsServicesQuery(search: string, type: string) {
  return useQuery({
    queryKey: [...queryKeys.emsServices, search, type],
    queryFn: () => appApi.getEmsServices(search, type),
  });
}

export function useEmsServiceSaveMutation() {
  return useMutation({
    mutationFn: (values: EmsServiceFormValues) => appApi.saveEmsService(values),
  });
}
