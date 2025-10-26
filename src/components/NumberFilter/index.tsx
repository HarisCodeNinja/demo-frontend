import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NumberOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne';

export interface NumberFilterValue {
  operator: NumberOperator;
  value: number | '';
}

interface NumberFilterProps {
  label: string;
  placeholder?: string;
  value?: NumberFilterValue | null;
  onChange?: (filter: NumberFilterValue | null) => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  debounceDelay?: number;
}

const operatorOptions = [
  { value: 'eq', label: 'Equal to (=)', symbol: '=' },
  { value: 'gt', label: 'Greater than (>)', symbol: '>' },
  { value: 'gte', label: 'Greater than or equal (≥)', symbol: '≥' },
  { value: 'lt', label: 'Less than (<)', symbol: '<' },
  { value: 'lte', label: 'Less than or equal (≤)', symbol: '≤' },
  { value: 'ne', label: 'Not equal to (≠)', symbol: '≠' }
];

export const NumberFilter: React.FC<NumberFilterProps> = ({
  label,
  placeholder = "Enter value...",
  value,
  onChange,
  className,
  disabled = false,
  min,
  max,
  step = 1,
  debounceDelay = 300
}) => {
  const [operator, setOperator] = useState<NumberOperator>(value?.operator || 'eq');
  const [inputValue, setInputValue] = useState<string>(
    value?.value !== '' ? String(value?.value || '') : ''
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value === null || value === undefined) {
      setInputValue('');
      setOperator('eq');
    } else {
      setOperator(value.operator);
      setInputValue(value.value !== '' ? String(value.value) : '');
    }
  }, [value]);

  const handleOperatorChange = useCallback((newOperator: NumberOperator) => {
    setOperator(newOperator);
    
    if (inputValue !== '') {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange?.({ operator: newOperator, value: numValue });
      }
    }
  }, [inputValue, onChange]);

  const handleValueChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (newValue === '') {
        onChange?.(null);
      } else {
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          onChange?.({ operator, value: numValue });
        }
      }
    }, debounceDelay);
  }, [operator, onChange, debounceDelay]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setOperator('eq');
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    onChange?.(null);
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const currentOperator = operatorOptions.find(op => op.value === operator);
  const hasValue = inputValue !== '';

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex-shrink-0 min-w-[120px]">
          <Select 
            value={operator} 
            onValueChange={handleOperatorChange}
            disabled={disabled}
          >
            <SelectTrigger className="h-9">
              <SelectValue>
                <span className="flex items-center gap-1">
                  <span className="font-mono text-sm">{currentOperator?.symbol}</span>
                  <span className="text-xs text-muted-foreground">
                    {currentOperator?.value === 'eq' ? 'Equal' :
                     currentOperator?.value === 'gt' ? 'Greater' :
                     currentOperator?.value === 'gte' ? 'Greater/Equal' :
                     currentOperator?.value === 'lt' ? 'Less' :
                     currentOperator?.value === 'lte' ? 'Less/Equal' :
                     'Not Equal'}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{option.symbol}</span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 relative">
          <Input
            type="number"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="h-9 pr-8"
          />
          {hasValue && !disabled && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center z-10 hover:bg-gray-100 transition-colors"
              onClick={handleClear}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <X className="size-3 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </div>
      
      {hasValue && (
        <div className="text-xs text-muted-foreground">
          Filter: {label} {currentOperator?.symbol} {inputValue}
        </div>
      )}
    </div>
  );
};

export default NumberFilter;