export const PICK_RESULTS = ["hit", "push", "miss"] as const;

export type PickResult = (typeof PICK_RESULTS)[number];

export function isPickResult(value: unknown): value is PickResult {
  return typeof value === "string" && PICK_RESULTS.includes(value as PickResult);
}

export function getPriorWeekNumber(weekNumber: number) {
  return weekNumber > 1 ? weekNumber - 1 : null;
}

export function missingPickNames(
  entries: Array<{ displayName: string; betText: string | null }>,
) {
  return entries
    .filter((entry) => entry.betText === null)
    .map((entry) => entry.displayName);
}

export function missedPickNames(
  picks: Array<{ displayName: string; result: PickResult | null }>,
) {
  return picks
    .filter((pick) => pick.result === "miss")
    .map((pick) => pick.displayName);
}
