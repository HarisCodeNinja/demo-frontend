import { useQuery } from '@tanstack/react-query';
import { getSelectEmployees } from '../routers/employee/service';


export function useEmployeeOptions() {
  const query = useQuery({
    queryKey: [ 'employees', 'select'],
    queryFn: async () => {
      const response = await getSelectEmployees(null);
      return response.data;
    }, 
  });

  return {
    employees: query.data ?? [],
    isLoadingEmployees: query.isLoading,
    refetchEmployees: query.refetch,
  };
}
