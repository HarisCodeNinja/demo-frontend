import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { resetSelectedObj } from '@/store/slice/selectedObjSlice';
import Controls from '@/components/Wrapper/controls';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui';
import { getAuditLogDetails } from '../service';
import AUDITLOG_CONSTANTS from '../constants';

interface ViewProps {}

const AuditLogViewController: React.FC<ViewProps> = ({}) => {
  const { [AUDITLOG_CONSTANTS.ENTITY_KEY]: { showView, primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const dispatch = useAppDispatch();

  const { data: auditLog, isLoading } = useQuery({
    queryKey: [AUDITLOG_CONSTANTS.QUERY_KEY, primaryKeys, primaryKeys?.auditLogId, showView],
    queryFn: () => getAuditLogDetails(primaryKeys?.auditLogId || 0),
    enabled: Boolean(showView && primaryKeys?.auditLogId),
  });

  const handleClose = React.useCallback(() => {
    dispatch(resetSelectedObj(AUDITLOG_CONSTANTS.ENTITY_KEY));
  }, [dispatch]);

  const Content = () => (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-10 h-1/2">
          <Spinner />
        </div>
      )}
      {!isLoading && auditLog && (
        <div className="grid grid-cols-1 gap-6 items-start">
        <div className="space-y-2">
          <Label>Audit Log Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.auditLogId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>User Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.userId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Action</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.action ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Table Name</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.tableName ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Record Id</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.recordId ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Old Value</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.oldValue ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>New Value</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.newValue ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Ip Address</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.ipAddress ?? '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Timestamp</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.timestamp ? new Date(auditLog?.data?.timestamp).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Created At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.createdAt ? new Date(auditLog?.data?.createdAt).toLocaleDateString() : '-'}</div>
        </div>
        <div className="space-y-2">
          <Label>Updated At</Label>
          <div className="flex items-center text-sm bg-muted p-3 rounded-md">{auditLog?.data?.updatedAt ? new Date(auditLog?.data?.updatedAt).toLocaleDateString() : '-'}</div>
        </div>
        </div>
      )}
    </>
  );

  return (
    <Controls
      title={`${AUDITLOG_CONSTANTS.ENTITY_NAME} Details`}
      open={showView}
      onClose={handleClose}
      type="modal"
      width={800}
      loading={isLoading}
    >
      <Content />
    </Controls>
  );
};

export default AuditLogViewController;