import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { InterviewCard } from './interviewCard';
import InterviewCreateController from './interviewCreateController';
import InterviewUpdateController from './interviewUpdateController';
import InterviewViewController from './interviewViewController';
import INTERVIEW_CONSTANTS from '../constants';
import { useInterviewTableConfig } from '../hooks/useInterviewTable';
import { IInterviewQueryParams, IInterviewIndex } from '../interface';
import { Heart } from 'lucide-react';

interface InterviewTableProps {
  setInterviewCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IInterviewQueryParams>>;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ setInterviewCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useInterviewTableConfig({
    setInterviewCount,
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
        <MobileCardsView<IInterviewIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={InterviewCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.interviewId || index}
        />
		<InterviewCreateController />
		<InterviewUpdateController />
		<InterviewViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={INTERVIEW_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <InterviewCreateController />
	  <InterviewUpdateController />
	  <InterviewViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={INTERVIEW_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default InterviewTable;