import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getJobLevels, deleteJobLevel } from '../service';
import jobLevelTableConfigDefault from '../data/jobLevelTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IJobLevelIndex } from '../interface';
import jobLevelConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseJobLevelTableConfigProps {
  setJobLevelCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useJobLevelTableConfig = ({ setJobLevelCount, setCurrentPageCount, filterKeys = {} }: UseJobLevelTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IJobLevelIndex>[] = useMemo(
    () => jobLevelTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[jobLevelConstants.TABLE_CONFIG_KEY] || {});
  const { [jobLevelConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteJobLevel || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(jobLevelConstants.TABLE_CONFIG_KEY, jobLevelTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [jobLevelConstants.QUERY_KEY, queryParams],
    queryFn: () => getJobLevels(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setJobLevelCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setJobLevelCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[jobLevelConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [jobLevelConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(jobLevelConstants.ENTITY_KEY));
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
    (record: IJobLevelIndex) => {
      const id = (record as any)[jobLevelConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [jobLevelConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobLevelConstants.LABEL_FIELD] || '',
          objKey: jobLevelConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IJobLevelIndex) => {
      const id = (record as any)[jobLevelConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [jobLevelConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobLevelConstants.LABEL_FIELD] || '',
          objKey: jobLevelConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IJobLevelIndex) => {
      const id = (record as any)[jobLevelConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [jobLevelConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobLevelConstants.LABEL_FIELD] || '',
          objKey: jobLevelConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IJobLevelIndex>[] = useMemo(() => {
    const list: TableAction<IJobLevelIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: jobLevelConstants.PERMISSIONS.MODULE,
        resource: jobLevelConstants.PERMISSIONS.RESOURCE,
        action: jobLevelConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: jobLevelConstants.PERMISSIONS.MODULE,
        resource: jobLevelConstants.PERMISSIONS.RESOURCE,
        action: jobLevelConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: jobLevelConstants.PERMISSIONS.MODULE,
        resource: jobLevelConstants.PERMISSIONS.RESOURCE,
        action: jobLevelConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(jobLevelTableConfigDefault).some((key) => (jobLevelTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: jobLevelConstants.ENTITY_NAME,
    entityKey: jobLevelConstants.ENTITY_KEY,
    tableConfigKey: jobLevelConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: jobLevelTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const jobLevelTableColumns: TableColumn<IJobLevelIndex>[] = [
  { key: 'jobLevelId', title: 'Job Level Id', dataIndex: 'jobLevelId', sortable: false },
			{ key: 'levelName', title: 'Level Name', dataIndex: 'levelName', sortable: false },
			{ key: 'description', title: 'Description', dataIndex: 'description', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => value ? formatDate(value) : '-' },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => value ? formatDate(value) : '-' }
];
