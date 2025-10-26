import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { JobOpeningCard } from './jobOpeningCard';
import JobOpeningCreateController from './jobOpeningCreateController';
import JobOpeningUpdateController from './jobOpeningUpdateController';
import JobOpeningViewController from './jobOpeningViewController';
import JOBOPENING_CONSTANTS from '../constants';
import { useJobOpeningTableConfig } from '../hooks/useJobOpeningTable';
import { IJobOpeningQueryParams, IJobOpeningIndex } from '../interface';
import { Heart } from 'lucide-react';

interface JobOpeningTableProps {
  setJobOpeningCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IJobOpeningQueryParams>>;
}

const JobOpeningTable: React.FC<JobOpeningTableProps> = ({ setJobOpeningCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useJobOpeningTableConfig({
    setJobOpeningCount,
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
        <MobileCardsView<IJobOpeningIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={JobOpeningCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.jobOpeningId || index}
        />
		<JobOpeningCreateController />
		<JobOpeningUpdateController />
		<JobOpeningViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBOPENING_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <JobOpeningCreateController />
	  <JobOpeningUpdateController />
	  <JobOpeningViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBOPENING_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default JobOpeningTable;