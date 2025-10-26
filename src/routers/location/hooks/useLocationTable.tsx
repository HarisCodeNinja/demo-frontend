import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getLocations, deleteLocation } from '../service';
import locationTableConfigDefault from '../data/locationTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ILocationIndex } from '../interface';
import locationConstants from '../constants';

interface UseLocationTableConfigProps {
  setLocationCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useLocationTableConfig = ({ setLocationCount, setCurrentPageCount, filterKeys = {} }: UseLocationTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ILocationIndex>[] = useMemo(
    () => locationTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[locationConstants.TABLE_CONFIG_KEY] || {});
  const { [locationConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteLocation || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(locationConstants.TABLE_CONFIG_KEY, locationTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [locationConstants.QUERY_KEY, queryParams],
    queryFn: () => getLocations(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setLocationCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setLocationCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[locationConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [locationConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(locationConstants.ENTITY_KEY));
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
    (record: ILocationIndex) => {
      const id = (record as any)[locationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [locationConstants.PRIMARY_KEY]: id },
          label: (record as any)[locationConstants.LABEL_FIELD] || '',
          objKey: locationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ILocationIndex) => {
      const id = (record as any)[locationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [locationConstants.PRIMARY_KEY]: id },
          label: (record as any)[locationConstants.LABEL_FIELD] || '',
          objKey: locationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ILocationIndex) => {
      const id = (record as any)[locationConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [locationConstants.PRIMARY_KEY]: id },
          label: (record as any)[locationConstants.LABEL_FIELD] || '',
          objKey: locationConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ILocationIndex>[] = useMemo(() => {
    const list: TableAction<ILocationIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: locationConstants.PERMISSIONS.MODULE,
        resource: locationConstants.PERMISSIONS.RESOURCE,
        action: locationConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: locationConstants.PERMISSIONS.MODULE,
        resource: locationConstants.PERMISSIONS.RESOURCE,
        action: locationConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: locationConstants.PERMISSIONS.MODULE,
        resource: locationConstants.PERMISSIONS.RESOURCE,
        action: locationConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(locationTableConfigDefault).some((key) => (locationTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: locationConstants.ENTITY_NAME,
    entityKey: locationConstants.ENTITY_KEY,
    tableConfigKey: locationConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: locationTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const locationTableColumns: TableColumn<ILocationIndex>[] = [
  { key: 'locationId', title: 'Location Id', dataIndex: 'locationId', sortable: false },
			{ key: 'locationName', title: 'Location Name', dataIndex: 'locationName', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false }
];
