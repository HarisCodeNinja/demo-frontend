import { useQuery } from '@tanstack/react-query';
import { getSelectLeaveTypes } from '../routers/leave-type/service';


export function useLeaveTypeOptions() {
  const query = useQuery({
    queryKey: [ 'leaveTypes', 'select'],
    queryFn: async () => {
      const response = await getSelectLeaveTypes(null);
      return response.data;
    }, 
  });

  return {
    leaveTypes: query.data ?? [],
    isLoadingLeaveTypes: query.isLoading,
    refetchLeaveTypes: query.refetch,
  };
}
