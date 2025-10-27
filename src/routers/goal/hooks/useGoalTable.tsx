import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getGoals, deleteGoal } from '../service';
import goalTableConfigDefault from '../data/goalTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IGoalIndex } from '../interface';
import goalConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseGoalTableConfigProps {
  setGoalCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useGoalTableConfig = ({ setGoalCount, setCurrentPageCount, filterKeys = {} }: UseGoalTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IGoalIndex>[] = useMemo(() => goalTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[goalConstants.TABLE_CONFIG_KEY] || {});
  const { [goalConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteGoal || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(goalConstants.TABLE_CONFIG_KEY, goalTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [goalConstants.QUERY_KEY, queryParams],
    queryFn: () => getGoals(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setGoalCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setGoalCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[goalConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [goalConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(goalConstants.ENTITY_KEY));
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
    (record: IGoalIndex) => {
      const id = (record as any)[goalConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [goalConstants.PRIMARY_KEY]: id },
          label: (record as any)[goalConstants.LABEL_FIELD] || '',
          objKey: goalConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IGoalIndex) => {
      const id = (record as any)[goalConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [goalConstants.PRIMARY_KEY]: id },
          label: (record as any)[goalConstants.LABEL_FIELD] || '',
          objKey: goalConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IGoalIndex) => {
      const id = (record as any)[goalConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [goalConstants.PRIMARY_KEY]: id },
          label: (record as any)[goalConstants.LABEL_FIELD] || '',
          objKey: goalConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IGoalIndex>[] = useMemo(() => {
    const list: TableAction<IGoalIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: goalConstants.PERMISSIONS.MODULE,
        resource: goalConstants.PERMISSIONS.RESOURCE,
        action: goalConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: goalConstants.PERMISSIONS.MODULE,
        resource: goalConstants.PERMISSIONS.RESOURCE,
        action: goalConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: goalConstants.PERMISSIONS.MODULE,
        resource: goalConstants.PERMISSIONS.RESOURCE,
        action: goalConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(goalTableConfigDefault).some((key) => (goalTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: goalConstants.ENTITY_NAME,
    entityKey: goalConstants.ENTITY_KEY,
    tableConfigKey: goalConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: goalTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const goalTableColumns: TableColumn<IGoalIndex>[] = [
  { key: 'goalId', title: 'Goal Id', dataIndex: 'goalId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'title', title: 'Title', dataIndex: 'title', sortable: false },
  { key: 'description', title: 'Description', dataIndex: 'description', sortable: false },
  { key: 'kpi', title: 'Kpi', dataIndex: 'kpi', sortable: false },
  { key: 'period', title: 'Period', dataIndex: 'period', sortable: false },
  { key: 'startDate', title: 'Start Date', dataIndex: 'startDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'endDate', title: 'End Date', dataIndex: 'endDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  // { key: 'assignedBy', title: 'Assigned By', dataIndex: 'assignedBy', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
