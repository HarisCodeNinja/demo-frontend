import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getLearningPlans, deleteLearningPlan } from '../service';
import learningPlanTableConfigDefault from '../data/learningPlanTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ILearningPlanIndex } from '../interface';
import learningPlanConstants from '../constants';

interface UseLearningPlanTableConfigProps {
  setLearningPlanCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useLearningPlanTableConfig = ({ setLearningPlanCount, setCurrentPageCount, filterKeys = {} }: UseLearningPlanTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ILearningPlanIndex>[] = useMemo(
    () => learningPlanTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[learningPlanConstants.TABLE_CONFIG_KEY] || {});
  const { [learningPlanConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteLearningPlan || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(learningPlanConstants.TABLE_CONFIG_KEY, learningPlanTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [learningPlanConstants.QUERY_KEY, queryParams],
    queryFn: () => getLearningPlans(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setLearningPlanCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setLearningPlanCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[learningPlanConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [learningPlanConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(learningPlanConstants.ENTITY_KEY));
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
    (record: ILearningPlanIndex) => {
      const id = (record as any)[learningPlanConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [learningPlanConstants.PRIMARY_KEY]: id },
          label: (record as any)[learningPlanConstants.LABEL_FIELD] || '',
          objKey: learningPlanConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ILearningPlanIndex) => {
      const id = (record as any)[learningPlanConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [learningPlanConstants.PRIMARY_KEY]: id },
          label: (record as any)[learningPlanConstants.LABEL_FIELD] || '',
          objKey: learningPlanConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ILearningPlanIndex) => {
      const id = (record as any)[learningPlanConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [learningPlanConstants.PRIMARY_KEY]: id },
          label: (record as any)[learningPlanConstants.LABEL_FIELD] || '',
          objKey: learningPlanConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ILearningPlanIndex>[] = useMemo(() => {
    const list: TableAction<ILearningPlanIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: learningPlanConstants.PERMISSIONS.MODULE,
        resource: learningPlanConstants.PERMISSIONS.RESOURCE,
        action: learningPlanConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: learningPlanConstants.PERMISSIONS.MODULE,
        resource: learningPlanConstants.PERMISSIONS.RESOURCE,
        action: learningPlanConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: learningPlanConstants.PERMISSIONS.MODULE,
        resource: learningPlanConstants.PERMISSIONS.RESOURCE,
        action: learningPlanConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(learningPlanTableConfigDefault).some((key) => (learningPlanTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: learningPlanConstants.ENTITY_NAME,
    entityKey: learningPlanConstants.ENTITY_KEY,
    tableConfigKey: learningPlanConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: learningPlanTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const learningPlanTableColumns: TableColumn<ILearningPlanIndex>[] = [
  { key: 'learningPlanId', title: 'Learning Plan Id', dataIndex: 'learningPlanId', sortable: false },
			{ key: 'employeeId', title: 'Employee Id', dataIndex: 'employeeId', sortable: false },
			{ key: 'title', title: 'Title', dataIndex: 'title', sortable: false },
			{ key: 'description', title: 'Description', dataIndex: 'description', sortable: false },
			{ key: 'startDate', title: 'Start Date', dataIndex: 'startDate', sortable: false },
			{ key: 'endDate', title: 'End Date', dataIndex: 'endDate', sortable: false },
			{ key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
			{ key: 'assignedBy', title: 'Assigned By', dataIndex: 'assignedBy', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false }
];
