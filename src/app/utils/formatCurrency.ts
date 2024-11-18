export function formatCurrency(value: number, currency: string, locale: string) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
