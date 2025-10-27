import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { setForDelete, setForEdit, setForView, resetSelectedObj } from '@/store/slice/selectedObjSlice';
import { useInitializeTableConfig } from '@/hooks/useTableActions';
import { useTableOperations } from '@/hooks/useTableOperations';
import { Trash2, Edit, Eye } from 'lucide-react';
import { getAttendances, deleteAttendance } from '../service';
import attendanceTableConfigDefault from '../data/attendanceTableConfigDefault';
import { TableAction, TableColumn } from '@/types/table';
import { IAttendanceIndex } from '../interface';
import attendanceConstants from '../constants';
import { formatDate, formatDateTime } from '@/util/Time';

interface UseAttendanceTableConfigProps {
  setAttendanceCount: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentPageCount?: React.Dispatch<React.SetStateAction<number>>;
  filterKeys?: Record<string, unknown>;
}

export const useAttendanceTableConfig = ({ setAttendanceCount, setCurrentPageCount, filterKeys = {} }: UseAttendanceTableConfigProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const columns: TableColumn<IAttendanceIndex>[] = useMemo(() => attendanceTableColumns, []);

  const tableConfiguration = useAppSelector((state: RootState) => state.tableConfiguration[attendanceConstants.TABLE_CONFIG_KEY] || {});
  const { [attendanceConstants.ENTITY_KEY]: { primaryKeys } = {} } = useAppSelector((state: RootState) => state.selectedObj);
  const { user } = useAppSelector((state: RootState) => state.session);

  const deleteEntityMutation = useMutation({
    mutationFn: deleteAttendance || (() => Promise.reject(new Error('Delete function not provided'))),
  });

  const { pager, setPager, queryParams, handleSort, getSortDirection, getSortIndex } = useTableOperations(filterKeys as any, (tableConfiguration as any).multiSort);

  useInitializeTableConfig(attendanceConstants.TABLE_CONFIG_KEY, attendanceTableConfigDefault);

  const { data: entityResponse, isFetching: isLoading } = useQuery({
    queryKey: [attendanceConstants.QUERY_KEY, queryParams],
    queryFn: () => getAttendances(queryParams as any),
    enabled: Boolean(queryParams),
  });

  const entityPager = useMemo(() => {
    return entityResponse?.data;
  }, [entityResponse]);

  useEffect(() => {
    if (entityPager) {
      setAttendanceCount(entityPager?.meta?.total || 0);
      if (setCurrentPageCount) {
        setCurrentPageCount(entityPager?.data?.length || 0);
      }
    }
  }, [entityPager, setAttendanceCount, setCurrentPageCount]);

  const handleDelete = useCallback(async () => {
    if (!primaryKeys || !primaryKeys[attendanceConstants.PRIMARY_KEY]) {
      console.error('Cannot delete: Missing primary keys');
      return;
    }
    await deleteEntityMutation.mutateAsync(primaryKeys);
    queryClient.invalidateQueries({ queryKey: [attendanceConstants.QUERY_KEY, queryParams], exact: false });
    dispatch(resetSelectedObj(attendanceConstants.ENTITY_KEY));
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
    (record: IAttendanceIndex) => {
      const id = (record as any)[attendanceConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot delete: Missing id');
        return;
      }
      dispatch(
        setForDelete({
          primaryKeys: { [attendanceConstants.PRIMARY_KEY]: id },
          label: (record as any)[attendanceConstants.LABEL_FIELD] || '',
          objKey: attendanceConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleView = useCallback(
    (record: IAttendanceIndex) => {
      const id = (record as any)[attendanceConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot view: Missing id');
        return;
      }
      dispatch(
        setForView({
          primaryKeys: { [attendanceConstants.PRIMARY_KEY]: id },
          label: (record as any)[attendanceConstants.LABEL_FIELD] || '',
          objKey: attendanceConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const handleEdit = useCallback(
    (record: IAttendanceIndex) => {
      const id = (record as any)[attendanceConstants.PRIMARY_KEY];
      if (!id) {
        console.error('Cannot edit: Missing id');
        return;
      }
      dispatch(
        setForEdit({
          primaryKeys: { [attendanceConstants.PRIMARY_KEY]: id },
          label: (record as any)[attendanceConstants.LABEL_FIELD] || '',
          objKey: attendanceConstants.ENTITY_KEY,
        }),
      );
    },
    [dispatch],
  );

  const actions: TableAction<IAttendanceIndex>[] = useMemo(() => {
    const list: TableAction<IAttendanceIndex>[] = [];

    list.push({
      key: 'view',
      icon: <Eye className="size-4" />,
      onClick: handleView,
      permission: {
        scope: user?.scope || '',
        module: attendanceConstants.PERMISSIONS.MODULE,
        resource: attendanceConstants.PERMISSIONS.RESOURCE,
        action: attendanceConstants.PERMISSIONS.ACTIONS.VIEW,
      },
    });

    list.push({
      key: 'edit',
      icon: <Edit className="size-4" />,
      onClick: handleEdit,
      permission: {
        scope: user?.scope || '',
        module: attendanceConstants.PERMISSIONS.MODULE,
        resource: attendanceConstants.PERMISSIONS.RESOURCE,
        action: attendanceConstants.PERMISSIONS.ACTIONS.EDIT,
      },
    });

    list.push({
      key: 'delete',
      icon: <Trash2 className="size-4 text-destructive" />,
      onClick: handleDeleteAction,
      className: 'text-destructive',
      permission: {
        scope: user?.scope || '',
        module: attendanceConstants.PERMISSIONS.MODULE,
        resource: attendanceConstants.PERMISSIONS.RESOURCE,
        action: attendanceConstants.PERMISSIONS.ACTIONS.DELETE,
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
    isConfigModified: Object.keys(attendanceTableConfigDefault).some((key) => (attendanceTableConfigDefault as any)[key as any] !== (tableConfiguration as any)[key as any]),
    tableConfiguration,
    handleDelete,
    isDeleteLoading: deleteEntityMutation.isPending,
    handleDeleteAction,
    handleEdit,
    handleView,

    user,
    entityName: attendanceConstants.ENTITY_NAME,
    entityKey: attendanceConstants.ENTITY_KEY,
    tableConfigKey: attendanceConstants.TABLE_CONFIG_KEY,
    defaultTableConfig: attendanceTableConfigDefault,
    totalCount: entityPager?.meta?.total || 0,
    columns,
    actions,
  };
};

// Export table columns for use in other components
export const attendanceTableColumns: TableColumn<IAttendanceIndex>[] = [
  { key: 'attendanceId', title: 'Attendance Id', dataIndex: 'attendanceId', sortable: false },
  { key: 'employee', title: 'Employee', dataIndex: 'firstName', sortable: false },
  { key: 'attendanceDate', title: 'Attendance Date', dataIndex: 'attendanceDate', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'checkInTime', title: 'Check In Time', dataIndex: 'checkInTime', sortable: false, render: (value) => (value ? formatDateTime(value) : '-') },
  { key: 'checkOutTime', title: 'Check Out Time', dataIndex: 'checkOutTime', sortable: false, render: (value) => (value ? formatDateTime(value) : '-') },
  { key: 'status', title: 'Status', dataIndex: 'status', sortable: false },
  { key: 'totalHour', title: 'Total Hour', dataIndex: 'totalHour', sortable: false },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
  { key: 'updatedAt', title: 'Updated At', dataIndex: 'updatedAt', sortable: false, render: (value) => (value ? formatDate(value) : '-') },
];
