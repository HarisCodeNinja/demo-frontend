import { useState, useCallback, useRef, useEffect } from 'react';
import { AxiosResponse } from 'axios';

export interface InfiniteScrollOptions<T> {
  fetchData: (page: number, limit: number) => Promise<AxiosResponse<T[], any>>;
  limit?: number;
  initialPage?: number;
  scrollContainer?: React.RefObject<HTMLElement | null>;
  threshold?: number;
  enabled?: boolean;
}

export const useInfiniteScroll = <T>({
  fetchData,
  limit = 20,
  initialPage = 1,
  scrollContainer,
  threshold = 100,
  enabled = true,
}: InfiniteScrollOptions<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!enabled || loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetchData(page, limit);
      const newData = response.data;

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prev =>
          page === initialPage ? newData : [...prev, ...newData]
        );
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [enabled, fetchData, page, limit, hasMore, initialPage]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    loadingRef.current = false;
  }, [initialPage]);

  const handleScroll = useCallback(
    (event: Event) => {
      if (!enabled || !hasMore || loading) return;

      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    },
    [enabled, hasMore, loading, loadMore, threshold]
  );

  useEffect(() => {
    if (!enabled || !scrollContainer?.current) return;

    const container = scrollContainer.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, handleScroll, scrollContainer]);

  useEffect(() => {
    if (!enabled || scrollContainer) return;

    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [enabled, loadMore, hasMore, loading, scrollContainer, threshold]);

  useEffect(() => {
    if (!enabled) return;
    if (page === initialPage && data.length === 0 && !loading) {
      loadMore();
    }
  }, [enabled, page, initialPage, data.length, loading, loadMore]);

  return {
    data,
    loading,
    hasMore,
    observerRef,
    reset,
    loadMore,
  };
};
