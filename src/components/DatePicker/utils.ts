import { MonthOption, WeekData } from './types';

/**
 * Constant month options to avoid recreation on every render
 */
export const MONTH_OPTIONS: readonly MonthOption[] = [
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
] as const;

/**
 * Generate year options based on custom year range or min/max dates
 * @param yearsBack - How many years back from current year to show (default: 50)
 * @param yearsAhead - How many years ahead from current year to show (default: 50)
 * @param minDate - Optional minimum date (will override yearsBack if more restrictive)
 * @param maxDate - Optional maximum date (will override yearsAhead if more restrictive)
 */
export const generateYearOptions = (
	yearsBack: number = 50,
	yearsAhead: number = 50,
	minDate?: Date,
	maxDate?: Date
): number[] => {
	const currentYear = new Date().getFullYear();

	// Calculate min/max years based on yearsBack/yearsAhead
	let minYear = currentYear - yearsBack;
	let maxYear = currentYear + yearsAhead;

	// Override with minDate/maxDate if they are more restrictive
	if (minDate) {
		minYear = Math.max(minYear, minDate.getFullYear());
	}
	if (maxDate) {
		maxYear = Math.min(maxYear, maxDate.getFullYear());
	}

	const length = maxYear - minYear + 1;
	return Array.from({ length }, (_, i) => minYear + i);
};

/**
 * Get week number for a given date (ISO 8601 week date system)
 * Returns week number (1-53)
 */
export const getWeekNumber = (date: Date): number => {
	const tempDate = new Date(date.getTime());
	tempDate.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year
	tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
	// January 4 is always in week 1
	const week1 = new Date(tempDate.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1
	return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

/**
 * Get the start date of the week for a given date (Monday)
 */
export const getWeekStartDate = (date: Date): Date => {
	const dayOfWeek = date.getDay();
	const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
	return new Date(date.getFullYear(), date.getMonth(), diff);
};

/**
 * Get the end date of the week for a given date (Sunday)
 */
export const getWeekEndDate = (date: Date): Date => {
	const startDate = getWeekStartDate(date);
	return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
};

/**
 * Get all weeks in a given year
 */
export const getWeeksInYear = (year: number): WeekData[] => {
	const weeks: WeekData[] = [];
	const firstDayOfYear = new Date(year, 0, 1);
	const lastDayOfYear = new Date(year, 11, 31);

	let currentDate = getWeekStartDate(firstDayOfYear);

	while (currentDate <= lastDayOfYear) {
		const weekStart = new Date(currentDate);
		const weekEnd = getWeekEndDate(weekStart);
		const weekNumber = getWeekNumber(weekStart);

		// Only include weeks that have at least one day in the current year
		if (weekStart.getFullYear() === year || weekEnd.getFullYear() === year) {
			weeks.push({
				weekNumber,
				startDate: weekStart,
				endDate: weekEnd,
				year,
			});
		}

		// Move to next week
		currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
	}

	return weeks;
};

/**
 * Format date display based on mode
 */
export const formatDateDisplay = (date: Date | undefined, mode: string): string => {
	if (!date) return '';

	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

	switch (mode) {
		case 'datetime':
			return date.toLocaleString('en-US', {
				...options,
				hour: '2-digit',
				minute: '2-digit',
			});

		case 'week': {
			const weekStart = getWeekStartDate(date);
			const weekEnd = getWeekEndDate(date);
			const weekNum = getWeekNumber(date);
			return `Week ${weekNum}, ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
		}

		case 'month':
			return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

		case 'date':
		default:
			return date.toLocaleDateString('en-US', options);
	}
};

/**
 * Generate hour options (0-23)
 */
export const generateHourOptions = (): number[] => {
	return Array.from({ length: 24 }, (_, i) => i);
};

/**
 * Generate minute options (0-59 in 5-minute intervals for better UX)
 */
export const generateMinuteOptions = (): number[] => {
	return Array.from({ length: 12 }, (_, i) => i * 5);
};

/**
 * Pad number with leading zero
 */
export const padZero = (num: number): string => {
	return num.toString().padStart(2, '0');
};
