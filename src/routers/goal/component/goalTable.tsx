import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { GoalCard } from './goalCard';
import GoalCreateController from './goalCreateController';
import GoalUpdateController from './goalUpdateController';
import GoalViewController from './goalViewController';
import GOAL_CONSTANTS from '../constants';
import { useGoalTableConfig } from '../hooks/useGoalTable';
import { IGoalQueryParams, IGoalIndex } from '../interface';
import { Heart } from 'lucide-react';

interface GoalTableProps {
  setGoalCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IGoalQueryParams>>;
}

const GoalTable: React.FC<GoalTableProps> = ({ setGoalCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useGoalTableConfig({
    setGoalCount,
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
        <MobileCardsView<IGoalIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={GoalCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.goalId || index}
        />
		<GoalCreateController />
		<GoalUpdateController />
		<GoalViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={GOAL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <GoalCreateController />
	  <GoalUpdateController />
	  <GoalViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={GOAL_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default GoalTable;