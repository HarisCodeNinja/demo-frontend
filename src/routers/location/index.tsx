import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import LocationTable from './component/locationTable';
import LOCATION_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const LocationPage: React.FC = () => {
	const [locationCount, setLocationCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: ILocationFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateLocation = useMemo(() => {
		return user && hasAccess(user.scope, LOCATION_CONSTANTS.PERMISSIONS.MODULE, LOCATION_CONSTANTS.PERMISSIONS.RESOURCE, LOCATION_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, LOCATION_CONSTANTS.PERMISSIONS.MODULE, LOCATION_CONSTANTS.PERMISSIONS.RESOURCE, LOCATION_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateLocation && (
		<Button onClick={() => dispatch(openNewForm({ objKey: LOCATION_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Location
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{LOCATION_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<LocationTable
						setLocationCount={setLocationCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default LocationPage;