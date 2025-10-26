import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { JobLevelCard } from './jobLevelCard';
import JobLevelCreateController from './jobLevelCreateController';
import JobLevelUpdateController from './jobLevelUpdateController';
import JobLevelViewController from './jobLevelViewController';
import JOBLEVEL_CONSTANTS from '../constants';
import { useJobLevelTableConfig } from '../hooks/useJobLevelTable';
import { IJobLevelQueryParams, IJobLevelIndex } from '../interface';
import { Heart } from 'lucide-react';

interface JobLevelTableProps {
  setJobLevelCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IJobLevelQueryParams>>;
}

const JobLevelTable: React.FC<JobLevelTableProps> = ({ setJobLevelCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useJobLevelTableConfig({
    setJobLevelCount,
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
        <MobileCardsView<IJobLevelIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={JobLevelCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.jobLevelId || index}
        />
		<JobLevelCreateController />
		<JobLevelUpdateController />
		<JobLevelViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBLEVEL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <JobLevelCreateController />
	  <JobLevelUpdateController />
	  <JobLevelViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBLEVEL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default JobLevelTable;