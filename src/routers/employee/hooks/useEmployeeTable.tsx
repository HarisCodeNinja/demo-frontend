import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getEmployees, deleteEmployee } from '../service';
import employeeTableConfigDefault from '../data/employeeTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IEmployeeIndex } from '../interface';
import employeeConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseEmployeeTableConfigProps {
  setEmployeeCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useEmployeeTableConfig = ({ setEmployeeCount, setCurrentPageCount, filterKeys = {} }: UseEmployeeTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IEmployeeIndex>[] = useMemo(() => employeeTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[employeeConstants.TABLE_CONFIG_KEY] || {});
  const { [employeeConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteEmployee || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(employeeConstants.TABLE_CONFIG_KEY, employeeTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [employeeConstants.QUERY_KEY, queryParams],
    queryFn: () => getEmployees(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setEmployeeCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setEmployeeCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[employeeConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [employeeConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(employeeConstants.ENTITY_KEY));
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
    (record: IEmployeeIndex) => {
      const id = (record as any)[employeeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [employeeConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeConstants.LABEL_FIELD] || '',
          objKey: employeeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IEmployeeIndex) => {
      const id = (record as any)[employeeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [employeeConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeConstants.LABEL_FIELD] || '',
          objKey: employeeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IEmployeeIndex) => {
      const id = (record as any)[employeeConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [employeeConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeConstants.LABEL_FIELD] || '',
          objKey: employeeConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IEmployeeIndex>[] = useMemo(() => {
    const list: TableAction<IEmployeeIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: employeeConstants.PERMISSIONS.MODULE,
        resource: employeeConstants.PERMISSIONS.RESOURCE,
        action: employeeConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: employeeConstants.PERMISSIONS.MODULE,
        resource: employeeConstants.PERMISSIONS.RESOURCE,
        action: employeeConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: employeeConstants.PERMISSIONS.MODULE,
        resource: employeeConstants.PERMISSIONS.RESOURCE,
        action: employeeConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(employeeTableConfigDefault).some((key) => (employeeTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: employeeConstants.ENTITY_NAME,
    entityKey: employeeConstants.ENTITY_KEY,
    tableConfigKey: employeeConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: employeeTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const employeeTableColumns: TableColumn<IEmployeeIndex>[] = [
  { key: 'employeeId', title: 'Employee Id', dataIndex: 'employeeId', sortable: false },
  // { key: 'userId', title: 'User Id', dataIndex: 'userId', sortable: false },
  { key: 'employeeUniqueId', title: 'Employee Unique Id', dataIndex: 'employeeUniqueId', sortable: false },
  { key: 'firstName', title: 'First Name', dataIndex: 'firstName', sortable: false },
  { key: 'lastName', title: 'Last Name', dataIndex: 'lastName', sortable: false },
  { key: 'dateOfBirth', title: 'Date Of Birth', dataIndex: 'dateOfBirth', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'gender', title: 'Gender', dataIndex: 'gender', sortable: false },
  { key: 'phoneNumber', title: 'Phone Number', dataIndex: 'phoneNumber', sortable: false },
  { key: 'address', title: 'Address', dataIndex: 'address', sortable: false },
  { key: 'personalEmail', title: 'Personal Email', dataIndex: 'personalEmail', sortable: false },
  { key: 'employmentStartDate', title: 'Employment Start Date', dataIndex: 'employmentStartDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'employmentEndDate', title: 'Employment End Date', dataIndex: 'employmentEndDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'departmentName', title: 'Department', dataIndex: 'departmentName', sortable: false },
  { key: 'designationName', title: 'Designation', dataIndex: 'designationName', sortable: false },
  { key: 'reportingManager', title: 'Reporting Manager', dataIndex: 'reportingManagerFirstName', sortable: false },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
