import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getPayslips, deletePayslip } from '../service';
import payslipTableConfigDefault from '../data/payslipTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IPayslipIndex } from '../interface';
import payslipConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UsePayslipTableConfigProps {
  setPayslipCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const usePayslipTableConfig = ({ setPayslipCount, setCurrentPageCount, filterKeys = {} }: UsePayslipTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IPayslipIndex>[] = useMemo(() => payslipTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[payslipConstants.TABLE_CONFIG_KEY] || {});
  const { [payslipConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deletePayslip || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(payslipConstants.TABLE_CONFIG_KEY, payslipTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [payslipConstants.QUERY_KEY, queryParams],
    queryFn: () => getPayslips(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setPayslipCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setPayslipCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[payslipConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [payslipConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(payslipConstants.ENTITY_KEY));
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
    (record: IPayslipIndex) => {
      const id = (record as any)[payslipConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [payslipConstants.PRIMARY_KEY]: id },
          label: (record as any)[payslipConstants.LABEL_FIELD] || '',
          objKey: payslipConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IPayslipIndex) => {
      const id = (record as any)[payslipConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [payslipConstants.PRIMARY_KEY]: id },
          label: (record as any)[payslipConstants.LABEL_FIELD] || '',
          objKey: payslipConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IPayslipIndex) => {
      const id = (record as any)[payslipConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [payslipConstants.PRIMARY_KEY]: id },
          label: (record as any)[payslipConstants.LABEL_FIELD] || '',
          objKey: payslipConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IPayslipIndex>[] = useMemo(() => {
    const list: TableAction<IPayslipIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: payslipConstants.PERMISSIONS.MODULE,
        resource: payslipConstants.PERMISSIONS.RESOURCE,
        action: payslipConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: payslipConstants.PERMISSIONS.MODULE,
        resource: payslipConstants.PERMISSIONS.RESOURCE,
        action: payslipConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-red-500" />,
      onClick: handleDeleteAction,
      className: 'text-red-500',
      permission: {
        scope: user?.scope || '',
        module: payslipConstants.PERMISSIONS.MODULE,
        resource: payslipConstants.PERMISSIONS.RESOURCE,
        action: payslipConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(payslipTableConfigDefault).some((key) => (payslipTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: payslipConstants.ENTITY_NAME,
    entityKey: payslipConstants.ENTITY_KEY,
    tableConfigKey: payslipConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: payslipTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const payslipTableColumns: TableColumn<IPayslipIndex>[] = [
  { key: 'payslipId', title: 'Payslip Id', dataIndex: 'payslipId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'payPeriodStart', title: 'Pay Period Start', dataIndex: 'payPeriodStart', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'payPeriodEnd', title: 'Pay Period End', dataIndex: 'payPeriodEnd', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'grossSalary', title: 'Gross Salary', dataIndex: 'grossSalary', sortable: false },
  { key: 'netSalary', title: 'Net Salary', dataIndex: 'netSalary', sortable: false },
  { key: 'deductionsAmount', title: 'Deductions Amount', dataIndex: 'deductionsAmount', sortable: false },
  { key: 'allowancesAmount', title: 'Allowances Amount', dataIndex: 'allowancesAmount', sortable: false },
  { key: 'pdfUrl', title: 'Pdf Url', dataIndex: 'pdfUrl', sortable: false },
  // { key: 'generatedBy', title: 'Generated By', dataIndex: 'generatedBy', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
