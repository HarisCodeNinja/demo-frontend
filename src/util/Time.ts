export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const getOrdinal = (n: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  return `${day}${getOrdinal(day)} of ${month}, ${year}`;
};

export function formatDateTime(isoDate: string, includeTime: boolean = true): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const year = date.getUTCFullYear();

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  let formatted = `${day}${getDaySuffix(day)} of ${month}, ${year}`;

  if (includeTime) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const period = hours < 12 ? 'AM' : 'PM';

    formatted += ` at ${formattedHours}:${formattedMinutes} ${period}`;
  }

  return formatted;
}
