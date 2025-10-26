import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getSkills, deleteSkill } from '../service';
import skillTableConfigDefault from '../data/skillTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ISkillIndex } from '../interface';
import skillConstants from '../constants';

interface UseSkillTableConfigProps {
  setSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useSkillTableConfig = ({ setSkillCount, setCurrentPageCount, filterKeys = {} }: UseSkillTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ISkillIndex>[] = useMemo(
    () => skillTableColumns,
    [],
  );

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[skillConstants.TABLE_CONFIG_KEY] || {});
  const { [skillConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteSkill || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(skillConstants.TABLE_CONFIG_KEY, skillTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [skillConstants.QUERY_KEY, queryParams],
    queryFn: () => getSkills(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setSkillCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setSkillCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
  if (!primaryKeys || !primaryKeys[skillConstants.PRIMARY_KEY]) {
    console.error('Cannot delete: Missing primary keys');
    return;
  }
  await deleteEntityMutation.mutateAsync(primaryKeys);
  queryClient.invalidateQueries({ queryKey: [skillConstants.QUERY_KEY, queryParams], exact: false });
  dispatch(resetSelectedObj(skillConstants.ENTITY_KEY));
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
    (record: ISkillIndex) => {
      const id = (record as any)[skillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [skillConstants.PRIMARY_KEY]: id },
          label: (record as any)[skillConstants.LABEL_FIELD] || '',
          objKey: skillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ISkillIndex) => {
      const id = (record as any)[skillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [skillConstants.PRIMARY_KEY]: id },
          label: (record as any)[skillConstants.LABEL_FIELD] || '',
          objKey: skillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ISkillIndex) => {
      const id = (record as any)[skillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [skillConstants.PRIMARY_KEY]: id },
          label: (record as any)[skillConstants.LABEL_FIELD] || '',
          objKey: skillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ISkillIndex>[] = useMemo(() => {
    const list: TableAction<ISkillIndex>[] = [];
    
    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: skillConstants.PERMISSIONS.MODULE,
        resource: skillConstants.PERMISSIONS.RESOURCE,
        action: skillConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    
    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: skillConstants.PERMISSIONS.MODULE,
        resource: skillConstants.PERMISSIONS.RESOURCE,
        action: skillConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    
    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: skillConstants.PERMISSIONS.MODULE,
        resource: skillConstants.PERMISSIONS.RESOURCE,
        action: skillConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(skillTableConfigDefault).some((key) => (skillTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: skillConstants.ENTITY_NAME,
    entityKey: skillConstants.ENTITY_KEY,
    tableConfigKey: skillConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: skillTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const skillTableColumns: TableColumn<ISkillIndex>[] = [
  { key: 'skillId', title: 'Skill Id', dataIndex: 'skillId', sortable: false },
			{ key: 'skillName', title: 'Skill Name', dataIndex: 'skillName', sortable: false },
			{ key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false },
			{ key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false }
];
