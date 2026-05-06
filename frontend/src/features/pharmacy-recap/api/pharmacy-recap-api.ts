import { useMutation, useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';
import type { PharmacyRecapFormValues } from '@/types/pharmacy-recap';

export function usePharmacyRecapQuery(search: string, status: string) {
  return useQuery({
    queryKey: [...queryKeys.pharmacyRecap, search, status],
    queryFn: () => appApi.getPharmacyRecap(search, status),
  });
}

export function usePharmacyRecapSaveMutation() {
  return useMutation({
    mutationFn: (values: PharmacyRecapFormValues) => appApi.savePharmacyRecap(values),
  });
}
