import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import LeaveApplicationTable from './component/leaveApplicationTable';
import LEAVEAPPLICATION_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const LeaveApplicationPage: React.FC = () => {
	const [leaveApplicationCount, setLeaveApplicationCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ILeaveApplicationFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateLeaveApplication = useMemo(() => {
		return user && hasAccess(user.scope, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.MODULE, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.RESOURCE, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.MODULE, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.RESOURCE, LEAVEAPPLICATION_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateLeaveApplication && (
		<Button onClick={() => dispatch(openNewForm({ objKey: LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Leave Application
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{LEAVEAPPLICATION_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<LeaveApplicationTable
						setLeaveApplicationCount={setLeaveApplicationCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default LeaveApplicationPage;