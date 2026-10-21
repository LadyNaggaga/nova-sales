import { describe, expect, it } from 'vitest';
import { calculateTotals } from './totals';

describe('calculateTotals', () => {
  it('calculates the service fee and total for mixed ticket tiers', () => {
    expect(calculateTotals([185, 120, 65], 0.12)).toEqual({
      subtotal: 370,
      fee: 44.4,
      total: 414.4,
    });
  });

  it('rounds the aggregate service fee to cents', () => {
    expect(calculateTotals([10.01, 10.02], 0.12)).toEqual({
      subtotal: 20.03,
      fee: 2.4,
      total: 22.43,
    });
  });
});
