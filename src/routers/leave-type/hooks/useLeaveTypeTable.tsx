import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getLeaveTypes, deleteLeaveType } from '../service';
import leaveTypeTableConfigDefault from '../data/leaveTypeTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ILeaveTypeIndex } from '../interface';
import leaveTypeConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseLeaveTypeTableConfigProps {
  setLeaveTypeCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useLeaveTypeTableConfig = ({ setLeaveTypeCount, setCurrentPageCount, filterKeys = {} }: UseLeaveTypeTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ILeaveTypeIndex>[] = useMemo(
    () => leaveTypeTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[leaveTypeConstants.TABLE_CONFIG_KEY] || {});
  const { [leaveTypeConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteLeaveType || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(leaveTypeConstants.TABLE_CONFIG_KEY, leaveTypeTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [leaveTypeConstants.QUERY_KEY, queryParams],
    queryFn: () => getLeaveTypes(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setLeaveTypeCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setLeaveTypeCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[leaveTypeConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [leaveTypeConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(leaveTypeConstants.ENTITY_KEY));
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
    (record: ILeaveTypeIndex) => {
      const id = (record as any)[leaveTypeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [leaveTypeConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveTypeConstants.LABEL_FIELD] || '',
          objKey: leaveTypeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ILeaveTypeIndex) => {
      const id = (record as any)[leaveTypeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [leaveTypeConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveTypeConstants.LABEL_FIELD] || '',
          objKey: leaveTypeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ILeaveTypeIndex) => {
      const id = (record as any)[leaveTypeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [leaveTypeConstants.PRIMARY_KEY]: id },
          label: (record as any)[leaveTypeConstants.LABEL_FIELD] || '',
          objKey: leaveTypeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ILeaveTypeIndex>[] = useMemo(() => {
    const list: TableAction<ILeaveTypeIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: leaveTypeConstants.PERMISSIONS.MODULE,
        resource: leaveTypeConstants.PERMISSIONS.RESOURCE,
        action: leaveTypeConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: leaveTypeConstants.PERMISSIONS.MODULE,
        resource: leaveTypeConstants.PERMISSIONS.RESOURCE,
        action: leaveTypeConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: leaveTypeConstants.PERMISSIONS.MODULE,
        resource: leaveTypeConstants.PERMISSIONS.RESOURCE,
        action: leaveTypeConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(leaveTypeTableConfigDefault).some((key) => (leaveTypeTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: leaveTypeConstants.ENTITY_NAME,
    entityKey: leaveTypeConstants.ENTITY_KEY,
    tableConfigKey: leaveTypeConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: leaveTypeTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const leaveTypeTableColumns: TableColumn<ILeaveTypeIndex>[] = [
  { key: 'leaveTypeId', title: 'Leave Type Id', dataIndex: 'leaveTypeId', sortable: false },
			{ key: 'typeName', title: 'Type Name', dataIndex: 'typeName', sortable: false },
			{ key: 'maxDaysPerYear', title: 'Max Days Per Year', dataIndex: 'maxDaysPerYear', sortable: false },
			{ key: 'isPaid', title: 'Is Paid', dataIndex: 'isPaid', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => value ? formatDate(value) : '-' },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => value ? formatDate(value) : '-' }
];
