import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import LeaveTypeTable from './component/leaveTypeTable';
import LEAVETYPE_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const LeaveTypePage: React.FC = () => {
	const [leaveTypeCount, setLeaveTypeCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ILeaveTypeFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateLeaveType = useMemo(() => {
		return user && hasAccess(user.scope, LEAVETYPE_CONSTANTS.PERMISSIONS.MODULE, LEAVETYPE_CONSTANTS.PERMISSIONS.RESOURCE, LEAVETYPE_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, LEAVETYPE_CONSTANTS.PERMISSIONS.MODULE, LEAVETYPE_CONSTANTS.PERMISSIONS.RESOURCE, LEAVETYPE_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateLeaveType && (
		<Button onClick={() => dispatch(openNewForm({ objKey: LEAVETYPE_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Leave Type
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{LEAVETYPE_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<LeaveTypeTable
						setLeaveTypeCount={setLeaveTypeCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default LeaveTypePage;