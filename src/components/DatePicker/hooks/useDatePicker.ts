import { useState, useCallback, useMemo } from 'react';
import { DatePickerMode } from '../types';
import { MONTH_OPTIONS, generateYearOptions, getWeekNumber } from '../utils';

interface UseDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: DatePickerMode;
  minDate?: Date;
  maxDate?: Date;
  yearsBack?: number;
  yearsAhead?: number;
}

/**
 * Optimized hook for DatePicker with memoization and performance optimization
 * Supports multiple modes: date, datetime, week, month
 */
export const useDatePicker = ({ value, onChange, mode = 'date', minDate, maxDate, yearsBack = 50, yearsAhead = 50 }: UseDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(() => (value ? value.getHours() : 0));
  const [selectedMinute, setSelectedMinute] = useState<number>(() => (value ? value.getMinutes() : 0));

  // Initialize current month based on value or current date
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (value) {
      return new Date(value.getFullYear(), value.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  // Memoized year options (only recreate if parameters change)
  const yearOptions = useMemo(() => generateYearOptions(yearsBack, yearsAhead, minDate, maxDate), [yearsBack, yearsAhead, minDate, maxDate]);

  // Handle date selection based on mode
  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange?.(undefined);
        setIsOpen(false);
        return;
      }

      let finalDate: Date;

      switch (mode) {
        case 'datetime':
          // Combine date with selected time
          finalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedHour, selectedMinute);
          break;

        case 'week':
          // Set to the start of the week (Monday) at noon to avoid timezone issues
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          finalDate = new Date(date.getFullYear(), date.getMonth(), diff, 12, 0, 0, 0);
          break;

        case 'month':
          // Set to the first day of the month at noon to avoid timezone issues
          finalDate = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
          break;

        case 'date':
        default:
          // Standard date selection - set time to noon to avoid timezone issues
          finalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
          break;
      }

      onChange?.(finalDate);
      if (mode !== 'datetime') {
        setIsOpen(false);
      }
    },
    [mode, onChange, selectedHour, selectedMinute],
  );

  // Handle time change for datetime mode
  const handleTimeChange = useCallback(
    (hour: number, minute: number) => {
      setSelectedHour(hour);
      setSelectedMinute(minute);

      if (value) {
        const newDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, minute);
        onChange?.(newDate);
      }
    },
    [value, onChange],
  );

  // Handle clear button
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(undefined);
      setSelectedHour(0);
      setSelectedMinute(0);
    },
    [onChange],
  );

  // Handle month change
  const handleMonthChange = useCallback((month: string) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(Number.parseInt(month));
      return newDate;
    });
  }, []);

  // Handle year change
  const handleYearChange = useCallback((year: string) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(Number.parseInt(year));
      return newDate;
    });
  }, []);

  // Handle month-only selection
  const handleMonthSelect = useCallback(
    (month: number, year: number) => {
      const date = new Date(year, month, 1, 12, 0, 0, 0);
      onChange?.(date);
      setIsOpen(false);
    },
    [onChange],
  );

  // Handle week selection
  const handleWeekSelect = useCallback(
    (weekStart: Date) => {
      onChange?.(weekStart);
      setIsOpen(false);
    },
    [onChange],
  );

  // Get current week number for display
  const currentWeekNumber = useMemo(() => {
    if (value && mode === 'week') {
      return getWeekNumber(value);
    }
    return null;
  }, [value, mode]);

  return {
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
    monthOptions: MONTH_OPTIONS,
    currentWeekNumber,
  };
};
