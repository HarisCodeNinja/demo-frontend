import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getJobOpenings, deleteJobOpening } from '../service';
import jobOpeningTableConfigDefault from '../data/jobOpeningTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IJobOpeningIndex } from '../interface';
import jobOpeningConstants from '../constants';

interface UseJobOpeningTableConfigProps {
  setJobOpeningCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useJobOpeningTableConfig = ({ setJobOpeningCount, setCurrentPageCount, filterKeys = {} }: UseJobOpeningTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IJobOpeningIndex>[] = useMemo(
    () => jobOpeningTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[jobOpeningConstants.TABLE_CONFIG_KEY] || {});
  const { [jobOpeningConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteJobOpening || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(jobOpeningConstants.TABLE_CONFIG_KEY, jobOpeningTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [jobOpeningConstants.QUERY_KEY, queryParams],
    queryFn: () => getJobOpenings(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setJobOpeningCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setJobOpeningCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[jobOpeningConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [jobOpeningConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(jobOpeningConstants.ENTITY_KEY));
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
    (record: IJobOpeningIndex) => {
      const id = (record as any)[jobOpeningConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [jobOpeningConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningConstants.LABEL_FIELD] || '',
          objKey: jobOpeningConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IJobOpeningIndex) => {
      const id = (record as any)[jobOpeningConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [jobOpeningConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningConstants.LABEL_FIELD] || '',
          objKey: jobOpeningConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IJobOpeningIndex) => {
      const id = (record as any)[jobOpeningConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [jobOpeningConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningConstants.LABEL_FIELD] || '',
          objKey: jobOpeningConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IJobOpeningIndex>[] = useMemo(() => {
    const list: TableAction<IJobOpeningIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: jobOpeningConstants.PERMISSIONS.MODULE,
        resource: jobOpeningConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: jobOpeningConstants.PERMISSIONS.MODULE,
        resource: jobOpeningConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: jobOpeningConstants.PERMISSIONS.MODULE,
        resource: jobOpeningConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(jobOpeningTableConfigDefault).some((key) => (jobOpeningTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: jobOpeningConstants.ENTITY_NAME,
    entityKey: jobOpeningConstants.ENTITY_KEY,
    tableConfigKey: jobOpeningConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: jobOpeningTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const jobOpeningTableColumns: TableColumn<IJobOpeningIndex>[] = [
  { key: 'jobOpeningId', title: 'Job Opening Id', dataIndex: 'jobOpeningId', sortable: false },
			{ key: 'title', title: 'Title', dataIndex: 'title', sortable: false },
			{ key: 'description', title: 'Description', dataIndex: 'description', sortable: false },
			{ key: 'departmentId', title: 'Department Id', dataIndex: 'departmentId', sortable: false },
			{ key: 'designationId', title: 'Designation Id', dataIndex: 'designationId', sortable: false },
			{ key: 'locationId', title: 'Location Id', dataIndex: 'locationId', sortable: false },
			{ key: 'requiredExperience', title: 'Required Experience', dataIndex: 'requiredExperience', sortable: false },
			{ key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
			{ key: 'publishedAt', title: 'Published At', dataIndex: 'publishedAt', sortable: false },
			{ key: 'closedAt', title: 'Closed At', dataIndex: 'closedAt', sortable: false },
			{ key: 'createdBy', title: 'Created By', dataIndex: 'createdBy', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false }
];
