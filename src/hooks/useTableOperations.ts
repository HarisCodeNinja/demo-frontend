import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { PagerState } from '@/interface/common';
import { PAGER_SIZE } from '@/config/constant';

export type SortDirection = 'asc' | 'desc';
export type SortState = Array<{ column: string; direction: SortDirection }>;

export const useTableOperations = (filterKeys: any = {}, multiSortEnabled: boolean = false) => {
  const [pager, setPager] = useState<PagerState>({ page: 1, pageSize: PAGER_SIZE });
  const [sortState, setSortState] = useState<SortState>([]);
  const prevFilterKeysRef = useRef<string | null>(null);

  // Reset page to 1 when filterKeys change
  useEffect(() => {
    const filterKeysStr = JSON.stringify(filterKeys);
    if (prevFilterKeysRef.current !== undefined && prevFilterKeysRef.current !== filterKeysStr) {
      setPager((prev) => ({ ...prev, page: 1 }));
    }
    prevFilterKeysRef.current = filterKeysStr;
  }, [filterKeys]);

  // Convert sort state to backend format: 'username,-email'
  const sortString = useMemo(() => {
    return sortState.map((sort) => (sort.direction === 'desc' ? `-${sort.column}` : sort.column)).join(',');
  }, [sortState]);

  const queryParams = useMemo(
    () => ({
      page: pager.page - 1,
      pageSize: pager.pageSize,
      ...(sortString && { sort: sortString }),
      ...filterKeys,
    }),
    [pager, sortString, filterKeys],
  );

  const handleSort = useCallback(
    (columnKey: string, forceMultiSort: boolean = false) => {
      setSortState((prevSort) => {
        const existingIndex = prevSort.findIndex((s) => s.column === columnKey);
        const useMultiSort = multiSortEnabled || forceMultiSort;

        if (!useMultiSort) {
          if (existingIndex === -1) {
            return [{ column: columnKey, direction: 'asc' }];
          } else {
            const currentSort = prevSort[existingIndex];
            if (currentSort.direction === 'asc') {
              return [{ column: columnKey, direction: 'desc' }];
            } else {
              return [];
            }
          }
        } else {
          if (existingIndex === -1) {
            return [...prevSort, { column: columnKey, direction: 'asc' }];
          } else {
            const currentSort = prevSort[existingIndex];
            if (currentSort.direction === 'asc') {
              const newSort = [...prevSort];
              newSort[existingIndex] = { column: columnKey, direction: 'desc' };
              return newSort;
            } else {
              return prevSort.filter((s) => s.column !== columnKey);
            }
          }
        }
      });

      setPager((prev) => ({ ...prev, page: 1 }));
    },
    [multiSortEnabled],
  );

  const getSortDirection = useCallback(
    (columnKey: string): SortDirection | null => {
      const sort = sortState.find((s) => s.column === columnKey);
      return sort ? sort.direction : null;
    },
    [sortState],
  );

  const getSortIndex = useCallback(
    (columnKey: string): number | null => {
      const index = sortState.findIndex((s) => s.column === columnKey);
      return index === -1 ? null : index + 1;
    },
    [sortState],
  );

  return {
    pager,
    setPager,
    sortState,
    setSortState,
    sortString,
    queryParams,
    handleSort,
    getSortDirection,
    getSortIndex,
  };
};
