import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getDepartments, deleteDepartment } from '../service';
import departmentTableConfigDefault from '../data/departmentTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IDepartmentIndex } from '../interface';
import departmentConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseDepartmentTableConfigProps {
  setDepartmentCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useDepartmentTableConfig = ({ setDepartmentCount, setCurrentPageCount, filterKeys = {} }: UseDepartmentTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IDepartmentIndex>[] = useMemo(
    () => departmentTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[departmentConstants.TABLE_CONFIG_KEY] || {});
  const { [departmentConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteDepartment || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(departmentConstants.TABLE_CONFIG_KEY, departmentTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [departmentConstants.QUERY_KEY, queryParams],
    queryFn: () => getDepartments(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setDepartmentCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setDepartmentCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[departmentConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [departmentConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(departmentConstants.ENTITY_KEY));
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
    (record: IDepartmentIndex) => {
      const id = (record as any)[departmentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [departmentConstants.PRIMARY_KEY]: id },
          label: (record as any)[departmentConstants.LABEL_FIELD] || '',
          objKey: departmentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IDepartmentIndex) => {
      const id = (record as any)[departmentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [departmentConstants.PRIMARY_KEY]: id },
          label: (record as any)[departmentConstants.LABEL_FIELD] || '',
          objKey: departmentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IDepartmentIndex) => {
      const id = (record as any)[departmentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [departmentConstants.PRIMARY_KEY]: id },
          label: (record as any)[departmentConstants.LABEL_FIELD] || '',
          objKey: departmentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IDepartmentIndex>[] = useMemo(() => {
    const list: TableAction<IDepartmentIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: departmentConstants.PERMISSIONS.MODULE,
        resource: departmentConstants.PERMISSIONS.RESOURCE,
        action: departmentConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: departmentConstants.PERMISSIONS.MODULE,
        resource: departmentConstants.PERMISSIONS.RESOURCE,
        action: departmentConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: departmentConstants.PERMISSIONS.MODULE,
        resource: departmentConstants.PERMISSIONS.RESOURCE,
        action: departmentConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(departmentTableConfigDefault).some((key) => (departmentTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: departmentConstants.ENTITY_NAME,
    entityKey: departmentConstants.ENTITY_KEY,
    tableConfigKey: departmentConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: departmentTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const departmentTableColumns: TableColumn<IDepartmentIndex>[] = [
  { key: 'departmentId', title: 'Department Id', dataIndex: 'departmentId', sortable: false },
			{ key: 'departmentName', title: 'Department Name', dataIndex: 'departmentName', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => value ? formatDate(value) : '-' },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => value ? formatDate(value) : '-' }
];
