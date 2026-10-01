export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

/** Formats a month+year date range (startDate/endDate as "YYYY-MM-01", endDate null = ongoing). */
export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatMonthYear(startDate);
  if (endDate === null) {
    return `${start} - présent`;
  }
  if (endDate === startDate) {
    return start;
  }
  return `${start} - ${formatMonthYear(endDate)}`;
}

function formatMonthYear(date: string): string {
  const [year, month] = date.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}
