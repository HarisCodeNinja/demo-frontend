import { memo, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getWeeksInYear, getWeekStartDate } from '../utils';

interface WeekPickerProps {
  selectedDate?: Date;
  year: number;
  month: number;
  onWeekSelect: (weekStart: Date) => void;
}

/**
 * Optimized WeekPicker component
 * Shows all weeks in the selected year with scrolling
 * Auto-scrolls to the first week of the selected month
 */
export const WeekPicker = memo<WeekPickerProps>(({ selectedDate, year, month, onWeekSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Memoize weeks for the current year
  const weeks = useMemo(() => getWeeksInYear(year), [year]);

  // Get selected week start date for comparison
  const selectedWeekStart = useMemo(() => {
    if (!selectedDate) return null;
    return getWeekStartDate(selectedDate).getTime();
  }, [selectedDate]);

  // Find the index of the first week that contains days from the selected month
  const firstWeekIndexOfMonth = useMemo(() => {
    return weeks.findIndex((week) => {
      const weekStart = week.startDate;
      const weekEnd = week.endDate;
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return weekStart <= monthEnd && weekEnd >= monthStart;
    });
  }, [weeks, year, month]);

  // Auto-scroll to the first week of the selected month when month changes
  useEffect(() => {
    if (firstWeekIndexOfMonth !== -1 && scrollContainerRef.current) {
      setTimeout(() => {
        const targetWeek = scrollContainerRef.current?.querySelector(`[data-week-index="${firstWeekIndexOfMonth}"]`) as HTMLElement;
        if (targetWeek && scrollContainerRef.current) {
          const scrollTop = targetWeek.offsetTop - 12;
          scrollContainerRef.current.scrollTop = scrollTop;
        }
      }, 50);
    }
  }, [month, year, firstWeekIndexOfMonth]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        height: '300px',
        overflowY: 'scroll',
        overflowX: 'hidden'
      }}
    >
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {weeks.map((week, index) => {
          const weekStartTime = week.startDate.getTime();
          const isSelected = selectedWeekStart === weekStartTime;

          return (
            <Button
              key={`week-${week.weekNumber}-${week.year}`}
              data-week-index={index}
              variant={isSelected ? 'default' : 'ghost'}
              className={cn('w-full justify-start font-normal', isSelected && 'bg-primary text-primary-foreground')}
              onClick={() => onWeekSelect(week.startDate)}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">Week {week.weekNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                  {week.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
});

WeekPicker.displayName = 'WeekPicker';
