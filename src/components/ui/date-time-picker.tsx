'use client';

import * as React from 'react';
import { CalendarIcon, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({ value, onChange, placeholder = 'Pick a date and time', disabled = false, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value || undefined);
  const [timeValue, setTimeValue] = React.useState<string>(value ? format(value, 'HH:mm') : '00:00');

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTimeValue(format(value, 'HH:mm'));
    } else {
      setSelectedDate(undefined);
      setTimeValue('00:00');
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange(undefined);
      return;
    }

    // Preserve the time when selecting a new date
    const [hours, minutes] = timeValue.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    setSelectedDate(date);
    onChange(date);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(undefined);
    setTimeValue('00:00');
    onChange(undefined);
  };

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground', className)} disabled={disabled}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, 'PPP HH:mm') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        {selectedDate && !disabled && (
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
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input type="time" value={timeValue} onChange={handleTimeChange} className="w-full" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
