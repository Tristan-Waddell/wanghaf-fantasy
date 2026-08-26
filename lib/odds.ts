export const PARLAY_STAKE = 10;

export function parseAmericanOdds(value: string): number | null {
  const normalized = value.trim();

  if (!/^[+-]?\d+$/.test(normalized)) {
    return null;
  }

  const odds = Number.parseInt(normalized, 10);
  const valid =
    (odds >= 100 && odds <= 100_000) ||
    (odds <= -101 && odds >= -100_000);

  return valid ? odds : null;
}

export function americanToDecimal(odds: number): number {
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
}

export function calculateParlay(odds: readonly number[], stake = PARLAY_STAKE) {
  if (odds.length === 0) {
    return { decimalOdds: 0, profit: 0, totalReturn: 0 };
  }

  const decimalOdds = odds.reduce(
    (combined, current) => combined * americanToDecimal(current),
    1,
  );

  return {
    decimalOdds,
    profit: stake * (decimalOdds - 1),
    totalReturn: stake * decimalOdds,
  };
}

export function formatAmericanOdds(odds: number) {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

