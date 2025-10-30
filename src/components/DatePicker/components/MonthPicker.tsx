import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MONTH_OPTIONS } from '../utils';

interface MonthPickerProps {
  selectedDate?: Date;
  year: number;
  onMonthSelect: (month: number, year: number) => void;
}

/**
 * Optimized MonthPicker component
 * Shows a 3x4 grid of months for quick selection
 * Memoized to prevent unnecessary re-renders
 */
export const MonthPicker = memo<MonthPickerProps>(({ selectedDate, year, onMonthSelect }) => {
  // Get selected month and year for comparison
  const selectedMonthYear = useMemo(() => {
    if (!selectedDate) return null;
    return `${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {MONTH_OPTIONS.map((month) => {
        const monthIndex = Number.parseInt(month.value);
        const isSelected = selectedMonthYear === `${monthIndex}-${year}`;

        return (
          <Button
            key={month.value}
            variant={isSelected ? 'default' : 'outline'}
            className={cn('h-14 font-normal', isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90')}
            onClick={() => onMonthSelect(monthIndex, year)}>
            {month.label.substring(0, 3)}
          </Button>
        );
      })}
    </div>
  );
});

MonthPicker.displayName = 'MonthPicker';
