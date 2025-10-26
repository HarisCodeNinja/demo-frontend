import { useQuery } from '@tanstack/react-query';
import { getSelectUsers } from '../routers/user/service';


export function useUserOptions() {
  const query = useQuery({
    queryKey: [ 'users', 'select'],
    queryFn: async () => {
      const response = await getSelectUsers(null);
      return response.data;
    }, 
  });

  return {
    users: query.data ?? [],
    isLoadingUsers: query.isLoading,
    refetchUsers: query.refetch,
  };
}
