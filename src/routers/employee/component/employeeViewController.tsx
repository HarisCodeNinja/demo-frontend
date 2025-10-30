import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getEmployeeDetails } from '../service';
import EMPLOYEE_CONSTANTS from '../constants';

/**
 * Helper component to display a labeled field
 */
const ViewField: React.FC<{ label: string; value: string | number | Date | null | undefined }> = ({ label, value }) => {
	const displayValue = useMemo(() => {
		if (value === null || value === undefined) return '-';
		if (value instanceof Date) return value.toLocaleDateString();
		return String(value);
	}, [value]);

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="flex items-center text-sm bg-muted p-3 rounded-md">{displayValue}</div>
		</div>
	);
};

/**
 * Modal component for viewing employee details
 */
const EmployeeViewController: React.FC = () => {
	const { [EMPLOYEE_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector(
		(state: RootState) => state.selectedObj
	);
	const dispatch = useAppDispatch();

	const { data: employee, isLoading } = useQuery({
		queryKey: [EMPLOYEE_CONSTANTS.QUERY_KEY, 'view', primaryKeys?.employeeId],
		queryFn: () => getEmployeeDetails(primaryKeys?.employeeId || ''),
		enabled: Boolean(showView && primaryKeys?.employeeId),
	});

	const handleClose = useCallback(() => {
		dispatch(resetSelectedObj(EMPLOYEE_CONSTANTS.ENTITY_KEY));
	}, [dispatch]);

	const employeeData = employee?.data;

	return (
		<Controls
			title={`${EMPLOYEE_CONSTANTS.ENTITY_NAME} Details`}
			open={showView}
			onClose={handleClose}
			type="modal"
			width={800}
			loading={isLoading}
		>
			{isLoading && (
				<div className="flex items-center justify-center py-10 h-1/2">
					<Spinner />
				</div>
			)}
			{!isLoading && employeeData && (
				<div className="grid grid-cols-1 gap-6 items-start">
					<ViewField label="Employee ID" value={employeeData.employeeId} />
					<ViewField label="User ID" value={employeeData.userId} />
					<ViewField label="Employee Unique ID" value={employeeData.employeeUniqueId} />
					<ViewField label="First Name" value={employeeData.firstName} />
					<ViewField label="Last Name" value={employeeData.lastName} />
					<ViewField
						label="Date of Birth"
						value={employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : null}
					/>
					<ViewField label="Gender" value={employeeData.gender} />
					<ViewField label="Phone Number" value={employeeData.phoneNumber} />
					<ViewField label="Address" value={employeeData.address} />
					<ViewField label="Personal Email" value={employeeData.personalEmail} />
					<ViewField
						label="Employment Start Date"
						value={employeeData.employmentStartDate ? new Date(employeeData.employmentStartDate) : null}
					/>
					<ViewField
						label="Employment End Date"
						value={employeeData.employmentEndDate ? new Date(employeeData.employmentEndDate) : null}
					/>
					<ViewField label="Department ID" value={employeeData.departmentId} />
					<ViewField label="Designation ID" value={employeeData.designationId} />
					<ViewField label="Reporting Manager ID" value={employeeData.reportingManagerId} />
					<ViewField label="Status" value={employeeData.status} />
					<ViewField label="Created At" value={employeeData.createdAt ? new Date(employeeData.createdAt) : null} />
					<ViewField label="Updated At" value={employeeData.updatedAt ? new Date(employeeData.updatedAt) : null} />
				</div>
			)}
		</Controls>
	);
};

export default EmployeeViewController;