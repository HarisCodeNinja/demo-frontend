import { useQuery } from '@tanstack/react-query';
import { getSelectCompetencies } from '../routers/competency/service';


export function useCompetencyOptions() {
  const query = useQuery({
    queryKey: [ 'competencies', 'select'],
    queryFn: async () => {
      const response = await getSelectCompetencies(null);
      return response.data;
    }, 
  });

  return {
    competencies: query.data ?? [],
    isLoadingCompetencies: query.isLoading,
    refetchCompetencies: query.refetch,
  };
}
