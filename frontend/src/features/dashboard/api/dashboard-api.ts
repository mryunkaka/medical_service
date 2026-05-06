import { useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/client/app-api';
import { queryKeys } from '@/constants/query-keys';

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => appApi.getDashboard(),
  });
}
