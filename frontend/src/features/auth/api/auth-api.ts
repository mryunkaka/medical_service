import { useMutation, useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';

export function useSessionQuery() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => appApi.getSession(),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: appApi.login,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: appApi.logout,
  });
}
