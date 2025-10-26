import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import PerformanceReviewTable from './component/performanceReviewTable';
import PERFORMANCEREVIEW_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const PerformanceReviewPage: React.FC = () => {
	const [performanceReviewCount, setPerformanceReviewCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: IPerformanceReviewFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreatePerformanceReview = useMemo(() => {
		return user && hasAccess(user.scope, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.MODULE, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.RESOURCE, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.MODULE, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.RESOURCE, PERFORMANCEREVIEW_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreatePerformanceReview && (
		<Button onClick={() => dispatch(openNewForm({ objKey: PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Performance Review
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{PERFORMANCEREVIEW_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<PerformanceReviewTable
						setPerformanceReviewCount={setPerformanceReviewCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default PerformanceReviewPage;