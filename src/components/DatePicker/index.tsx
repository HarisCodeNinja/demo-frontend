import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDatePicker } from './hooks/useDatePicker';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label = 'Select Date', placeholder = 'Pick a date', className, disabled = false }) => {
  const { isOpen, setIsOpen, currentMonth, setCurrentMonth, handleDateSelect, handleClear, handleMonthChange, handleYearChange, yearOptions, monthOptions } = useDatePicker({
    value,
    onChange,
  });

  const localDate = React.useMemo(() => {
    if (!value) return undefined;
    const date = new Date(value);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }, [value]);

  const displayDate = React.useMemo(() => {
    if (!localDate) return null;
    return format(localDate, 'PPP');
  }, [localDate]);

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')} disabled={disabled}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayDate || placeholder}
            </Button>
          </PopoverTrigger>
          {value && !disabled && (
            <button
              type="button"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center z-10"
              onClick={handleClear}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex gap-2">
              <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Calendar mode="single" selected={localDate} onSelect={handleDateSelect} month={currentMonth} onMonthChange={setCurrentMonth} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
