import React from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ 
    value, 
    onClear, 
    showClearButton = true, 
    className, 
    disabled,
    readOnly,
    ...props 
  }, ref) => {
    const hasValue = Boolean(value?.length);
    const shouldShowClear = showClearButton && hasValue && !disabled && !readOnly;

    const handleClear = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClear?.();
    }, [onClear]);

    return (
      <div className="relative group">
        <Input
          ref={ref}
          value={value || ''}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary",
            shouldShowClear && "pr-10",
            "hover:border-primary/50",
            className
          )}
          {...props}
        />
        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-6 h-6 rounded-full flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring",
              "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
              hasValue && "opacity-60 hover:opacity-100"
            )}
            tabIndex={-1}
            aria-label="Clear input"
          >
            <X size={12} className="shrink-0" />
          </button>
        )}
      </div>
    );
  }
);

ClearableInput.displayName = 'ClearableInput';

export default ClearableInput;