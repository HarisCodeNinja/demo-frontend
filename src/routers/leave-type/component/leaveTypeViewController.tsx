import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getLeaveTypeDetails } from '../service';
import LEAVETYPE_CONSTANTS from '../constants';

interface ViewProps {}

const LeaveTypeViewController: React.FC<ViewProps> = ({}) => {
  const { [LEAVETYPE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: leaveType, isLoading } = useQuery({
    queryKey: [LEAVETYPE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.leaveTypeId, showView],
    queryFn: () => getLeaveTypeDetails(primaryKeys?.leaveTypeId || 0),
    enabled: Boolean(showView && primaryKeys?.leaveTypeId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(LEAVETYPE_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && leaveType && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Leave Type Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.leaveTypeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Type Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.typeName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Max Days Per Year</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.maxDaysPerYear ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Is Paid</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.isPaid ? 'Yes' : 'No'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.createdAt ? new Date(leaveType?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveType?.data?.updatedAt ? new Date(leaveType?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${LEAVETYPE_CONSTANTS.ENTITY_NAME} Details`}
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

export default LeaveTypeViewController;