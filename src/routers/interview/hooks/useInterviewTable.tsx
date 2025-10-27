import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getInterviews, deleteInterview } from '../service';
import interviewTableConfigDefault from '../data/interviewTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IInterviewIndex } from '../interface';
import interviewConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseInterviewTableConfigProps {
  setInterviewCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useInterviewTableConfig = ({ setInterviewCount, setCurrentPageCount, filterKeys = {} }: UseInterviewTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IInterviewIndex>[] = useMemo(() => interviewTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[interviewConstants.TABLE_CONFIG_KEY] || {});
  const { [interviewConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteInterview || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(interviewConstants.TABLE_CONFIG_KEY, interviewTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [interviewConstants.QUERY_KEY, queryParams],
    queryFn: () => getInterviews(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setInterviewCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setInterviewCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[interviewConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [interviewConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(interviewConstants.ENTITY_KEY));
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
    (record: IInterviewIndex) => {
      const id = (record as any)[interviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [interviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[interviewConstants.LABEL_FIELD] || '',
          objKey: interviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IInterviewIndex) => {
      const id = (record as any)[interviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [interviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[interviewConstants.LABEL_FIELD] || '',
          objKey: interviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IInterviewIndex) => {
      const id = (record as any)[interviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [interviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[interviewConstants.LABEL_FIELD] || '',
          objKey: interviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IInterviewIndex>[] = useMemo(() => {
    const list: TableAction<IInterviewIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: interviewConstants.PERMISSIONS.MODULE,
        resource: interviewConstants.PERMISSIONS.RESOURCE,
        action: interviewConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: interviewConstants.PERMISSIONS.MODULE,
        resource: interviewConstants.PERMISSIONS.RESOURCE,
        action: interviewConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: interviewConstants.PERMISSIONS.MODULE,
        resource: interviewConstants.PERMISSIONS.RESOURCE,
        action: interviewConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(interviewTableConfigDefault).some((key) => (interviewTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: interviewConstants.ENTITY_NAME,
    entityKey: interviewConstants.ENTITY_KEY,
    tableConfigKey: interviewConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: interviewTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const interviewTableColumns: TableColumn<IInterviewIndex>[] = [
  { key: 'interviewId', title: 'Interview Id', dataIndex: 'interviewId', sortable: false },
  { key: 'candidate', title: 'Candidate', dataIndex: 'candidateFirstName', sortable: false },
  { key: 'jobTitle', title: 'Job Title', dataIndex: 'jobTitle', sortable: false },
  { key: 'interviewer', title: 'Interviewer', dataIndex: 'interviewerFirstName', sortable: false },
  { key: 'interviewDate', title: 'Interview Date', dataIndex: 'interviewDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'feedback', title: 'Feedback', dataIndex: 'feedback', sortable: false },
  { key: 'rating', title: 'Rating', dataIndex: 'rating', sortable: false },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
