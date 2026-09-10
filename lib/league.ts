import { query } from "@/lib/db";
import type { PickResult } from "@/lib/results";

export type LeagueWeek = {
  id: number;
  weekNumber: number;
  startsAt: Date;
  locksAt: Date;
};

export type LeagueResultEntry = {
  userId: string;
  displayName: string;
  betText: string | null;
  americanOdds: number | null;
  result: PickResult | null;
};

export type LeaguePick = {
  id: string;
  userId: string;
  displayName: string;
  betText: string;
  americanOdds: number;
  result: PickResult | null;
  updatedAt: Date;
};

export function getPickTestWeek() {
  const value = Number.parseInt(process.env.PICK_TEST_WEEK ?? "", 10);
  return Number.isInteger(value) && value >= 1 && value <= 30 ? value : null;
}

export async function getWeeks(): Promise<LeagueWeek[]> {
  const result = await query<{
    id: number;
    week_number: number;
    starts_at: Date;
    locks_at: Date;
  }>(
    `SELECT id, week_number, starts_at, locks_at
     FROM weeks
     ORDER BY week_number`,
  );

  return result.rows.map((week) => ({
    id: week.id,
    weekNumber: week.week_number,
    startsAt: week.starts_at,
    locksAt: week.locks_at,
  }));
}

export async function getPicksForWeek(weekId: number): Promise<LeaguePick[]> {
  const result = await query<{
    id: string;
    user_id: string;
    display_name: string;
    bet_text: string;
    american_odds: number;
    result: PickResult | null;
    updated_at: Date;
  }>(
    `SELECT picks.id, picks.user_id, users.display_name, picks.bet_text,
            picks.american_odds, picks.result, picks.updated_at
     FROM picks
     JOIN users ON users.id = picks.user_id
     WHERE picks.week_id = $1
     ORDER BY lower(users.display_name), picks.created_at`,
    [weekId],
  );

  return result.rows.map((pick) => ({
    id: pick.id,
    userId: pick.user_id,
    displayName: pick.display_name,
    betText: pick.bet_text,
    americanOdds: pick.american_odds,
    result: pick.result,
    updatedAt: pick.updated_at,
  }));
}

export async function getResultEntriesForWeek(weekId: number): Promise<LeagueResultEntry[]> {
  const result = await query<{
    user_id: string;
    display_name: string;
    bet_text: string | null;
    american_odds: number | null;
    result: PickResult | null;
  }>(
    `SELECT users.id AS user_id, users.display_name, picks.bet_text, picks.american_odds,
            weekly_results.result
     FROM users
     LEFT JOIN picks ON picks.user_id = users.id AND picks.week_id = $1
     LEFT JOIN weekly_results ON weekly_results.user_id = users.id AND weekly_results.week_id = $1
     ORDER BY lower(users.display_name)`,
    [weekId],
  );

  return result.rows.map((entry) => ({
    userId: entry.user_id,
    displayName: entry.display_name,
    betText: entry.bet_text,
    americanOdds: entry.american_odds,
    result: entry.result,
  }));
}

export function chooseWeek(weeks: LeagueWeek[], requestedWeek?: string) {
  const requested = Number.parseInt(requestedWeek ?? "", 10);
  const explicit = weeks.find((week) => week.weekNumber === requested);
  if (explicit) return explicit;

  const now = new Date();
  return (
    weeks.find((week) => now >= week.startsAt && now < week.locksAt) ??
    weeks.find((week) => now < week.startsAt) ??
    weeks.at(-1)
  );
}
