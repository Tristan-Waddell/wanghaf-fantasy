"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { getPickTestWeek } from "@/lib/league";
import { parseAmericanOdds } from "@/lib/odds";

export type PickFormState = { error?: string; success?: string };

export async function savePick(
  _state: PickFormState,
  formData: FormData,
): Promise<PickFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before submitting a pick." };

  const betText = String(formData.get("betText") ?? "").trim();
  const oddsText = String(formData.get("americanOdds") ?? "");
  const weekId = Number.parseInt(String(formData.get("weekId") ?? ""), 10);
  const americanOdds = parseAmericanOdds(oddsText);
  const testWeek = getPickTestWeek();

  if (betText.length < 3 || betText.length > 240) {
    return { error: "Your bet must be between 3 and 240 characters." };
  }
  if (!Number.isInteger(weekId)) return { error: "Choose a valid league week." };
  if (americanOdds === null) {
    return { error: "Enter valid American odds, such as -110 or +150." };
  }

  const result = await query<{ week_number: number }>(
    `INSERT INTO picks (user_id, week_id, bet_text, american_odds)
     SELECT $1, weeks.id, $3, $4
     FROM weeks
     WHERE weeks.id = $2
       AND (
         weeks.week_number = $5
         OR (NOW() >= weeks.starts_at AND NOW() < weeks.locks_at)
       )
     ON CONFLICT (user_id, week_id) DO UPDATE SET
       bet_text = EXCLUDED.bet_text,
       american_odds = EXCLUDED.american_odds,
       updated_at = NOW()
     RETURNING (SELECT week_number FROM weeks WHERE id = week_id) AS week_number`,
    [user.id, weekId, betText, americanOdds, testWeek],
  );

  if (result.rowCount === 0) {
    return { error: "This week is not open for picks." };
  }

  revalidatePath("/");
  return { success: `Week ${result.rows[0].week_number} pick saved.` };
}
