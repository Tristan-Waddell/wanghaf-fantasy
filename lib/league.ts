import { query } from "@/lib/db";

export type LeagueWeek = {
  id: number;
  weekNumber: number;
  startsAt: Date;
  locksAt: Date;
};

export type LeaguePick = {
  id: string;
  userId: string;
  displayName: string;
  betText: string;
  americanOdds: number;
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
    updated_at: Date;
  }>(
    `SELECT picks.id, picks.user_id, users.display_name, picks.bet_text,
            picks.american_odds, picks.updated_at
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
    updatedAt: pick.updated_at,
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
