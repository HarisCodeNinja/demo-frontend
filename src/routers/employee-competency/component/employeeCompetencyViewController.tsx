import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getEmployeeCompetencyDetails } from '../service';
import EMPLOYEECOMPETENCY_CONSTANTS from '../constants';

interface ViewProps {}

const EmployeeCompetencyViewController: React.FC<ViewProps> = ({}) => {
  const { [EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: employeeCompetency, isLoading } = useQuery({
    queryKey: [EMPLOYEECOMPETENCY_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.employeeCompetencyId, showView],
    queryFn: () => getEmployeeCompetencyDetails(primaryKeys?.employeeCompetencyId || 0),
    enabled: Boolean(showView && primaryKeys?.employeeCompetencyId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && employeeCompetency && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Employee Competency Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.employeeCompetencyId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Competency Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.competencyId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Current Proficiency</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.currentProficiency ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Last Evaluated</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.lastEvaluated ? new Date(employeeCompetency?.data?.lastEvaluated).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.createdAt ? new Date(employeeCompetency?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employeeCompetency?.data?.updatedAt ? new Date(employeeCompetency?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_NAME} Details`}
      open={showView}
      onClose={handleClose}
      type="modal"
      width={800}
      loading={isLoading}
    >
      <Content />
    </Controls>
  );
};

export default EmployeeCompetencyViewController;