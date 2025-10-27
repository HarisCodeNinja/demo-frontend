import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import { AxiosResponse } from 'axios';

export interface InfiniteScrollOption {
  value: string;
  label: string;
}

interface InfiniteScrollDropdownProps {
  fetchData: (
    page: number,
    limit: number,
    search?: string
  ) => Promise<AxiosResponse<InfiniteScrollOption[], any>>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export const InfiniteScrollDropdown: React.FC<InfiniteScrollDropdownProps> = ({
  fetchData,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  searchPlaceholder = 'Search...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const scrollAreaRootRef = useRef<HTMLDivElement>(null);
  const [viewportEl, setViewportEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setViewportEl(null);
      return;
    }

    const id = requestAnimationFrame(() => {
      const root = scrollAreaRootRef.current;
      if (!root) return;
      const vp = root.querySelector<HTMLElement>(
        '[data-radix-scroll-area-viewport]'
      );
      setViewportEl(vp || null);
    });

    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const scrollContainerRef = useMemo(
    () => ({ current: viewportEl } as React.RefObject<HTMLElement | null>),
    [viewportEl]
  );

  const searchAwareFetch = useCallback(
    (page: number, limit: number) => fetchData(page, limit, debouncedSearchTerm),
    [fetchData, debouncedSearchTerm]
  );

  const { data, loading, hasMore, reset } = useInfiniteScroll<InfiniteScrollOption>({
    fetchData: searchAwareFetch,
    limit: 20,
    scrollContainer: scrollContainerRef,
    threshold: 100,
    enabled: !!viewportEl,
  });

  useEffect(() => {
    reset();
  }, [debouncedSearchTerm, reset]);

  const selectedOption = data.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled}
          >
            <span className="truncate">{displayText}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-60" ref={scrollAreaRootRef}>
            <div className="p-1">
              {data.length === 0 && !loading ? (
                <div className="p-3 text-sm text-muted-foreground text-center">
                  No options found
                </div>
              ) : (
                <>
                  {data.map(option => (
                    <div
                      key={option.value}
                      className="flex items-center p-2 hover:bg-accent cursor-pointer rounded-sm"
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}

                  {loading && hasMore && (
                    <div className="flex items-center justify-center p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}

                  {!hasMore && data.length > 0 && (
                    <div className="p-3 text-xs text-muted-foreground text-center">
                      All options loaded
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};
