import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getDesignationDetails } from '../service';
import DESIGNATION_CONSTANTS from '../constants';

interface ViewProps {}

const DesignationViewController: React.FC<ViewProps> = ({}) => {
  const { [DESIGNATION_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: designation, isLoading } = useQuery({
    queryKey: [DESIGNATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.designationId, showView],
    queryFn: () => getDesignationDetails(primaryKeys?.designationId || 0),
    enabled: Boolean(showView && primaryKeys?.designationId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(DESIGNATION_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && designation && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Designation Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{designation?.data?.designationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Designation Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{designation?.data?.designationName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{designation?.data?.createdAt ? new Date(designation?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{designation?.data?.updatedAt ? new Date(designation?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${DESIGNATION_CONSTANTS.ENTITY_NAME} Details`}
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

export default DesignationViewController;