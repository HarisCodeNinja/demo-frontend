import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { LeaveTypeCard } from './leaveTypeCard';
import LeaveTypeCreateController from './leaveTypeCreateController';
import LeaveTypeUpdateController from './leaveTypeUpdateController';
import LeaveTypeViewController from './leaveTypeViewController';
import LEAVETYPE_CONSTANTS from '../constants';
import { useLeaveTypeTableConfig } from '../hooks/useLeaveTypeTable';
import { ILeaveTypeQueryParams, ILeaveTypeIndex } from '../interface';
import { Heart } from 'lucide-react';

interface LeaveTypeTableProps {
  setLeaveTypeCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<ILeaveTypeQueryParams>>;
}

const LeaveTypeTable: React.FC<LeaveTypeTableProps> = ({ setLeaveTypeCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useLeaveTypeTableConfig({
    setLeaveTypeCount,
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
        <MobileCardsView<ILeaveTypeIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={LeaveTypeCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.leaveTypeId || index}
        />
		<LeaveTypeCreateController />
		<LeaveTypeUpdateController />
		<LeaveTypeViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEAVETYPE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <LeaveTypeCreateController />
	  <LeaveTypeUpdateController />
	  <LeaveTypeViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={LEAVETYPE_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default LeaveTypeTable;