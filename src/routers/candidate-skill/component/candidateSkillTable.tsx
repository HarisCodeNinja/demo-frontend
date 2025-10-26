import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { CandidateSkillCard } from './candidateSkillCard';
import CandidateSkillCreateController from './candidateSkillCreateController';
import CandidateSkillUpdateController from './candidateSkillUpdateController';
import CandidateSkillViewController from './candidateSkillViewController';
import CANDIDATESKILL_CONSTANTS from '../constants';
import { useCandidateSkillTableConfig } from '../hooks/useCandidateSkillTable';
import { ICandidateSkillQueryParams, ICandidateSkillIndex } from '../interface';
import { Heart } from 'lucide-react';

interface CandidateSkillTableProps {
  setCandidateSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ICandidateSkillQueryParams>>;
}

const CandidateSkillTable: React.FC<CandidateSkillTableProps> = ({ setCandidateSkillCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useCandidateSkillTableConfig({
    setCandidateSkillCount,
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
        <MobileCardsView<ICandidateSkillIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={CandidateSkillCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.candidateSkillId || index}
        />
		<CandidateSkillCreateController />
		<CandidateSkillUpdateController />
		<CandidateSkillViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={CANDIDATESKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <CandidateSkillCreateController />
	  <CandidateSkillUpdateController />
	  <CandidateSkillViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={CANDIDATESKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default CandidateSkillTable;