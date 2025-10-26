import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import CompetencyTable from './component/competencyTable';
import COMPETENCY_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const CompetencyPage: React.FC = () => {
	const [competencyCount, setCompetencyCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ICompetencyFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateCompetency = useMemo(() => {
		return user && hasAccess(user.scope, COMPETENCY_CONSTANTS.PERMISSIONS.MODULE, COMPETENCY_CONSTANTS.PERMISSIONS.RESOURCE, COMPETENCY_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, COMPETENCY_CONSTANTS.PERMISSIONS.MODULE, COMPETENCY_CONSTANTS.PERMISSIONS.RESOURCE, COMPETENCY_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateCompetency && (
		<Button onClick={() => dispatch(openNewForm({ objKey: COMPETENCY_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Competency
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{COMPETENCY_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<CompetencyTable
						setCompetencyCount={setCompetencyCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default CompetencyPage;