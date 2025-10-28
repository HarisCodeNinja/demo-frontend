import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getJobOpeningSkills, deleteJobOpeningSkill } from '../service';
import jobOpeningSkillTableConfigDefault from '../data/jobOpeningSkillTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IJobOpeningSkillIndex, IJobOpeningSkillQueryParams } from '../interface';
import jobOpeningSkillConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseJobOpeningSkillTableConfigProps {
  setJobOpeningSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useJobOpeningSkillTableConfig = ({ setJobOpeningSkillCount, setCurrentPageCount, filterKeys = {} }: UseJobOpeningSkillTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IJobOpeningSkillIndex>[] = useMemo(() => jobOpeningSkillTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[jobOpeningSkillConstants.TABLE_CONFIG_KEY] || {});
  const { [jobOpeningSkillConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteJobOpeningSkill || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(jobOpeningSkillConstants.TABLE_CONFIG_KEY, jobOpeningSkillTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [jobOpeningSkillConstants.QUERY_KEY, queryParams],
    queryFn: () => getJobOpeningSkills(queryParams as IJobOpeningSkillQueryParams),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setJobOpeningSkillCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setJobOpeningSkillCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[jobOpeningSkillConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [jobOpeningSkillConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(jobOpeningSkillConstants.ENTITY_KEY));
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
    (record: IJobOpeningSkillIndex) => {
      const id = (record as any)[jobOpeningSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [jobOpeningSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningSkillConstants.LABEL_FIELD] || '',
          objKey: jobOpeningSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IJobOpeningSkillIndex) => {
      const id = (record as any)[jobOpeningSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [jobOpeningSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningSkillConstants.LABEL_FIELD] || '',
          objKey: jobOpeningSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IJobOpeningSkillIndex) => {
      const id = (record as any)[jobOpeningSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [jobOpeningSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[jobOpeningSkillConstants.LABEL_FIELD] || '',
          objKey: jobOpeningSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IJobOpeningSkillIndex>[] = useMemo(() => {
    const list: TableAction<IJobOpeningSkillIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: jobOpeningSkillConstants.PERMISSIONS.MODULE,
        resource: jobOpeningSkillConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningSkillConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: jobOpeningSkillConstants.PERMISSIONS.MODULE,
        resource: jobOpeningSkillConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningSkillConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: jobOpeningSkillConstants.PERMISSIONS.MODULE,
        resource: jobOpeningSkillConstants.PERMISSIONS.RESOURCE,
        action: jobOpeningSkillConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(jobOpeningSkillTableConfigDefault).some(
      (key) => (jobOpeningSkillTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: jobOpeningSkillConstants.ENTITY_NAME,
    entityKey: jobOpeningSkillConstants.ENTITY_KEY,
    tableConfigKey: jobOpeningSkillConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: jobOpeningSkillTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const jobOpeningSkillTableColumns: TableColumn<IJobOpeningSkillIndex>[] = [
  { key: 'jobOpeningSkillId', title: 'Job Opening Skill Id', dataIndex: 'jobOpeningSkillId', sortable: false },
  { key: 'jobOpening', title: 'Job Opening', dataIndex: 'jobTitle', sortable: false },
  { key: 'skill', title: 'Skill Required', dataIndex: 'skillName', sortable: false },
  { key: 'requiredLevel', title: 'Level Required', dataIndex: 'requiredLevel', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
