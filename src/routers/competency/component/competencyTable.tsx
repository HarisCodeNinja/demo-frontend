import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { CompetencyCard } from './competencyCard';
import CompetencyCreateController from './competencyCreateController';
import CompetencyUpdateController from './competencyUpdateController';
import CompetencyViewController from './competencyViewController';
import COMPETENCY_CONSTANTS from '../constants';
import { useCompetencyTableConfig } from '../hooks/useCompetencyTable';
import { ICompetencyQueryParams, ICompetencyIndex } from '../interface';
import { Heart } from 'lucide-react';

interface CompetencyTableProps {
  setCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ICompetencyQueryParams>>;
}

const CompetencyTable: React.FC<CompetencyTableProps> = ({ setCompetencyCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useCompetencyTableConfig({
    setCompetencyCount,
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
        <MobileCardsView<ICompetencyIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={CompetencyCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.competencyId || index}
        />
		<CompetencyCreateController />
		<CompetencyUpdateController />
		<CompetencyViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={COMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <CompetencyCreateController />
	  <CompetencyUpdateController />
	  <CompetencyViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={COMPETENCY_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default CompetencyTable;