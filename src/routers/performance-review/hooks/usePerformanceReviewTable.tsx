import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getPerformanceReviews, deletePerformanceReview } from '../service';
import performanceReviewTableConfigDefault from '../data/performanceReviewTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IPerformanceReviewIndex } from '../interface';
import performanceReviewConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UsePerformanceReviewTableConfigProps {
  setPerformanceReviewCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const usePerformanceReviewTableConfig = ({ setPerformanceReviewCount, setCurrentPageCount, filterKeys = {} }: UsePerformanceReviewTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IPerformanceReviewIndex>[] = useMemo(() => performanceReviewTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[performanceReviewConstants.TABLE_CONFIG_KEY] || {});
  const { [performanceReviewConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deletePerformanceReview || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(performanceReviewConstants.TABLE_CONFIG_KEY, performanceReviewTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [performanceReviewConstants.QUERY_KEY, queryParams],
    queryFn: () => getPerformanceReviews(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setPerformanceReviewCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setPerformanceReviewCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[performanceReviewConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [performanceReviewConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(performanceReviewConstants.ENTITY_KEY));
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
    (record: IPerformanceReviewIndex) => {
      const id = (record as any)[performanceReviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [performanceReviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[performanceReviewConstants.LABEL_FIELD] || '',
          objKey: performanceReviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IPerformanceReviewIndex) => {
      const id = (record as any)[performanceReviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [performanceReviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[performanceReviewConstants.LABEL_FIELD] || '',
          objKey: performanceReviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IPerformanceReviewIndex) => {
      const id = (record as any)[performanceReviewConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [performanceReviewConstants.PRIMARY_KEY]: id },
          label: (record as any)[performanceReviewConstants.LABEL_FIELD] || '',
          objKey: performanceReviewConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IPerformanceReviewIndex>[] = useMemo(() => {
    const list: TableAction<IPerformanceReviewIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: performanceReviewConstants.PERMISSIONS.MODULE,
        resource: performanceReviewConstants.PERMISSIONS.RESOURCE,
        action: performanceReviewConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: performanceReviewConstants.PERMISSIONS.MODULE,
        resource: performanceReviewConstants.PERMISSIONS.RESOURCE,
        action: performanceReviewConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: performanceReviewConstants.PERMISSIONS.MODULE,
        resource: performanceReviewConstants.PERMISSIONS.RESOURCE,
        action: performanceReviewConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(performanceReviewTableConfigDefault).some(
      (key) => (performanceReviewTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: performanceReviewConstants.ENTITY_NAME,
    entityKey: performanceReviewConstants.ENTITY_KEY,
    tableConfigKey: performanceReviewConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: performanceReviewTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const performanceReviewTableColumns: TableColumn<IPerformanceReviewIndex>[] = [
  { key: 'performanceReviewId', title: 'Performance Review Id', dataIndex: 'performanceReviewId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'employeeFirstName', sortable: false },
  { key: 'reviewer', title: 'Reviewer', dataIndex: 'reviewerFirstName', sortable: false },
  { key: 'reviewPeriod', title: 'Review Period', dataIndex: 'reviewPeriod', sortable: false },
  { key: 'reviewDate', title: 'Review Date', dataIndex: 'reviewDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'selfAssessment', title: 'Self Assessment', dataIndex: 'selfAssessment', sortable: false },
  { key: 'managerFeedback', title: 'Manager Feedback', dataIndex: 'managerFeedback', sortable: false },
  { key: 'overallRating', title: 'Overall Rating', dataIndex: 'overallRating', sortable: false },
  { key: 'recommendation', title: 'Recommendation', dataIndex: 'recommendation', sortable: false },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
