import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getDocuments, deleteDocument } from '../service';
import documentTableConfigDefault from '../data/documentTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IDocumentIndex } from '../interface';
import documentConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseDocumentTableConfigProps {
  setDocumentCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useDocumentTableConfig = ({ setDocumentCount, setCurrentPageCount, filterKeys = {} }: UseDocumentTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IDocumentIndex>[] = useMemo(() => documentTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[documentConstants.TABLE_CONFIG_KEY] || {});
  const { [documentConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteDocument || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(documentConstants.TABLE_CONFIG_KEY, documentTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [documentConstants.QUERY_KEY, queryParams],
    queryFn: () => getDocuments(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setDocumentCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setDocumentCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[documentConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [documentConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(documentConstants.ENTITY_KEY));
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
    (record: IDocumentIndex) => {
      const id = (record as any)[documentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [documentConstants.PRIMARY_KEY]: id },
          label: (record as any)[documentConstants.LABEL_FIELD] || '',
          objKey: documentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IDocumentIndex) => {
      const id = (record as any)[documentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [documentConstants.PRIMARY_KEY]: id },
          label: (record as any)[documentConstants.LABEL_FIELD] || '',
          objKey: documentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IDocumentIndex) => {
      const id = (record as any)[documentConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [documentConstants.PRIMARY_KEY]: id },
          label: (record as any)[documentConstants.LABEL_FIELD] || '',
          objKey: documentConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IDocumentIndex>[] = useMemo(() => {
    const list: TableAction<IDocumentIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: documentConstants.PERMISSIONS.MODULE,
        resource: documentConstants.PERMISSIONS.RESOURCE,
        action: documentConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: documentConstants.PERMISSIONS.MODULE,
        resource: documentConstants.PERMISSIONS.RESOURCE,
        action: documentConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: documentConstants.PERMISSIONS.MODULE,
        resource: documentConstants.PERMISSIONS.RESOURCE,
        action: documentConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(documentTableConfigDefault).some((key) => (documentTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: documentConstants.ENTITY_NAME,
    entityKey: documentConstants.ENTITY_KEY,
    tableConfigKey: documentConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: documentTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const documentTableColumns: TableColumn<IDocumentIndex>[] = [
  { key: 'documentId', title: 'Document Id', dataIndex: 'documentId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'documentType', title: 'Document Type', dataIndex: 'documentType', sortable: false },
  { key: 'fileName', title: 'File Name', dataIndex: 'fileName', sortable: false },
  { key: 'fileUrl', title: 'File Url', dataIndex: 'fileUrl', sortable: false },
  // { key: 'uploadedBy', title: 'Uploaded By', dataIndex: 'uploadedBy', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
