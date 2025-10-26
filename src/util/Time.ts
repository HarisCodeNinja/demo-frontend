export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const getOrdinal = (n: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  return `${day}${getOrdinal(day)} of ${month}, ${year}`;
}