import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import EmployeeTable from './component/employeeTable';
import EMPLOYEE_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const EmployeePage: React.FC = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const canCreateEmployee = useMemo(
		() => user && hasAccess(
			user.scope,
			EMPLOYEE_CONSTANTS.PERMISSIONS.MODULE,
			EMPLOYEE_CONSTANTS.PERMISSIONS.RESOURCE,
			EMPLOYEE_CONSTANTS.PERMISSIONS.ACTIONS.EDIT
		),
		[user]
	);

	const handleNewEmployee = () => {
		dispatch(openNewForm({ objKey: EMPLOYEE_CONSTANTS.ENTITY_KEY }));
	};

	return (
		<Card>
			<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
				<CardTitle className="text-xl">{EMPLOYEE_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
				{canCreateEmployee && (
					<div className="flex flex-col sm:flex-row gap-2">
						<Button onClick={handleNewEmployee}>
							<Plus className="size-6 me-2" />
							New Employee
						</Button>
					</div>
				)}
			</CardHeader>

			<CardContent>
				<EmployeeTable />
			</CardContent>
		</Card>
	);
};

export default EmployeePage;