import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getOfferLetters, deleteOfferLetter } from '../service';
import offerLetterTableConfigDefault from '../data/offerLetterTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IOfferLetterIndex } from '../interface';
import offerLetterConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseOfferLetterTableConfigProps {
  setOfferLetterCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useOfferLetterTableConfig = ({ setOfferLetterCount, setCurrentPageCount, filterKeys = {} }: UseOfferLetterTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IOfferLetterIndex>[] = useMemo(() => offerLetterTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[offerLetterConstants.TABLE_CONFIG_KEY] || {});
  const { [offerLetterConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteOfferLetter || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(offerLetterConstants.TABLE_CONFIG_KEY, offerLetterTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [offerLetterConstants.QUERY_KEY, queryParams],
    queryFn: () => getOfferLetters(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setOfferLetterCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setOfferLetterCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[offerLetterConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [offerLetterConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(offerLetterConstants.ENTITY_KEY));
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
    (record: IOfferLetterIndex) => {
      const id = (record as any)[offerLetterConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [offerLetterConstants.PRIMARY_KEY]: id },
          label: (record as any)[offerLetterConstants.LABEL_FIELD] || '',
          objKey: offerLetterConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IOfferLetterIndex) => {
      const id = (record as any)[offerLetterConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [offerLetterConstants.PRIMARY_KEY]: id },
          label: (record as any)[offerLetterConstants.LABEL_FIELD] || '',
          objKey: offerLetterConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IOfferLetterIndex) => {
      const id = (record as any)[offerLetterConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [offerLetterConstants.PRIMARY_KEY]: id },
          label: (record as any)[offerLetterConstants.LABEL_FIELD] || '',
          objKey: offerLetterConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IOfferLetterIndex>[] = useMemo(() => {
    const list: TableAction<IOfferLetterIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: offerLetterConstants.PERMISSIONS.MODULE,
        resource: offerLetterConstants.PERMISSIONS.RESOURCE,
        action: offerLetterConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: offerLetterConstants.PERMISSIONS.MODULE,
        resource: offerLetterConstants.PERMISSIONS.RESOURCE,
        action: offerLetterConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: offerLetterConstants.PERMISSIONS.MODULE,
        resource: offerLetterConstants.PERMISSIONS.RESOURCE,
        action: offerLetterConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(offerLetterTableConfigDefault).some((key) => (offerLetterTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: offerLetterConstants.ENTITY_NAME,
    entityKey: offerLetterConstants.ENTITY_KEY,
    tableConfigKey: offerLetterConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: offerLetterTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const offerLetterTableColumns: TableColumn<IOfferLetterIndex>[] = [
  { key: 'offerLetterId', title: 'Offer Letter Id', dataIndex: 'offerLetterId', sortable: false },
  { key: 'candidate', title: 'Candidate', dataIndex: 'candidateFirstName', sortable: false },
  { key: 'jobTitle', title: 'Job Title', dataIndex: 'jobTitle', sortable: false },
  { key: 'salaryOffered', title: 'Salary Offered', dataIndex: 'salaryOffered', sortable: false },
  { key: 'joiningDate', title: 'Joining Date', dataIndex: 'joiningDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'termsAndCondition', title: 'Terms And Condition', dataIndex: 'termsAndCondition', sortable: false },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  // { key: 'issuedBy', title: 'Issued By', dataIndex: 'issuedBy', sortable: false },
  // { key: 'approvedBy', title: 'Approved By', dataIndex: 'approvedBy', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
