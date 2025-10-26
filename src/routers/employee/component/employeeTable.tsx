import React, { useEffect, useRef } from 'react';
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
import { IEmployeeQueryParams, IEmployeeIndex } from '../interface';
import { Heart } from 'lucide-react';

interface EmployeeTableProps {
  setEmployeeCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IEmployeeQueryParams>>;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ setEmployeeCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useEmployeeTableConfig({
    setEmployeeCount,
    setCurrentPageCount,
  });
  const isMobile = useIsMobile();
  const prevQueryParamsRef = useRef<string>(null);

  useEffect(() => {
    if (!setCurrentQueryParams) return;

    const queryParamsStr = JSON.stringify(queryParams);
    if (prevQueryParamsRef.current !== queryParamsStr) {
      prevQueryParamsRef.current = queryParamsStr;
      setCurrentQueryParams(queryParams);
    }
  }, [queryParams, setCurrentQueryParams]);

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
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={EMPLOYEE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={EMPLOYEE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default EmployeeTable;