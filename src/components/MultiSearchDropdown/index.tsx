import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, X, ChevronDown } from 'lucide-react';

interface MultiSearchOption {
  value: string;
  label: string;
}

interface MultiSearchDropdownProps {
  options: MultiSearchOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  searchPlaceholder?: string;
  maxDisplay?: number;
}

export const MultiSearchDropdown: React.FC<MultiSearchDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  label,
  searchPlaceholder = "Search options...",
  maxDisplay = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option =>
    selectedValues.includes(option.value)
  );

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  const clearAll = () => {
    onChange([]);
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const displayText = selectedOptions.length === 0
    ? placeholder
    : selectedOptions.length <= maxDisplay
      ? selectedOptions.map(opt => opt.label).join(', ')
      : `${selectedOptions.slice(0, maxDisplay).map(opt => opt.label).join(', ')} +${selectedOptions.length - maxDisplay} more`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{displayText}</span>
            <div className="flex items-center gap-2">
              {selectedValues.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedValues.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 p-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    {option.label}
                  </label>
                </div>
              ))
            )}
          </div>
          {selectedValues.length > 0 && (
            <div className="p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="text-xs px-2 py-1"
            >
              {option.label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-destructive"
                onClick={() => handleRemove(option.value)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};