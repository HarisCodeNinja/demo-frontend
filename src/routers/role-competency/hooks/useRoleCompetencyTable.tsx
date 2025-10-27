import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getRoleCompetencies, deleteRoleCompetency } from '../service';
import roleCompetencyTableConfigDefault from '../data/roleCompetencyTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IRoleCompetencyIndex } from '../interface';
import roleCompetencyConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseRoleCompetencyTableConfigProps {
  setRoleCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useRoleCompetencyTableConfig = ({ setRoleCompetencyCount, setCurrentPageCount, filterKeys = {} }: UseRoleCompetencyTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IRoleCompetencyIndex>[] = useMemo(() => roleCompetencyTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[roleCompetencyConstants.TABLE_CONFIG_KEY] || {});
  const { [roleCompetencyConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteRoleCompetency || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(roleCompetencyConstants.TABLE_CONFIG_KEY, roleCompetencyTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [roleCompetencyConstants.QUERY_KEY, queryParams],
    queryFn: () => getRoleCompetencies(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setRoleCompetencyCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setRoleCompetencyCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[roleCompetencyConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [roleCompetencyConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(roleCompetencyConstants.ENTITY_KEY));
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
    (record: IRoleCompetencyIndex) => {
      const id = (record as any)[roleCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [roleCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[roleCompetencyConstants.LABEL_FIELD] || '',
          objKey: roleCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IRoleCompetencyIndex) => {
      const id = (record as any)[roleCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [roleCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[roleCompetencyConstants.LABEL_FIELD] || '',
          objKey: roleCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IRoleCompetencyIndex) => {
      const id = (record as any)[roleCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [roleCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[roleCompetencyConstants.LABEL_FIELD] || '',
          objKey: roleCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IRoleCompetencyIndex>[] = useMemo(() => {
    const list: TableAction<IRoleCompetencyIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: roleCompetencyConstants.PERMISSIONS.MODULE,
        resource: roleCompetencyConstants.PERMISSIONS.RESOURCE,
        action: roleCompetencyConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: roleCompetencyConstants.PERMISSIONS.MODULE,
        resource: roleCompetencyConstants.PERMISSIONS.RESOURCE,
        action: roleCompetencyConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: roleCompetencyConstants.PERMISSIONS.MODULE,
        resource: roleCompetencyConstants.PERMISSIONS.RESOURCE,
        action: roleCompetencyConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(roleCompetencyTableConfigDefault).some(
      (key) => (roleCompetencyTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: roleCompetencyConstants.ENTITY_NAME,
    entityKey: roleCompetencyConstants.ENTITY_KEY,
    tableConfigKey: roleCompetencyConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: roleCompetencyTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const roleCompetencyTableColumns: TableColumn<IRoleCompetencyIndex>[] = [
  { key: 'roleCompetencyId', title: 'Role Competency Id', dataIndex: 'roleCompetencyId', sortable: false },
  { key: 'designation', title: 'Designation', dataIndex: 'designationName', sortable: false },
  { key: 'competency', title: 'Competency', dataIndex: 'competencyName', sortable: false },
  { key: 'requiredProficiency', title: 'Required Proficiency', dataIndex: 'requiredProficiency', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
