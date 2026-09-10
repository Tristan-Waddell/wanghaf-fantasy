"use server";

import { revalidatePath } from "next/cache";
import { isLeagueAdmin } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { isPickResult } from "@/lib/results";

export type PickResultFormState = { error?: string; success?: string };

export async function savePickResult(
  _state: PickResultFormState,
  formData: FormData,
): Promise<PickResultFormState> {
  const user = await getCurrentUser();
  if (!isLeagueAdmin(user?.email)) {
    return { error: "Only the league commissioner can record results." };
  }

  const targetUserId = String(formData.get("userId") ?? "");
  const weekId = Number.parseInt(String(formData.get("weekId") ?? ""), 10);
  const result = String(formData.get("result") ?? "");
  if (!targetUserId || !Number.isInteger(weekId) || !isPickResult(result)) {
    return { error: "Choose a valid player, week, and result." };
  }

  const updated = await query(
    `INSERT INTO weekly_results (user_id, week_id, result, recorded_at)
     SELECT users.id, weeks.id, $3, NOW()
     FROM users
     JOIN weeks ON weeks.id = $2
     WHERE users.id = $1
       AND weeks.locks_at = (SELECT MAX(locks_at) FROM weeks WHERE locks_at <= NOW())
     ON CONFLICT (user_id, week_id) DO UPDATE
     SET result = EXCLUDED.result, recorded_at = EXCLUDED.recorded_at`,
    [targetUserId, weekId, result],
  );

  if (updated.rowCount === 0) {
    return { error: "Results can only be recorded for the most recently completed week." };
  }

  revalidatePath("/");
  return { success: `Marked ${result}.` };
}
