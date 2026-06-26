const DEFAULT_CURRENCY = "USD";

export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotalPrice(
  pricePerNight: number,
  nights: number,
  guests = 1,
): number {
  if (nights <= 0 || pricePerNight < 0 || guests < 1) {
    return 0;
  }

  return pricePerNight * nights;
}
