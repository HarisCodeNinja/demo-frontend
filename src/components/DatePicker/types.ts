/**
 * DatePicker mode types
 */
export type DatePickerMode = 'date' | 'datetime' | 'week' | 'month';

/**
 * Base props for DatePicker component
 */
export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: DatePickerMode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showClearButton?: boolean;
  yearsBack?: number; // How many years back from current year to show (default: 50)
  yearsAhead?: number; // How many years ahead from current year to show (default: 50)
}

/**
 * Month option interface
 */
export interface MonthOption {
  value: string;
  label: string;
}

/**
 * Week data interface
 */
export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  year: number;
}
