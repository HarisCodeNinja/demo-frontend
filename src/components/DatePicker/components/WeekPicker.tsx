import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getWeeksInYear, getWeekStartDate } from '../utils';

interface WeekPickerProps {
  selectedDate?: Date;
  year: number;
  onWeekSelect: (weekStart: Date) => void;
}

/**
 * Optimized WeekPicker component
 * Shows all weeks in the selected year with virtualized scrolling
 * Memoized to prevent unnecessary re-renders
 */
export const WeekPicker = memo<WeekPickerProps>(({ selectedDate, year, onWeekSelect }) => {
  // Memoize weeks for the current year
  const weeks = useMemo(() => getWeeksInYear(year), [year]);

  // Get selected week start date for comparison
  const selectedWeekStart = useMemo(() => {
    if (!selectedDate) return null;
    return getWeekStartDate(selectedDate).getTime();
  }, [selectedDate]);

  return (
    <ScrollArea className="h-[300px] pr-3">
      <div className="space-y-1">
        {weeks.map((week) => {
          const weekStartTime = week.startDate.getTime();
          const isSelected = selectedWeekStart === weekStartTime;

          return (
            <Button
              key={`week-${week.weekNumber}-${week.year}`}
              variant={isSelected ? 'default' : 'ghost'}
              className={cn('w-full justify-start font-normal', isSelected && 'bg-primary text-primary-foreground')}
              onClick={() => onWeekSelect(week.startDate)}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Week {week.weekNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {week.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
});

WeekPicker.displayName = 'WeekPicker';
