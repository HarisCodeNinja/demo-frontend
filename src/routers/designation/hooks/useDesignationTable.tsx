import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getDesignations, deleteDesignation } from '../service';
import designationTableConfigDefault from '../data/designationTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IDesignationIndex } from '../interface';
import designationConstants from '../constants';

interface UseDesignationTableConfigProps {
  setDesignationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useDesignationTableConfig = ({ setDesignationCount, setCurrentPageCount, filterKeys = {} }: UseDesignationTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IDesignationIndex>[] = useMemo(
    () => designationTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[designationConstants.TABLE_CONFIG_KEY] || {});
  const { [designationConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteDesignation || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(designationConstants.TABLE_CONFIG_KEY, designationTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [designationConstants.QUERY_KEY, queryParams],
    queryFn: () => getDesignations(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setDesignationCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setDesignationCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[designationConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [designationConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(designationConstants.ENTITY_KEY));
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
    (record: IDesignationIndex) => {
      const id = (record as any)[designationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [designationConstants.PRIMARY_KEY]: id },
          label: (record as any)[designationConstants.LABEL_FIELD] || '',
          objKey: designationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IDesignationIndex) => {
      const id = (record as any)[designationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [designationConstants.PRIMARY_KEY]: id },
          label: (record as any)[designationConstants.LABEL_FIELD] || '',
          objKey: designationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IDesignationIndex) => {
      const id = (record as any)[designationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [designationConstants.PRIMARY_KEY]: id },
          label: (record as any)[designationConstants.LABEL_FIELD] || '',
          objKey: designationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IDesignationIndex>[] = useMemo(() => {
    const list: TableAction<IDesignationIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: designationConstants.PERMISSIONS.MODULE,
        resource: designationConstants.PERMISSIONS.RESOURCE,
        action: designationConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: designationConstants.PERMISSIONS.MODULE,
        resource: designationConstants.PERMISSIONS.RESOURCE,
        action: designationConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: designationConstants.PERMISSIONS.MODULE,
        resource: designationConstants.PERMISSIONS.RESOURCE,
        action: designationConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(designationTableConfigDefault).some((key) => (designationTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: designationConstants.ENTITY_NAME,
    entityKey: designationConstants.ENTITY_KEY,
    tableConfigKey: designationConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: designationTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const designationTableColumns: TableColumn<IDesignationIndex>[] = [
  { key: 'designationId', title: 'Designation Id', dataIndex: 'designationId', sortable: false },
			{ key: 'designationName', title: 'Designation Name', dataIndex: 'designationName', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false }
];
