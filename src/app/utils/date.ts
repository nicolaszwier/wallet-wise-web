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

export function subtractMonth(date: Date, qty: number): Date {
  date.setMonth(date.getMonth() - qty)
  return date
}

export function addMonth(date: Date, qty: number): Date {
  date.setMonth(date.getMonth() + qty)
  return date
}