// Venue, tiers and seat inventory for the Midnight Mona Tour.

export type TierId = 'floor' | 'lower' | 'upper';

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  rows: number;
  perRow: number;
  /** Seat colour for this tier (matches the checker palette). */
  color: string;
  /** How far (px) the row ends lift toward the stage, to fake a curved bowl. */
  curve: number;
}

export interface Seat {
  id: string;
  tier: Tier;
  row: string;
  number: number;
  sold: boolean;
  /** Vertical offset in px used to draw the curved bowl. */
  offsetY: number;
}

export const EVENT = {
  artist: 'Nova & the Lighthouses',
  tour: 'Midnight Mona Tour',
  date: 'Fri, Nov 14',
  doors: 'Doors 7pm',
  venue: 'Harborline Arena',
};

export const SERVICE_FEE_RATE = 0.12;

export const TIERS: Tier[] = [
  { id: 'floor', name: 'Floor', price: 185, rows: 3, perRow: 12, color: '#d9b84a', curve: 0 },
  { id: 'lower', name: 'Lower Bowl', price: 120, rows: 3, perRow: 18, color: '#e0662a', curve: 14 },
  { id: 'upper', name: 'Upper Bowl', price: 65, rows: 3, perRow: 22, color: '#5bbf55', curve: 22 },
];

const ROW_LETTERS = 'ABCDEFGHJK';

/** Deterministic "already sold" pattern so the demo looks the same every run. */
function isPreSold(tierIndex: number, row: number, seat: number): boolean {
  return (row * 7 + seat * 3 + tierIndex * 5) % 5 === 0 || (seat + row) % 9 === 4;
}

export function buildSeats(): Seat[] {
  const seats: Seat[] = [];
  TIERS.forEach((tier, ti) => {
    for (let r = 0; r < tier.rows; r++) {
      const half = (tier.perRow - 1) / 2;
      for (let i = 0; i < tier.perRow; i++) {
        const d = (i - half) / half;
        seats.push({
          id: `${tier.id}-${ROW_LETTERS[r]}${i + 1}`,
          tier,
          row: ROW_LETTERS[r],
          number: i + 1,
          sold: isPreSold(ti, r, i),
          offsetY: -Math.round(tier.curve * d * d),
        });
      }
    }
  });
  return seats;
}

export const money = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
