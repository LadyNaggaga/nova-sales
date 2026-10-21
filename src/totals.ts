export interface CheckoutTotals {
  subtotal: number;
  fee: number;
  total: number;
}

export function calculateTotals(prices: number[], feeRate: number): CheckoutTotals {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  const fee = Math.round(subtotal * feeRate * 100) / 100;
  return { subtotal, fee, total: subtotal + fee };
}
