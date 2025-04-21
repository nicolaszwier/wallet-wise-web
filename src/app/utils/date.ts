export function formatDate(date: Date, locale: string) {
  return Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    //  timeZone: 'UTC'
  }).format(date);
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

export function isAfterCurrentDate(date: Date): boolean {
  const currentDate = new Date()
  // Reset hours to compare just the dates
  currentDate.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  
  return compareDate > currentDate
}