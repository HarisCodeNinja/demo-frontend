import { memo, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MONTH_OPTIONS, generateYearOptions } from '../utils';

interface MonthPickerProps {
  selectedDate?: Date;
  year: number;
  onMonthSelect: (month: number, year: number) => void;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Optimized MonthPicker component
 * Shows a 3x4 grid of months for quick selection with year navigation
 * Memoized to prevent unnecessary re-renders
 */
export const MonthPicker = memo<MonthPickerProps>(({ selectedDate, year: initialYear, onMonthSelect, minDate, maxDate }) => {
  const [currentYear, setCurrentYear] = useState(initialYear);

  // Get selected month and year for comparison
  const selectedMonthYear = useMemo(() => {
    if (!selectedDate) return null;
    return `${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  // Generate year options
  const yearOptions = useMemo(() => generateYearOptions(minDate, maxDate), [minDate, maxDate]);

  // Handle year navigation
  const handlePreviousYear = () => {
    setCurrentYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prev) => prev + 1);
  };

  const handleYearChange = (value: string) => {
    setCurrentYear(Number.parseInt(value));
  };

  return (
    <div>
      {/* Year selector header */}
      <div className="p-3 border-b flex items-center justify-between gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePreviousYear} disabled={minDate && currentYear <= minDate.getFullYear()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select value={currentYear.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[120px] h-8">
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

        <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextYear} disabled={maxDate && currentYear >= maxDate.getFullYear()}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {MONTH_OPTIONS.map((month) => {
          const monthIndex = Number.parseInt(month.value);
          const isSelected = selectedMonthYear === `${monthIndex}-${currentYear}`;

          return (
            <Button
              key={month.value}
              variant={isSelected ? 'default' : 'outline'}
              className={cn('h-14 font-normal', isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90')}
              onClick={() => onMonthSelect(monthIndex, currentYear)}>
              {month.label.substring(0, 3)}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

MonthPicker.displayName = 'MonthPicker';
