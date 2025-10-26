import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import DepartmentTable from './component/departmentTable';
import DEPARTMENT_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const DepartmentPage: React.FC = () => {
	const [departmentCount, setDepartmentCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: IDepartmentFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateDepartment = useMemo(() => {
		return user && hasAccess(user.scope, DEPARTMENT_CONSTANTS.PERMISSIONS.MODULE, DEPARTMENT_CONSTANTS.PERMISSIONS.RESOURCE, DEPARTMENT_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, DEPARTMENT_CONSTANTS.PERMISSIONS.MODULE, DEPARTMENT_CONSTANTS.PERMISSIONS.RESOURCE, DEPARTMENT_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateDepartment && (
		<Button onClick={() => dispatch(openNewForm({ objKey: DEPARTMENT_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Department
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{DEPARTMENT_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<DepartmentTable
						setDepartmentCount={setDepartmentCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default DepartmentPage;