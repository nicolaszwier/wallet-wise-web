export function formatDate(date: Date, locale: string) {
  return Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    //  timeZone: 'UTC'
  }).format(date);
}

/** Format a stored calendar date (UTC midnight) without timezone shifting the day. */
export function formatCalendarDate(date: Date | string, locale: string) {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(parsed);
}

/** Send local calendar date as YYYY-MM-DD (avoids toISOString timezone shift). */
export function toCalendarDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Parse a stored UTC calendar date into a local Date for date pickers. */
export function calendarDateToLocalDate(date: Date | string) {
  const dateOnly = typeof date === 'string' ? date.slice(0, 10) : toCalendarDateStringFromUtc(date);
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toCalendarDateStringFromUtc(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortDate(date: Date, locale: string) {
  return Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    // timeZone: 'UTC' //using this to format the periods, in this case should not consider the timezone so its using utc
  }).format(date);
}

export function getMonthFromDate(date: Date, locale: string) {
  return Intl.DateTimeFormat(locale, {
    month: "long"
  }).format(date);
}

export function getRelativeDate(date: Date, amount: number, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const newDate = new Date(date)
  
  switch (unit) {
    case 'day':
      newDate.setDate(newDate.getDate() + amount)
      break
    case 'week':
      newDate.setDate(newDate.getDate() + (amount * 7))
      break
    case 'month':
      newDate.setMonth(newDate.getMonth() + amount)
      break
    case 'year':
      newDate.setFullYear(newDate.getFullYear() + amount)
      break
  }
  
  return newDate
}

export function formatMonthYear(month: number, year: number, locale: string) {
  const date = new Date(year, month - 1);
  return Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isAfterCurrentDate(date: Date): boolean {
  const currentDate = new Date()
  // Reset hours to compare just the dates
  currentDate.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  
  return compareDate > currentDate
}