import { useQuery } from '@tanstack/react-query';
import { getSelectSkills } from '../routers/skill/service';


export function useSkillOptions() {
  const query = useQuery({
    queryKey: [ 'skills', 'select'],
    queryFn: async () => {
      const response = await getSelectSkills(null);
      return response.data;
    }, 
  });

  return {
    skills: query.data ?? [],
    isLoadingSkills: query.isLoading,
    refetchSkills: query.refetch,
  };
}
