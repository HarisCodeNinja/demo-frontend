import React, { useEffect, useRef } from 'react';
import GenericTable from '@/components/Table';
import DeleteConfirm from '@/components/DeleteConfirm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileCardsView from '@/components/MobileCardsView';
import { AuditLogCard } from './auditLogCard';
import AuditLogCreateController from './auditLogCreateController';
import AuditLogUpdateController from './auditLogUpdateController';
import AuditLogViewController from './auditLogViewController';
import AUDITLOG_CONSTANTS from '../constants';
import { useAuditLogTableConfig } from '../hooks/useAuditLogTable';
import { IAuditLogQueryParams, IAuditLogIndex } from '../interface';
import { Heart } from 'lucide-react';

interface AuditLogTableProps {
  setAuditLogCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentQueryParams?: React.Dispatch<React.SetStateAction<IAuditLogQueryParams>>;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ setAuditLogCount, setCurrentPageCount, setCurrentQueryParams }) => {
  const { actions, columns, visibleColumns, queryParams, ...tableProps } = useAuditLogTableConfig({
    setAuditLogCount,
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
        <MobileCardsView<IAuditLogIndex>
          {...tableProps}
          columns={visibleColumns}
          actions={actions}
          totalCount={tableProps.data.length > 0 ? undefined : 0}
          CardComponent={AuditLogCard}
          emptyStateIcon={Heart}
          loadingCardVariant="compact"
          getRecordKey={(record, index) => record.auditLogId || index}
        />
		<AuditLogCreateController />
		<AuditLogUpdateController />
		<AuditLogViewController />
		<DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={AUDITLOG_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
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
	  <AuditLogCreateController />
	  <AuditLogUpdateController />
	  <AuditLogViewController />
	  <DeleteConfirm handleDelete={tableProps.handleDelete} curObjName={AUDITLOG_CONSTANTS.ENTITY_KEY} isDeleteLoading={tableProps.isDeleteLoading} />
    </>
  );
};

export default AuditLogTable;