import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import LearningPlanTable from './component/learningPlanTable';
import LEARNINGPLAN_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const LearningPlanPage: React.FC = () => {
	const [learningPlanCount, setLearningPlanCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ILearningPlanFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateLearningPlan = useMemo(() => {
		return user && hasAccess(user.scope, LEARNINGPLAN_CONSTANTS.PERMISSIONS.MODULE, LEARNINGPLAN_CONSTANTS.PERMISSIONS.RESOURCE, LEARNINGPLAN_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, LEARNINGPLAN_CONSTANTS.PERMISSIONS.MODULE, LEARNINGPLAN_CONSTANTS.PERMISSIONS.RESOURCE, LEARNINGPLAN_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateLearningPlan && (
		<Button onClick={() => dispatch(openNewForm({ objKey: LEARNINGPLAN_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Learning Plan
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{LEARNINGPLAN_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<LearningPlanTable
						setLearningPlanCount={setLearningPlanCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default LearningPlanPage;