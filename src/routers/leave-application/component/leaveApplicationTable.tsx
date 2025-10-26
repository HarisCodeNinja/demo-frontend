import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { LeaveApplicationCard } from './leaveApplicationCard';
import LeaveApplicationCreateController from './leaveApplicationCreateController';
import LeaveApplicationUpdateController from './leaveApplicationUpdateController';
import LeaveApplicationViewController from './leaveApplicationViewController';
import LEAVEAPPLICATION_CONSTANTS from '../constants';
import { useLeaveApplicationTableConfig } from '../hooks/useLeaveApplicationTable';
import { ILeaveApplicationQueryParams, ILeaveApplicationIndex } from '../interface';
import { Heart } from 'lucide-react';

interface LeaveApplicationTableProps {
  setLeaveApplicationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ILeaveApplicationQueryParams>>;
}

const LeaveApplicationTable: React.FC<LeaveApplicationTableProps> = ({ setLeaveApplicationCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useLeaveApplicationTableConfig({
    setLeaveApplicationCount,
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
        <MobileCardsView<ILeaveApplicationIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={LeaveApplicationCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.leaveApplicationId || index}
        />
		<LeaveApplicationCreateController />
		<LeaveApplicationUpdateController />
		<LeaveApplicationViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <LeaveApplicationCreateController />
	  <LeaveApplicationUpdateController />
	  <LeaveApplicationViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEAVEAPPLICATION_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default LeaveApplicationTable;