import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getCandidates, deleteCandidate } from '../service';
import candidateTableConfigDefault from '../data/candidateTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ICandidateIndex } from '../interface';
import candidateConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseCandidateTableConfigProps {
  setCandidateCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useCandidateTableConfig = ({ setCandidateCount, setCurrentPageCount, filterKeys = {} }: UseCandidateTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ICandidateIndex>[] = useMemo(() => candidateTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[candidateConstants.TABLE_CONFIG_KEY] || {});
  const { [candidateConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteCandidate || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(candidateConstants.TABLE_CONFIG_KEY, candidateTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [candidateConstants.QUERY_KEY, queryParams],
    queryFn: () => getCandidates(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setCandidateCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setCandidateCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[candidateConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [candidateConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(candidateConstants.ENTITY_KEY));
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
    (record: ICandidateIndex) => {
      const id = (record as any)[candidateConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [candidateConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateConstants.LABEL_FIELD] || '',
          objKey: candidateConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ICandidateIndex) => {
      const id = (record as any)[candidateConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [candidateConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateConstants.LABEL_FIELD] || '',
          objKey: candidateConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ICandidateIndex) => {
      const id = (record as any)[candidateConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [candidateConstants.PRIMARY_KEY]: id },
          label: (record as any)[candidateConstants.LABEL_FIELD] || '',
          objKey: candidateConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ICandidateIndex>[] = useMemo(() => {
    const list: TableAction<ICandidateIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: candidateConstants.PERMISSIONS.MODULE,
        resource: candidateConstants.PERMISSIONS.RESOURCE,
        action: candidateConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: candidateConstants.PERMISSIONS.MODULE,
        resource: candidateConstants.PERMISSIONS.RESOURCE,
        action: candidateConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: candidateConstants.PERMISSIONS.MODULE,
        resource: candidateConstants.PERMISSIONS.RESOURCE,
        action: candidateConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(candidateTableConfigDefault).some((key) => (candidateTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: candidateConstants.ENTITY_NAME,
    entityKey: candidateConstants.ENTITY_KEY,
    tableConfigKey: candidateConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: candidateTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const candidateTableColumns: TableColumn<ICandidateIndex>[] = [
  { key: 'candidateId', title: 'Candidate Id', dataIndex: 'candidateId', sortable: false },
  { key: 'firstName', title: 'First Name', dataIndex: 'firstName', sortable: false },
  { key: 'lastName', title: 'Last Name', dataIndex: 'lastName', sortable: false },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: false },
  { key: 'phoneNumber', title: 'Phone Number', dataIndex: 'phoneNumber', sortable: false },
  { key: 'resumeText', title: 'Resume Text', dataIndex: 'resumeText', sortable: false },
  { key: 'source', title: 'Source', dataIndex: 'source', sortable: false },
  { key: 'currentStatus', title: 'Current Status', dataIndex: 'currentStatus', sortable: false },
  { key: 'jobTitle', title: 'Job Title', dataIndex: 'jobTitle', sortable: false },
  { key: 'referredByEmployee', title: 'Referred By', dataIndex: 'referredByFirstName', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
