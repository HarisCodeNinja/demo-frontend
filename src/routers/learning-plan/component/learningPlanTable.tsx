import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { LearningPlanCard } from './learningPlanCard';
import LearningPlanCreateController from './learningPlanCreateController';
import LearningPlanUpdateController from './learningPlanUpdateController';
import LearningPlanViewController from './learningPlanViewController';
import LEARNINGPLAN_CONSTANTS from '../constants';
import { useLearningPlanTableConfig } from '../hooks/useLearningPlanTable';
import { ILearningPlanQueryParams, ILearningPlanIndex } from '../interface';
import { Heart } from 'lucide-react';

interface LearningPlanTableProps {
  setLearningPlanCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ILearningPlanQueryParams>>;
}

const LearningPlanTable: React.FC<LearningPlanTableProps> = ({ setLearningPlanCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useLearningPlanTableConfig({
    setLearningPlanCount,
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
        <MobileCardsView<ILearningPlanIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={LearningPlanCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.learningPlanId || index}
        />
		<LearningPlanCreateController />
		<LearningPlanUpdateController />
		<LearningPlanViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEARNINGPLAN_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <LearningPlanCreateController />
	  <LearningPlanUpdateController />
	  <LearningPlanViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEARNINGPLAN_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default LearningPlanTable;