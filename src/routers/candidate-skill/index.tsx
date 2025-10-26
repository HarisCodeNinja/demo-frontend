import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import CandidateSkillTable from './component/candidateSkillTable';
import CANDIDATESKILL_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const CandidateSkillPage: React.FC = () => {
	const [candidateSkillCount, setCandidateSkillCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ICandidateSkillFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateCandidateSkill = useMemo(() => {
		return user && hasAccess(user.scope, CANDIDATESKILL_CONSTANTS.PERMISSIONS.MODULE, CANDIDATESKILL_CONSTANTS.PERMISSIONS.RESOURCE, CANDIDATESKILL_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, CANDIDATESKILL_CONSTANTS.PERMISSIONS.MODULE, CANDIDATESKILL_CONSTANTS.PERMISSIONS.RESOURCE, CANDIDATESKILL_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateCandidateSkill && (
		<Button onClick={() => dispatch(openNewForm({ objKey: CANDIDATESKILL_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Candidate Skill
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{CANDIDATESKILL_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<CandidateSkillTable
						setCandidateSkillCount={setCandidateSkillCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default CandidateSkillPage;