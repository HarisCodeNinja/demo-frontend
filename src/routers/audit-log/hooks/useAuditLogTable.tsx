import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getAuditLogs, deleteAuditLog } from '../service';
import auditLogTableConfigDefault from '../data/auditLogTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IAuditLogIndex } from '../interface';
import auditLogConstants from '../constants';
import { formatDate, formatDateTime } from '@/util/Time';
import { JSONValueRenderer } from '@/components/common/JSONValueRenderer';

interface UseAuditLogTableConfigProps {
  setAuditLogCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useAuditLogTableConfig = ({ setAuditLogCount, setCurrentPageCount, filterKeys = {} }: UseAuditLogTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IAuditLogIndex>[] = useMemo(() => auditLogTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[auditLogConstants.TABLE_CONFIG_KEY] || {});
  const { [auditLogConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteAuditLog || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(auditLogConstants.TABLE_CONFIG_KEY, auditLogTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [auditLogConstants.QUERY_KEY, queryParams],
    queryFn: () => getAuditLogs(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setAuditLogCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setAuditLogCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[auditLogConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [auditLogConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(auditLogConstants.ENTITY_KEY));
  }, [deleteEntityMutation, primaryKeys, dispatch, queryParams, queryClient]);

  const visibleColumns = useMemo(() => {
    return columns.filter((column) => {
      const isVisible = (tableConfiguration as any)[column.key as keyof typeof tableConfiguration];
      return isVisible !== undefined ? isVisible : true;
    });
  }, [columns, tableConfiguration]);

  const totalPages = Math.ceil((entityPager?.meta?.total || 0) / pager.pageSize);
  const showPagination = (entityPager?.meta?.total || 0) > pager.pageSize;

  const handleDeleteAction = useCallback(
    (record: IAuditLogIndex) => {
      const id = (record as any)[auditLogConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [auditLogConstants.PRIMARY_KEY]: id },
          label: (record as any)[auditLogConstants.LABEL_FIELD] || '',
          objKey: auditLogConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IAuditLogIndex) => {
      const id = (record as any)[auditLogConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [auditLogConstants.PRIMARY_KEY]: id },
          label: (record as any)[auditLogConstants.LABEL_FIELD] || '',
          objKey: auditLogConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IAuditLogIndex) => {
      const id = (record as any)[auditLogConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [auditLogConstants.PRIMARY_KEY]: id },
          label: (record as any)[auditLogConstants.LABEL_FIELD] || '',
          objKey: auditLogConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IAuditLogIndex>[] = useMemo(() => {
    const list: TableAction<IAuditLogIndex>[] = [];

    list.push(
      {
        key: 'view',
        icon: <Eye className="size-4" />,
        onClick: handleView,
        permission: {
          scope: user?.scope || '',
          module: auditLogConstants.PERMISSIONS.MODULE,
          resource: auditLogConstants.PERMISSIONS.RESOURCE,
          action: auditLogConstants.PERMISSIONS.ACTIONS.VIEW,
        },
      },
      {
        key: 'edit',
        icon: <Edit className="size-4" />,
        onClick: handleEdit,
        permission: {
          scope: user?.scope || '',
          module: auditLogConstants.PERMISSIONS.MODULE,
          resource: auditLogConstants.PERMISSIONS.RESOURCE,
          action: auditLogConstants.PERMISSIONS.ACTIONS.EDIT,
        },
      },
      {
        key: 'delete',
        icon: <Trash2 className="size-4 text-red-500" />,
        onClick: handleDeleteAction,
        className: 'text-red-500',
        permission: {
          scope: user?.scope || '',
          module: auditLogConstants.PERMISSIONS.MODULE,
          resource: auditLogConstants.PERMISSIONS.RESOURCE,
          action: auditLogConstants.PERMISSIONS.ACTIONS.DELETE,
        },
      },
    );

    return list;
  }, [handleEdit, handleDeleteAction, handleView, user]);

  return {
    data: entityPager?.data || [],
    isLoading,
    totalPages,
    showPagination,
    visibleColumns,
    pager,
    setPager,
    queryParams,
    handleSort,
    getSortDirection,
    getSortIndex,
    isConfigModified: Object.keys(auditLogTableConfigDefault).some((key) => (auditLogTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: auditLogConstants.ENTITY_NAME,
    entityKey: auditLogConstants.ENTITY_KEY,
    tableConfigKey: auditLogConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: auditLogTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const auditLogTableColumns: TableColumn<IAuditLogIndex>[] = [
  { key: 'auditLogId', title: 'Audit Log Id', dataIndex: 'auditLogId', sortable: false },
  // { key: 'userId', title: 'User Id', dataIndex: 'userId', sortable: false },
  { key: 'action', title: 'Action', dataIndex: 'action', sortable: false },
  { key: 'tableName', title: 'Table Name', dataIndex: 'tableName', sortable: false },
  { key: 'recordId', title: 'Record Id', dataIndex: 'recordId', sortable: false },
  {
    key: 'oldValue',
    title: 'Old Value',
    dataIndex: 'oldValue',
    sortable: false,
    render: (value) => <JSONValueRenderer value={value} />,
  },
  {
    key: 'newValue',
    title: 'New Value',
    dataIndex: 'newValue',
    sortable: false,
    render: (value) => <JSONValueRenderer value={value} />,
  },
  { key: 'ipAddress', title: 'Ip Address', dataIndex: 'ipAddress', sortable: false },
  { key: 'timestamp', title: 'Timestamp', dataIndex: 'timestamp', sortable: false, render: (value) => (value ? formatDateTime(value) : '-') },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
