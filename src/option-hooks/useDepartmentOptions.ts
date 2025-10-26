import { useQuery } from '@tanstack/react-query';
import { getSelectDepartments } from '../routers/department/service';


export function useDepartmentOptions() {
  const query = useQuery({
    queryKey: [ 'departments', 'select'],
    queryFn: async () => {
      const response = await getSelectDepartments(null);
      return response.data;
    }, 
  });

  return {
    departments: query.data ?? [],
    isLoadingDepartments: query.isLoading,
    refetchDepartments: query.refetch,
  };
}
