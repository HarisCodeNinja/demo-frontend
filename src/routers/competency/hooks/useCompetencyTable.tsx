import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getCompetencies, deleteCompetency } from '../service';
import competencyTableConfigDefault from '../data/competencyTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ICompetencyIndex } from '../interface';
import competencyConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseCompetencyTableConfigProps {
  setCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useCompetencyTableConfig = ({ setCompetencyCount, setCurrentPageCount, filterKeys = {} }: UseCompetencyTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ICompetencyIndex>[] = useMemo(
    () => competencyTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[competencyConstants.TABLE_CONFIG_KEY] || {});
  const { [competencyConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteCompetency || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(competencyConstants.TABLE_CONFIG_KEY, competencyTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [competencyConstants.QUERY_KEY, queryParams],
    queryFn: () => getCompetencies(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setCompetencyCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setCompetencyCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[competencyConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [competencyConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(competencyConstants.ENTITY_KEY));
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
    (record: ICompetencyIndex) => {
      const id = (record as any)[competencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [competencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[competencyConstants.LABEL_FIELD] || '',
          objKey: competencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ICompetencyIndex) => {
      const id = (record as any)[competencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [competencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[competencyConstants.LABEL_FIELD] || '',
          objKey: competencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ICompetencyIndex) => {
      const id = (record as any)[competencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [competencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[competencyConstants.LABEL_FIELD] || '',
          objKey: competencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ICompetencyIndex>[] = useMemo(() => {
    const list: TableAction<ICompetencyIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: competencyConstants.PERMISSIONS.MODULE,
        resource: competencyConstants.PERMISSIONS.RESOURCE,
        action: competencyConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: competencyConstants.PERMISSIONS.MODULE,
        resource: competencyConstants.PERMISSIONS.RESOURCE,
        action: competencyConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: competencyConstants.PERMISSIONS.MODULE,
        resource: competencyConstants.PERMISSIONS.RESOURCE,
        action: competencyConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(competencyTableConfigDefault).some((key) => (competencyTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: competencyConstants.ENTITY_NAME,
    entityKey: competencyConstants.ENTITY_KEY,
    tableConfigKey: competencyConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: competencyTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const competencyTableColumns: TableColumn<ICompetencyIndex>[] = [
  { key: 'competencyId', title: 'Competency Id', dataIndex: 'competencyId', sortable: false },
			{ key: 'competencyName', title: 'Competency Name', dataIndex: 'competencyName', sortable: false },
			{ key: 'description', title: 'Description', dataIndex: 'description', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => value ? formatDate(value) : '-' },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => value ? formatDate(value) : '-' }
];
