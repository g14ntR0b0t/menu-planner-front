export function useCount() {
  return (value: number, locale = "es-MX", currency = "MXN") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }
}