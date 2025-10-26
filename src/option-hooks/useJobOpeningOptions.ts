import { useQuery } from '@tanstack/react-query';
import { getSelectJobOpenings } from '../routers/job-opening/service';


export function useJobOpeningOptions() {
  const query = useQuery({
    queryKey: [ 'jobOpenings', 'select'],
    queryFn: async () => {
      const response = await getSelectJobOpenings(null);
      return response.data;
    }, 
  });

  return {
    jobOpenings: query.data ?? [],
    isLoadingJobOpenings: query.isLoading,
    refetchJobOpenings: query.refetch,
  };
}
