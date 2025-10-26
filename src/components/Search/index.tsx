import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchInputProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  debounceDelay?: number;
  className?: string;
  containerClassName?: string;
  defaultValue?: string;
  value?: string;
  onReset?: () => void;
  autoSearch?: boolean;
  onChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceDelay = 500,
  className = '',
  containerClassName = '',
  defaultValue = '',
  value,
  onReset,
  autoSearch = true,
  onChange,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(defaultValue);
  const isControlled = value !== undefined;
  const searchTerm = isControlled ? value : internalSearchTerm;
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
  const hasUserInteracted = useRef(false);
  const lastSearchedTerm = useRef(isControlled ? value : defaultValue);

  useEffect(() => {
    if (autoSearch && (hasUserInteracted.current || debouncedSearchTerm.trim() !== '')) {
      if (debouncedSearchTerm !== lastSearchedTerm.current) {
        onSearch(debouncedSearchTerm);
        lastSearchedTerm.current = debouncedSearchTerm;
      }
    }
  }, [debouncedSearchTerm, onSearch, autoSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalSearchTerm(newValue);
    }

    if (!hasUserInteracted.current) {
      hasUserInteracted.current = true;
    }
  };

  const handleClear = () => {
    if (isControlled) {
      onChange?.('');
    } else {
      setInternalSearchTerm('');
    }
    hasUserInteracted.current = true;
    lastSearchedTerm.current = '';

    onSearch('');

    if (onReset) {
      onReset();
    }
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <Input placeholder={placeholder} className={`pr-9 ${className}`} value={searchTerm} onChange={handleSearchChange} />
      {searchTerm && (
        <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" type="button">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
