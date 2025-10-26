import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { hasAccess } from '@/util/AccessControl';
import DocumentTable from './component/documentTable';
import DOCUMENT_CONSTANTS from './constants';
import { openNewForm } from '@/store/slice/selectedObjSlice';

const DocumentPage: React.FC = () => {
	const [documentCount, setDocumentCount] = useState<number | null>(null);
	const [currentPageCount, setCurrentPageCount] = useState<number>(0);
	const [currentQueryParams, setCurrentQueryParams] = useState<Record<string, any>>({});
	

	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.session.user);

	const handleFiltersChange = useCallback((filters: IDocumentFilters) => {
		setFilterKeys(filters);
	}, []);

	const canCreateDocument = useMemo(() => {
		return user && hasAccess(user.scope, DOCUMENT_CONSTANTS.PERMISSIONS.MODULE, DOCUMENT_CONSTANTS.PERMISSIONS.RESOURCE, DOCUMENT_CONSTANTS.PERMISSIONS.ACTIONS.EDIT);
	}, [user]);

	const canExportImport = useMemo(() => {
		return user && hasAccess(user.scope, DOCUMENT_CONSTANTS.PERMISSIONS.MODULE, DOCUMENT_CONSTANTS.PERMISSIONS.RESOURCE, DOCUMENT_CONSTANTS.PERMISSIONS.ACTIONS.VIEW);
	}, [user]);

	const newButton = canCreateDocument && (
		<Button onClick={() => dispatch(openNewForm({ objKey: DOCUMENT_CONSTANTS.ENTITY_KEY }))}>
			<Plus className="size-6 me-2" />
			New Document
		</Button>
	);
	return (
		<>
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
					<CardTitle className="text-xl">{DOCUMENT_CONSTANTS.ENTITY_NAME_PLURAL}</CardTitle>
					<div className="flex flex-col sm:flex-row gap-2">
						{newButton}
					</div>
				</CardHeader>

				<CardContent>
					
					<DocumentTable
						setDocumentCount={setDocumentCount}
						setCurrentPageCount={setCurrentPageCount}
						setCurrentQueryParams={setCurrentQueryParams}
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default DocumentPage;