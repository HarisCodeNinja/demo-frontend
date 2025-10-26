import { useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';

export interface UseSearchFilterConfig<T> {
  defaultValues: T;
  debounceDelay?: number;
  onSearchChange?: (searchFilter: T) => void;
}

export interface UseSearchFilterReturn<T> {
  searchFilter: T;
  updateSearchFilter: (newFilter: T) => void;
  resetSearchFilter: () => void;
  isLoading: boolean;
  error: string | null;
  activeFilterCount: number;
  debouncedUpdateSearchFilter: (newFilter: T) => void;
}

export const useSearchFilter = <T extends Record<string, any>>({
  defaultValues,
  debounceDelay = 500,
  onSearchChange
}: UseSearchFilterConfig<T>): UseSearchFilterReturn<T> => {
  const [searchFilter, setSearchFilter] = useState<T>(defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized debounced function
  const debouncedUpdateSearchFilter = useMemo(
    () => debounce(
      (newFilter: T) => {
        setSearchFilter(newFilter);
        setIsLoading(true);
        onSearchChange?.(newFilter);
        // Reset loading state after a short delay
        setTimeout(() => setIsLoading(false), 300);
      },
      debounceDelay
    ),
    [debounceDelay, onSearchChange]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateSearchFilter.cancel();
    };
  }, [debouncedUpdateSearchFilter]);

  const updateSearchFilter = useCallback((newFilter: T) => {
    try {
      setError(null);
      setSearchFilter(newFilter);
      setIsLoading(true);
      onSearchChange?.(newFilter);
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search filter error:', err);
    }
  }, [onSearchChange]);

  const resetSearchFilter = useCallback(() => {
    try {
      setError(null);
      setSearchFilter(defaultValues);
      setIsLoading(true);
      onSearchChange?.(defaultValues);
      // Reset loading state after a short delay
      setTimeout(() => setIsLoading(false), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Reset search filter error:', err);
    }
  }, [defaultValues, onSearchChange]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(searchFilter).filter(key => {
      const value = searchFilter[key];
      return value !== undefined && value !== null && value !== '';
    }).length;
  }, [searchFilter]);

  return {
    searchFilter,
    updateSearchFilter,
    resetSearchFilter,
    isLoading,
    error,
    activeFilterCount,
    debouncedUpdateSearchFilter
  };
};
