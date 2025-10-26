import { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface UseDateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export const useDateRangePicker = ({ 
  value, 
  onChange, 
  placeholder = 'Pick a date range' 
}: UseDateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => value?.from || new Date());

  const handleRangeSelect = (range: DateRange | undefined) => {
    onChange?.(range);
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(undefined);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(month));
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  const formatDateRange = () => {
    if (!value?.from) return placeholder;
    if (value.from && !value.to) return format(value.from, 'LLL dd, y');
    if (value.from && value.to) {
      return `${format(value.from, 'LLL dd, y')} - ${format(value.to, 'LLL dd, y')}`;
    }
    return placeholder;
  };

  // Generate year options (current year ± 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);
  
  // Generate month options
  const monthOptions = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  return {
    isOpen,
    setIsOpen,
    currentMonth,
    setCurrentMonth,
    handleRangeSelect,
    handleClear,
    handleMonthChange,
    handleYearChange,
    formatDateRange,
    yearOptions,
    monthOptions,
  };
};