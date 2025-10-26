import { useQuery } from '@tanstack/react-query';
import { getSelectLocations } from '../routers/location/service';


export function useLocationOptions() {
  const query = useQuery({
    queryKey: [ 'locations', 'select'],
    queryFn: async () => {
      const response = await getSelectLocations(null);
      return response.data;
    }, 
  });

  return {
    locations: query.data ?? [],
    isLoadingLocations: query.isLoading,
    refetchLocations: query.refetch,
  };
}
