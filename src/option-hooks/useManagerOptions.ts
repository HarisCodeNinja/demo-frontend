import { useQuery } from '@tanstack/react-query';
import { getSelectManagers } from '../routers/employee/service';

export function useManagerOptions() {
  const query = useQuery({
    queryKey: ['employees', 'select-manager'],
    queryFn: async () => {
      const response = await getSelectManagers(null);
      return response.data;
    },
  });

  return {
    managers: query.data ?? [],
    isLoadingManageres: query.isLoading,
    refetchManagers: query.refetch,
  };
}
