import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import CandidateTable from './component/candidateTable';
import CANDIDATE_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const CandidatePage: React.FC = () => {
	const [candidateCount, setCandidateCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ICandidateFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateCandidate = useMemo(() => {
		return user && hasAccess(user.scope, CANDIDATE_CONSTANTS.PERMISSIONS.MODULE, CANDIDATE_CONSTANTS.PERMISSIONS.RESOURCE, CANDIDATE_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, CANDIDATE_CONSTANTS.PERMISSIONS.MODULE, CANDIDATE_CONSTANTS.PERMISSIONS.RESOURCE, CANDIDATE_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateCandidate && (
		<Button onClick={() => dispatch(openNewForm({ objKey: CANDIDATE_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Candidate
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{CANDIDATE_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<CandidateTable
						setCandidateCount={setCandidateCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default CandidatePage;