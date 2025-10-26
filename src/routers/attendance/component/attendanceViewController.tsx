import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getAttendanceDetails } from '../service';
import ATTENDANCE_CONSTANTS from '../constants';

interface ViewProps {}

const AttendanceViewController: React.FC<ViewProps> = ({}) => {
  const { [ATTENDANCE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: attendance, isLoading } = useQuery({
    queryKey: [ATTENDANCE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.attendanceId, showView],
    queryFn: () => getAttendanceDetails(primaryKeys?.attendanceId || 0),
    enabled: Boolean(showView && primaryKeys?.attendanceId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(ATTENDANCE_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && attendance && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Attendance Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.attendanceId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Attendance Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.attendanceDate ? new Date(attendance?.data?.attendanceDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Check In Time</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.checkInTime ? new Date(attendance?.data?.checkInTime).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Check Out Time</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.checkOutTime ? new Date(attendance?.data?.checkOutTime).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Total Hour</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.totalHour ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.createdAt ? new Date(attendance?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{attendance?.data?.updatedAt ? new Date(attendance?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${ATTENDANCE_CONSTANTS.ENTITY_NAME} Details`}
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

export default AttendanceViewController;