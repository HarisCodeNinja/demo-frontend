import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getEmployeeDetails } from '../service';
import EMPLOYEE_CONSTANTS from '../constants';

interface ViewProps {}

const EmployeeViewController: React.FC<ViewProps> = ({}) => {
  const { [EMPLOYEE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: employee, isLoading } = useQuery({
    queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.employeeId, showView],
    queryFn: () => getEmployeeDetails(primaryKeys?.employeeId || 0),
    enabled: Boolean(showView && primaryKeys?.employeeId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(EMPLOYEE_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && employee && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Employee Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.employeeId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>User Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.userId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employee Unique Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.employeeUniqueId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>First Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.firstName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.lastName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Date Of Birth</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.dateOfBirth ? new Date(employee?.data?.dateOfBirth).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.gender ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.phoneNumber ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.address ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Personal Email</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.personalEmail ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employment Start Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.employmentStartDate ? new Date(employee?.data?.employmentStartDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Employment End Date</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.employmentEndDate ? new Date(employee?.data?.employmentEndDate).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Department Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.departmentId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Designation Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.designationId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Reporting Manager Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.reportingManagerId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.status ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.createdAt ? new Date(employee?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{employee?.data?.updatedAt ? new Date(employee?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${EMPLOYEE_CONSTANTS.ENTITY_NAME} Details`}
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

export default EmployeeViewController;