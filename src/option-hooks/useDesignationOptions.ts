import { useQuery } from '@tanstack/react-query';
import { getSelectDesignations } from '../routers/designation/service';


export function useDesignationOptions() {
  const query = useQuery({
    queryKey: [ 'designations', 'select'],
    queryFn: async () => {
      const response = await getSelectDesignations(null);
      return response.data;
    }, 
  });

  return {
    designations: query.data ?? [],
    isLoadingDesignations: query.isLoading,
    refetchDesignations: query.refetch,
  };
}
