import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getEmployeeCompetencies, deleteEmployeeCompetency } from '../service';
import employeeCompetencyTableConfigDefault from '../data/employeeCompetencyTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IEmployeeCompetencyIndex } from '../interface';
import employeeCompetencyConstants from '../constants';
import { formatDate } from '@/util/Time';

interface UseEmployeeCompetencyTableConfigProps {
  setEmployeeCompetencyCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useEmployeeCompetencyTableConfig = ({ setEmployeeCompetencyCount, setCurrentPageCount, filterKeys = {} }: UseEmployeeCompetencyTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IEmployeeCompetencyIndex>[] = useMemo(() => employeeCompetencyTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[employeeCompetencyConstants.TABLE_CONFIG_KEY] || {});
  const { [employeeCompetencyConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteEmployeeCompetency || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(employeeCompetencyConstants.TABLE_CONFIG_KEY, employeeCompetencyTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [employeeCompetencyConstants.QUERY_KEY, queryParams],
    queryFn: () => getEmployeeCompetencies(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setEmployeeCompetencyCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setEmployeeCompetencyCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[employeeCompetencyConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [employeeCompetencyConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(employeeCompetencyConstants.ENTITY_KEY));
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
    (record: IEmployeeCompetencyIndex) => {
      const id = (record as any)[employeeCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [employeeCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeCompetencyConstants.LABEL_FIELD] || '',
          objKey: employeeCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IEmployeeCompetencyIndex) => {
      const id = (record as any)[employeeCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [employeeCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeCompetencyConstants.LABEL_FIELD] || '',
          objKey: employeeCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IEmployeeCompetencyIndex) => {
      const id = (record as any)[employeeCompetencyConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [employeeCompetencyConstants.PRIMARY_KEY]: id },
          label: (record as any)[employeeCompetencyConstants.LABEL_FIELD] || '',
          objKey: employeeCompetencyConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IEmployeeCompetencyIndex>[] = useMemo(() => {
    const list: TableAction<IEmployeeCompetencyIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: employeeCompetencyConstants.PERMISSIONS.MODULE,
        resource: employeeCompetencyConstants.PERMISSIONS.RESOURCE,
        action: employeeCompetencyConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: employeeCompetencyConstants.PERMISSIONS.MODULE,
        resource: employeeCompetencyConstants.PERMISSIONS.RESOURCE,
        action: employeeCompetencyConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: employeeCompetencyConstants.PERMISSIONS.MODULE,
        resource: employeeCompetencyConstants.PERMISSIONS.RESOURCE,
        action: employeeCompetencyConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(employeeCompetencyTableConfigDefault).some(
      (key) => (employeeCompetencyTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any],
    ),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: employeeCompetencyConstants.ENTITY_NAME,
    entityKey: employeeCompetencyConstants.ENTITY_KEY,
    tableConfigKey: employeeCompetencyConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: employeeCompetencyTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const employeeCompetencyTableColumns: TableColumn<IEmployeeCompetencyIndex>[] = [
  { key: 'employeeCompetencyId', title: 'Employee Competency Id', dataIndex: 'employeeCompetencyId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'employeeFirstName', sortable: false },
  { key: 'competency', title: 'Competency', dataIndex: 'competencyName', sortable: false },
  { key: 'currentProficiency', title: 'Current Proficiency', dataIndex: 'currentProficiency', sortable: false },
  { key: 'lastEvaluated', title: 'Last Evaluated', dataIndex: 'lastEvaluated', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
