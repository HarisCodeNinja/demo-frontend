import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { SalaryStructureCard } from './salaryStructureCard';
import SalaryStructureCreateController from './salaryStructureCreateController';
import SalaryStructureUpdateController from './salaryStructureUpdateController';
import SalaryStructureViewController from './salaryStructureViewController';
import SALARYSTRUCTURE_CONSTANTS from '../constants';
import { useSalaryStructureTableConfig } from '../hooks/useSalaryStructureTable';
import { ISalaryStructureQueryParams, ISalaryStructureIndex } from '../interface';
import { Heart } from 'lucide-react';

interface SalaryStructureTableProps {
  setSalaryStructureCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ISalaryStructureQueryParams>>;
}

const SalaryStructureTable: React.FC<SalaryStructureTableProps> = ({ setSalaryStructureCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useSalaryStructureTableConfig({
    setSalaryStructureCount,
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
        <MobileCardsView<ISalaryStructureIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={SalaryStructureCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.salaryStructureId || index}
        />
		<SalaryStructureCreateController />
		<SalaryStructureUpdateController />
		<SalaryStructureViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <SalaryStructureCreateController />
	  <SalaryStructureUpdateController />
	  <SalaryStructureViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={SALARYSTRUCTURE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default SalaryStructureTable;