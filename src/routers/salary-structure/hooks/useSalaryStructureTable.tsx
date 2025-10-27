import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getSalaryStructures, deleteSalaryStructure } from '../service';
import salaryStructureTableConfigDefault from '../data/salaryStructureTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { ISalaryStructureIndex } from '../interface';
import salaryStructureConstants from '../constants';
import { formatDate } from '@/util/Time';
import { JSONValueRenderer } from '@/components/common/JSONValueRenderer';

interface UseSalaryStructureTableConfigProps {
  setSalaryStructureCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useSalaryStructureTableConfig = ({ setSalaryStructureCount, setCurrentPageCount, filterKeys = {} }: UseSalaryStructureTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<ISalaryStructureIndex>[] = useMemo(() => salaryStructureTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[salaryStructureConstants.TABLE_CONFIG_KEY] || {});
  const { [salaryStructureConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteSalaryStructure || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(salaryStructureConstants.TABLE_CONFIG_KEY, salaryStructureTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [salaryStructureConstants.QUERY_KEY, queryParams],
    queryFn: () => getSalaryStructures(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setSalaryStructureCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setSalaryStructureCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[salaryStructureConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [salaryStructureConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(salaryStructureConstants.ENTITY_KEY));
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
    (record: ISalaryStructureIndex) => {
      const id = (record as any)[salaryStructureConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [salaryStructureConstants.PRIMARY_KEY]: id },
          label: (record as any)[salaryStructureConstants.LABEL_FIELD] || '',
          objKey: salaryStructureConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: ISalaryStructureIndex) => {
      const id = (record as any)[salaryStructureConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [salaryStructureConstants.PRIMARY_KEY]: id },
          label: (record as any)[salaryStructureConstants.LABEL_FIELD] || '',
          objKey: salaryStructureConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: ISalaryStructureIndex) => {
      const id = (record as any)[salaryStructureConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [salaryStructureConstants.PRIMARY_KEY]: id },
          label: (record as any)[salaryStructureConstants.LABEL_FIELD] || '',
          objKey: salaryStructureConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<ISalaryStructureIndex>[] = useMemo(() => {
    const list: TableAction<ISalaryStructureIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: salaryStructureConstants.PERMISSIONS.MODULE,
        resource: salaryStructureConstants.PERMISSIONS.RESOURCE,
        action: salaryStructureConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: salaryStructureConstants.PERMISSIONS.MODULE,
        resource: salaryStructureConstants.PERMISSIONS.RESOURCE,
        action: salaryStructureConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: salaryStructureConstants.PERMISSIONS.MODULE,
        resource: salaryStructureConstants.PERMISSIONS.RESOURCE,
        action: salaryStructureConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(salaryStructureTableConfigDefault).some(
      (key) => (salaryStructureTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: salaryStructureConstants.ENTITY_NAME,
    entityKey: salaryStructureConstants.ENTITY_KEY,
    tableConfigKey: salaryStructureConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: salaryStructureTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const salaryStructureTableColumns: TableColumn<ISalaryStructureIndex>[] = [
  { key: 'salaryStructureId', title: 'Salary Structure Id', dataIndex: 'salaryStructureId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'basicSalary', title: 'Basic Salary', dataIndex: 'basicSalary', sortable: false },
  { key: 'allowance', title: 'Allowance', dataIndex: 'allowance', sortable: false, render: (value) => <JSONValueRenderer value={value} /> },
  { key: 'deduction', title: 'Deduction', dataIndex: 'deduction', sortable: false, render: (value) => <JSONValueRenderer value={value} /> },
  { key: 'effectiveDate', title: 'Effective Date', dataIndex: 'effectiveDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
