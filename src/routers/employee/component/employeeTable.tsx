import React from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { EmployeeCard } from './employeeCard';
import EmployeeCreateController from './employeeCreateController';
import EmployeeUpdateController from './employeeUpdateController';
import EmployeeViewController from './employeeViewController';
import EMPLOYEE_CONSTANTS from '../constants';
import { useEmployeeTableConfig } from '../hooks/useEmployeeTable';
import { IEmployeeIndex } from '../interface';
import { Heart } from 'lucide-react';

/**
 * Main table component for displaying employees
 * Handles both desktop and mobile views
 */
const EmployeeTable: React.FC = () => {
	const { actions, visibleColumns, ...tableProps } = useEmployeeTableConfig();
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<>
				<MobileCardsView<IEmployeeIndex>
					{...tableProps}
					columns={visibleColumns}
					actions={actions}
					totalCount={tableProps.data.length > 0 ? undefined : 0}
					CardComponent={EmployeeCard}
					emptyStateIcon={Heart}
					loadingCardVariant="compact"
					getRecordKey={(record, index) => record.employeeId || index}
				/>
				<EmployeeCreateController />
				<EmployeeUpdateController />
				<EmployeeViewController />
				<DeleteConfirm
					handleDelete={tableProps.handleDelete}
					curObjName={EMPLOYEE_CONSTANTS.ENTITY_KEY}
					isDeleteLoading={tableProps.isDeleteLoading}
				/>
			</>
		);
	}

	return (
		<>
			<GenericTable
				{...tableProps}
				columns={visibleColumns}
				actions={actions}
				totalCount={tableProps.data.length > 0 ? undefined : 0}
			/>
			<EmployeeCreateController />
			<EmployeeUpdateController />
			<EmployeeViewController />
			<DeleteConfirm
				handleDelete={tableProps.handleDelete}
				curObjName={EMPLOYEE_CONSTANTS.ENTITY_KEY}
				isDeleteLoading={tableProps.isDeleteLoading}
			/>
		</>
	);
};

export default EmployeeTable;