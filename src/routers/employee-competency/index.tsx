import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import EmployeeCompetencyTable from './component/employeeCompetencyTable';
import EMPLOYEECOMPETENCY_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const EmployeeCompetencyPage: React.FC = () => {
	const [employeeCompetencyCount, setEmployeeCompetencyCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: IEmployeeCompetencyFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateEmployeeCompetency = useMemo(() => {
		return user && hasAccess(user.scope, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.MODULE, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.RESOURCE, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.MODULE, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.RESOURCE, EMPLOYEECOMPETENCY_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateEmployeeCompetency && (
		<Button onClick={() => dispatch(openNewForm({ objKey: EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Employee Competency
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<EmployeeCompetencyTable
						setEmployeeCompetencyCount={setEmployeeCompetencyCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default EmployeeCompetencyPage;