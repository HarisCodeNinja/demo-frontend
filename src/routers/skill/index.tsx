import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import SkillTable from './component/skillTable';
import SKILL_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const SkillPage: React.FC = () => {
	const [skillCount, setSkillCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ISkillFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateSkill = useMemo(() => {
		return user && hasAccess(user.scope, SKILL_CONSTANTS.PERMISSIONS.MODULE, SKILL_CONSTANTS.PERMISSIONS.RESOURCE, SKILL_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, SKILL_CONSTANTS.PERMISSIONS.MODULE, SKILL_CONSTANTS.PERMISSIONS.RESOURCE, SKILL_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateSkill && (
		<Button onClick={() => dispatch(openNewForm({ objKey: SKILL_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Skill
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{SKILL_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<SkillTable
						setSkillCount={setSkillCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default SkillPage;