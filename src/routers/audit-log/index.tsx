import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import AuditLogTable from './component/auditLogTable';
import AUDITLOG_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const AuditLogPage: React.FC = () => {
	const [auditLogCount, setAuditLogCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: IAuditLogFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateAuditLog = useMemo(() => {
		return user && hasAccess(user.scope, AUDITLOG_CONSTANTS.PERMISSIONS.MODULE, AUDITLOG_CONSTANTS.PERMISSIONS.RESOURCE, AUDITLOG_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, AUDITLOG_CONSTANTS.PERMISSIONS.MODULE, AUDITLOG_CONSTANTS.PERMISSIONS.RESOURCE, AUDITLOG_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateAuditLog && (
		<Button onClick={() => dispatch(openNewForm({ objKey: AUDITLOG_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Audit Log
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{AUDITLOG_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<AuditLogTable
						setAuditLogCount={setAuditLogCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default AuditLogPage;