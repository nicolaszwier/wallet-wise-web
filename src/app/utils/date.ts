export function formatDate(date: Date, locale: string) {
  return Intl.DateTimeFormat(locale, {
    dateStyle: "medium"
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