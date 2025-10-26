import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getLeaveApplicationDetails } from '../service';
import LEAVEAPPLICATION_CONSTANTS from '../constants';

interface ViewProps {}

const LeaveApplicationViewController: React.FC<ViewProps> = ({}) => {
  const { [LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: leaveApplication, isLoading } = useQuery({
    queryKey: [LEAVEAPPLICATION_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.leaveApplicationId, showView],
    queryFn: () => getLeaveApplicationDetails(primaryKeys?.leaveApplicationId || 0),
    enabled: Boolean(showView && primaryKeys?.leaveApplicationId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && leaveApplication && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Leave Application Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.leaveApplicationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Leave Type Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.leaveTypeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.startDate ? new Date(leaveApplication?.data?.startDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.endDate ? new Date(leaveApplication?.data?.endDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Number Of Day</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.numberOfDay ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Reason</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.reason ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Applied By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.appliedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Approved By</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.approvedBy ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.createdAt ? new Date(leaveApplication?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{leaveApplication?.data?.updatedAt ? new Date(leaveApplication?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${LEAVEAPPLICATION_CONSTANTS.ENTITY_NAME} Details`}
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

export default LeaveApplicationViewController;