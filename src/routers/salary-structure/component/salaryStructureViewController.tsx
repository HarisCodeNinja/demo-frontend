import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getSalaryStructureDetails } from '../service';
import SALARYSTRUCTURE_CONSTANTS from '../constants';

interface ViewProps {}

const SalaryStructureViewController: React.FC<ViewProps> = ({}) => {
  const { [SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: salaryStructure, isLoading } = useQuery({
    queryKey: [SALARYSTRUCTURE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.salaryStructureId, showView],
    queryFn: () => getSalaryStructureDetails(primaryKeys?.salaryStructureId || 0),
    enabled: Boolean(showView && primaryKeys?.salaryStructureId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && salaryStructure && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Salary Structure Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.salaryStructureId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Basic Salary</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.basicSalary ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Allowance</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.allowance ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Deduction</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.deduction ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Effective Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.effectiveDate ? new Date(salaryStructure?.data?.effectiveDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.createdAt ? new Date(salaryStructure?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{salaryStructure?.data?.updatedAt ? new Date(salaryStructure?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${SALARYSTRUCTURE_CONSTANTS.ENTITY_NAME} Details`}
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

export default SalaryStructureViewController;