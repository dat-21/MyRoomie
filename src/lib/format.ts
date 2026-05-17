/**
 * Format a number as Vietnamese Dong (VND) currency.
 * @example formatCurrency(5000000) → "5.000.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
