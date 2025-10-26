import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { EmployeeCompetencyCard } from './employeeCompetencyCard';
import EmployeeCompetencyCreateController from './employeeCompetencyCreateController';
import EmployeeCompetencyUpdateController from './employeeCompetencyUpdateController';
import EmployeeCompetencyViewController from './employeeCompetencyViewController';
import EMPLOYEECOMPETENCY_CONSTANTS from '../constants';
import { useEmployeeCompetencyTableConfig } from '../hooks/useEmployeeCompetencyTable';
import { IEmployeeCompetencyQueryParams, IEmployeeCompetencyIndex } from '../interface';
import { Heart } from 'lucide-react';

interface EmployeeCompetencyTableProps {
  setEmployeeCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IEmployeeCompetencyQueryParams>>;
}

const EmployeeCompetencyTable: React.FC<EmployeeCompetencyTableProps> = ({ setEmployeeCompetencyCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useEmployeeCompetencyTableConfig({
    setEmployeeCompetencyCount,
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
        <MobileCardsView<IEmployeeCompetencyIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={EmployeeCompetencyCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.employeeCompetencyId || index}
        />
		<EmployeeCompetencyCreateController />
		<EmployeeCompetencyUpdateController />
		<EmployeeCompetencyViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <EmployeeCompetencyCreateController />
	  <EmployeeCompetencyUpdateController />
	  <EmployeeCompetencyViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={EMPLOYEECOMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default EmployeeCompetencyTable;