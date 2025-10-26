import { useQuery } from '@tanstack/react-query';
import { getSelectCandidates } from '../routers/candidate/service';


export function useCandidateOptions() {
  const query = useQuery({
    queryKey: [ 'candidates', 'select'],
    queryFn: async () => {
      const response = await getSelectCandidates(null);
      return response.data;
    }, 
  });

  return {
    candidates: query.data ?? [],
    isLoadingCandidates: query.isLoading,
    refetchCandidates: query.refetch,
  };
}
