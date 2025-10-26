import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { JobOpeningSkillCard } from './jobOpeningSkillCard';
import JobOpeningSkillCreateController from './jobOpeningSkillCreateController';
import JobOpeningSkillUpdateController from './jobOpeningSkillUpdateController';
import JobOpeningSkillViewController from './jobOpeningSkillViewController';
import JOBOPENINGSKILL_CONSTANTS from '../constants';
import { useJobOpeningSkillTableConfig } from '../hooks/useJobOpeningSkillTable';
import { IJobOpeningSkillQueryParams, IJobOpeningSkillIndex } from '../interface';
import { Heart } from 'lucide-react';

interface JobOpeningSkillTableProps {
  setJobOpeningSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IJobOpeningSkillQueryParams>>;
}

const JobOpeningSkillTable: React.FC<JobOpeningSkillTableProps> = ({ setJobOpeningSkillCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useJobOpeningSkillTableConfig({
    setJobOpeningSkillCount,
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
        <MobileCardsView<IJobOpeningSkillIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={JobOpeningSkillCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.jobOpeningSkillId || index}
        />
		<JobOpeningSkillCreateController />
		<JobOpeningSkillUpdateController />
		<JobOpeningSkillViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <JobOpeningSkillCreateController />
	  <JobOpeningSkillUpdateController />
	  <JobOpeningSkillViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={JOBOPENINGSKILL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default JobOpeningSkillTable;