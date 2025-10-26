import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { CandidateCard } from './candidateCard';
import CandidateCreateController from './candidateCreateController';
import CandidateUpdateController from './candidateUpdateController';
import CandidateViewController from './candidateViewController';
import CANDIDATE_CONSTANTS from '../constants';
import { useCandidateTableConfig } from '../hooks/useCandidateTable';
import { ICandidateQueryParams, ICandidateIndex } from '../interface';
import { Heart } from 'lucide-react';

interface CandidateTableProps {
  setCandidateCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ICandidateQueryParams>>;
}

const CandidateTable: React.FC<CandidateTableProps> = ({ setCandidateCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useCandidateTableConfig({
    setCandidateCount,
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
        <MobileCardsView<ICandidateIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={CandidateCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.candidateId || index}
        />
		<CandidateCreateController />
		<CandidateUpdateController />
		<CandidateViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={CANDIDATE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <CandidateCreateController />
	  <CandidateUpdateController />
	  <CandidateViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={CANDIDATE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default CandidateTable;