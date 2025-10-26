import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { PerformanceReviewCard } from './performanceReviewCard';
import PerformanceReviewCreateController from './performanceReviewCreateController';
import PerformanceReviewUpdateController from './performanceReviewUpdateController';
import PerformanceReviewViewController from './performanceReviewViewController';
import PERFORMANCEREVIEW_CONSTANTS from '../constants';
import { usePerformanceReviewTableConfig } from '../hooks/usePerformanceReviewTable';
import { IPerformanceReviewQueryParams, IPerformanceReviewIndex } from '../interface';
import { Heart } from 'lucide-react';

interface PerformanceReviewTableProps {
  setPerformanceReviewCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IPerformanceReviewQueryParams>>;
}

const PerformanceReviewTable: React.FC<PerformanceReviewTableProps> = ({ setPerformanceReviewCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = usePerformanceReviewTableConfig({
    setPerformanceReviewCount,
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
        <MobileCardsView<IPerformanceReviewIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={PerformanceReviewCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.performanceReviewId || index}
        />
		<PerformanceReviewCreateController />
		<PerformanceReviewUpdateController />
		<PerformanceReviewViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <PerformanceReviewCreateController />
	  <PerformanceReviewUpdateController />
	  <PerformanceReviewViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={PERFORMANCEREVIEW_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default PerformanceReviewTable;