import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getCandidateSkills, deleteCandidateSkill } from '../service';
import candidateSkillTableConfigDefault from '../data/candidateSkillTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ICandidateSkillIndex } from '../interface';
import candidateSkillConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseCandidateSkillTableConfigProps {
  setCandidateSkillCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useCandidateSkillTableConfig = ({ setCandidateSkillCount, setCurrentPageCount, filterKeys = {} }: UseCandidateSkillTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ICandidateSkillIndex>[] = useMemo(() => candidateSkillTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[candidateSkillConstants.TABLE_CONFIG_KEY] || {});
  const { [candidateSkillConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteCandidateSkill || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(candidateSkillConstants.TABLE_CONFIG_KEY, candidateSkillTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [candidateSkillConstants.QUERY_KEY, queryParams],
    queryFn: () => getCandidateSkills(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setCandidateSkillCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setCandidateSkillCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[candidateSkillConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [candidateSkillConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(candidateSkillConstants.ENTITY_KEY));
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
    (record: ICandidateSkillIndex) => {
      const id = (record as any)[candidateSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [candidateSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateSkillConstants.LABEL_FIELD] || '',
          objKey: candidateSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ICandidateSkillIndex) => {
      const id = (record as any)[candidateSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [candidateSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateSkillConstants.LABEL_FIELD] || '',
          objKey: candidateSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ICandidateSkillIndex) => {
      const id = (record as any)[candidateSkillConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [candidateSkillConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateSkillConstants.LABEL_FIELD] || '',
          objKey: candidateSkillConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ICandidateSkillIndex>[] = useMemo(() => {
    const list: TableAction<ICandidateSkillIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: candidateSkillConstants.PERMISSIONS.MODULE,
        resource: candidateSkillConstants.PERMISSIONS.RESOURCE,
        action: candidateSkillConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: candidateSkillConstants.PERMISSIONS.MODULE,
        resource: candidateSkillConstants.PERMISSIONS.RESOURCE,
        action: candidateSkillConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: candidateSkillConstants.PERMISSIONS.MODULE,
        resource: candidateSkillConstants.PERMISSIONS.RESOURCE,
        action: candidateSkillConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(candidateSkillTableConfigDefault).some(
      (key) => (candidateSkillTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: candidateSkillConstants.ENTITY_NAME,
    entityKey: candidateSkillConstants.ENTITY_KEY,
    tableConfigKey: candidateSkillConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: candidateSkillTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const candidateSkillTableColumns: TableColumn<ICandidateSkillIndex>[] = [
  { key: 'candidateSkillId', title: 'Candidate Skill Id', dataIndex: 'candidateSkillId', sortable: false },
  { key: 'candidate', title: 'Candidate', dataIndex: 'candidateFirstName', sortable: false },
  { key: 'skill', title: 'Skill', dataIndex: 'skillName', sortable: false },
  { key: 'proficiency', title: 'Proficiency', dataIndex: 'proficiency', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
