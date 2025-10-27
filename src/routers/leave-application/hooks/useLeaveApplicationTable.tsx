import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getLeaveApplications, deleteLeaveApplication } from '../service';
import leaveApplicationTableConfigDefault from '../data/leaveApplicationTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ILeaveApplicationIndex } from '../interface';
import leaveApplicationConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseLeaveApplicationTableConfigProps {
  setLeaveApplicationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useLeaveApplicationTableConfig = ({ setLeaveApplicationCount, setCurrentPageCount, filterKeys = {} }: UseLeaveApplicationTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ILeaveApplicationIndex>[] = useMemo(() => leaveApplicationTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[leaveApplicationConstants.TABLE_CONFIG_KEY] || {});
  const { [leaveApplicationConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteLeaveApplication || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(leaveApplicationConstants.TABLE_CONFIG_KEY, leaveApplicationTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [leaveApplicationConstants.QUERY_KEY, queryParams],
    queryFn: () => getLeaveApplications(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setLeaveApplicationCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setLeaveApplicationCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[leaveApplicationConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [leaveApplicationConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(leaveApplicationConstants.ENTITY_KEY));
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
    (record: ILeaveApplicationIndex) => {
      const id = (record as any)[leaveApplicationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [leaveApplicationConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveApplicationConstants.LABEL_FIELD] || '',
          objKey: leaveApplicationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ILeaveApplicationIndex) => {
      const id = (record as any)[leaveApplicationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [leaveApplicationConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveApplicationConstants.LABEL_FIELD] || '',
          objKey: leaveApplicationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ILeaveApplicationIndex) => {
      const id = (record as any)[leaveApplicationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [leaveApplicationConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveApplicationConstants.LABEL_FIELD] || '',
          objKey: leaveApplicationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ILeaveApplicationIndex>[] = useMemo(() => {
    const list: TableAction<ILeaveApplicationIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: leaveApplicationConstants.PERMISSIONS.MODULE,
        resource: leaveApplicationConstants.PERMISSIONS.RESOURCE,
        action: leaveApplicationConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: leaveApplicationConstants.PERMISSIONS.MODULE,
        resource: leaveApplicationConstants.PERMISSIONS.RESOURCE,
        action: leaveApplicationConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: leaveApplicationConstants.PERMISSIONS.MODULE,
        resource: leaveApplicationConstants.PERMISSIONS.RESOURCE,
        action: leaveApplicationConstants.PERMISSIONS.ACTIONS.DELETE,
      },
    });

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
    isConfigModified: Object.keys(leaveApplicationTableConfigDefault).some(
      (key) => (leaveApplicationTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: leaveApplicationConstants.ENTITY_NAME,
    entityKey: leaveApplicationConstants.ENTITY_KEY,
    tableConfigKey: leaveApplicationConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: leaveApplicationTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const leaveApplicationTableColumns: TableColumn<ILeaveApplicationIndex>[] = [
  { key: 'leaveApplicationId', title: 'Leave Application Id', dataIndex: 'leaveApplicationId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'leaveType', title: 'Leave Type', dataIndex: 'typeName', sortable: false },
  { key: 'startDate', title: 'Start Date', dataIndex: 'startDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'endDate', title: 'End Date', dataIndex: 'endDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'numberOfDay', title: 'Number Of Day', dataIndex: 'numberOfDay', sortable: false },
  { key: 'reason', title: 'Reason', dataIndex: 'reason', sortable: false },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  // { key: 'appliedBy', title: 'Applied By', dataIndex: 'appliedBy', sortable: false },
  // { key: 'approvedBy', title: 'Approved By', dataIndex: 'approvedBy', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
