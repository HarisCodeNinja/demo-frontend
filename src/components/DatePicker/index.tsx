import { memo, useMemo } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDatePicker } from './hooks/useDatePicker';
import { DatePickerProps } from './types';
import { formatDateDisplay } from './utils';
import { TimePicker } from './components/TimePicker';
import { WeekPicker } from './components/WeekPicker';
import { MonthPicker } from './components/MonthPicker';

/**
 * Highly optimized, all-in-one DatePicker component
 * Supports multiple modes: date, datetime, week, month
 * Implements React best practices with memoization and performance optimization
 *
 * @example
 * // Date picker (default)
 * <DatePicker value={date} onChange={setDate} />
 *
 * // DateTime picker
 * <DatePicker mode="datetime" value={date} onChange={setDate} />
 *
 * // Week picker
 * <DatePicker mode="week" value={date} onChange={setDate} />
 *
 * // Month picker
 * <DatePicker mode="month" value={date} onChange={setDate} />
 */
export const DatePicker = memo<DatePickerProps>(({ value, onChange, mode = 'date', placeholder, className, disabled = false, minDate, maxDate, showClearButton = true }) => {
  const {
    isOpen,
    setIsOpen,
    currentMonth,
    setCurrentMonth,
    selectedHour,
    selectedMinute,
    handleDateSelect,
    handleTimeChange,
    handleClear,
    handleMonthChange,
    handleYearChange,
    handleMonthSelect,
    handleWeekSelect,
    yearOptions,
    monthOptions,
  } = useDatePicker({
    value,
    onChange,
    mode,
    minDate,
    maxDate,
  });

  // Memoize display text for performance
  const displayText = useMemo(() => {
    if (!value) {
      return placeholder || `Select ${mode === 'datetime' ? 'date & time' : mode}`;
    }
    return formatDateDisplay(value, mode);
  }, [value, mode, placeholder]);

  // Determine popover width based on mode
  const popoverClassName = useMemo(() => {
    if (mode === 'week') return 'w-[400px] p-0';
    if (mode === 'month') return 'w-[320px] p-0';
    return 'w-auto p-0';
  }, [mode]);

  // Render header controls (month/year selectors)
  const renderHeaderControls = useMemo(() => {
    if (mode === 'month') return null; // Month mode shows year selector in content

    return (
      <div className="p-3 border-b">
        <div className="flex gap-2">
          <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
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
            <SelectContent className="max-h-[200px]">
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }, [mode, currentMonth, handleMonthChange, handleYearChange, yearOptions, monthOptions]);

  // Render appropriate picker based on mode
  const renderPicker = useMemo(() => {
    switch (mode) {
      case 'week':
        return <WeekPicker selectedDate={value} year={currentMonth.getFullYear()} onWeekSelect={handleWeekSelect} />;

      case 'month':
        return <MonthPicker selectedDate={value} year={currentMonth.getFullYear()} onMonthSelect={handleMonthSelect} />;

      case 'datetime':
      case 'date':
      default:
        return (
          <>
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
            {mode === 'datetime' && (
              <div className="px-3 pb-3">
                <TimePicker hour={selectedHour} minute={selectedMinute} onChange={handleTimeChange} disabled={!value} />
              </div>
            )}
          </>
        );
    }
  }, [mode, value, currentMonth, handleDateSelect, handleWeekSelect, handleMonthSelect, setCurrentMonth, selectedHour, selectedMinute, handleTimeChange, minDate, maxDate]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', className)} disabled={disabled}>
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{displayText}</span>
          </Button>
        </PopoverTrigger>
        {value && !disabled && showClearButton && (
          <button
            type="button"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full flex items-center justify-center z-10 hover:bg-muted transition-colors"
            onClick={handleClear}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Clear selection">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      <PopoverContent className={popoverClassName} align="start">
        {renderHeaderControls}
        {renderPicker}
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
