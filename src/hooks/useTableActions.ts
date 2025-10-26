import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openChildDrawer } from '@/store/slice/childObjSlice';
import { setTableConfiguration } from '@/store/slice/tableConfigurationSlice';
import { CACHE_TOKEN } from '@/config/app';
import { isEmpty } from 'lodash';
import type { ChildObj } from '@/interface/common';

// Hook to handle relational clicks.
export function useHandleRelationalClick(): (objKey: string, obj: Partial<ChildObj>) => void {
  const dispatch = useAppDispatch();
  return (objKey: string, obj: Partial<ChildObj>) => {
    dispatch(openChildDrawer({ objKey, filterKeys: obj.filterKeys!, label: obj.label! }));
  };
}

// Hook to initialize table configuration on mount.
export function useInitializeTableConfig(tableKey:string, tableConfigDefault: any) {
  const dispatch = useAppDispatch();
  const tableConfiguration = useAppSelector((state) => state.tableConfiguration[tableKey]);
  useEffect(() => {
    if (isEmpty(tableConfiguration) || tableConfiguration.token !== CACHE_TOKEN) {
      dispatch(
        setTableConfiguration({
          name: tableKey,
          data: { ...tableConfigDefault, token: CACHE_TOKEN },
        }),
      );
    }
  }, [tableConfiguration, dispatch]);
}

// Hook to update count when data changes.
export function useUpdateCount(data: any, setCount: React.Dispatch<React.SetStateAction<number | null>>) {
  useEffect(() => {
    if (data) setCount(data?.length);
  }, [data, setCount]);
}
