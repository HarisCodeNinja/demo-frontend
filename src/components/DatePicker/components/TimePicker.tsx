import { memo, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { generateHourOptions, generateMinuteOptions, padZero } from '../utils';

interface TimePickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  disabled?: boolean;
}

/**
 * Optimized TimePicker component for datetime mode
 * Memoized to prevent unnecessary re-renders
 */
export const TimePicker = memo<TimePickerProps>(({ hour, minute, onChange, disabled = false }) => {
  // Memoize options to avoid regeneration
  const hourOptions = useMemo(() => generateHourOptions(), []);
  const minuteOptions = useMemo(() => generateMinuteOptions(), []);

  const handleHourChange = (value: string) => {
    onChange(Number.parseInt(value), minute);
  };

  const handleMinuteChange = (value: string) => {
    onChange(hour, Number.parseInt(value));
  };

  return (
    <div className="border-t pt-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time</span>
      </div>
      <div className="flex gap-2">
        <Select value={hour.toString()} onValueChange={handleHourChange} disabled={disabled}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {hourOptions.map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {padZero(h)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex items-center text-xl font-semibold">:</span>
        <Select value={minute.toString()} onValueChange={handleMinuteChange} disabled={disabled}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {minuteOptions.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {padZero(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

TimePicker.displayName = 'TimePicker';
