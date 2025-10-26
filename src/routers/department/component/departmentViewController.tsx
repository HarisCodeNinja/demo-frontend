import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getDepartmentDetails } from '../service';
import DEPARTMENT_CONSTANTS from '../constants';

interface ViewProps {}

const DepartmentViewController: React.FC<ViewProps> = ({}) => {
  const { [DEPARTMENT_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: department, isLoading } = useQuery({
    queryKey: [DEPARTMENT_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.departmentId, showView],
    queryFn: () => getDepartmentDetails(primaryKeys?.departmentId || 0),
    enabled: Boolean(showView && primaryKeys?.departmentId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(DEPARTMENT_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && department && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Department Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{department?.data?.departmentId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Department Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{department?.data?.departmentName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{department?.data?.createdAt ? new Date(department?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{department?.data?.updatedAt ? new Date(department?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${DEPARTMENT_CONSTANTS.ENTITY_NAME} Details`}
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

export default DepartmentViewController;