"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { isPickResult } from "@/lib/results";

export type PickResultFormState = { error?: string; success?: string };

export async function savePickResult(
  _state: PickResultFormState,
  formData: FormData,
): Promise<PickResultFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before recording a result." };

  const pickId = String(formData.get("pickId") ?? "");
  const result = String(formData.get("result") ?? "");
  if (!isPickResult(result)) return { error: "Choose hit, push, or miss." };

  const updated = await query(
    `UPDATE picks
     SET result = $3, result_recorded_at = NOW()
     FROM weeks
     WHERE picks.id = $1
       AND picks.user_id = $2
       AND picks.week_id = weeks.id
       AND weeks.locks_at <= NOW()
       AND weeks.locks_at = (
         SELECT MAX(locks_at) FROM weeks WHERE locks_at <= NOW()
       )`,
    [pickId, user.id, result],
  );

  if (updated.rowCount === 0) {
    return { error: "Only your most recently completed pick can be graded." };
  }

  revalidatePath("/");
  return { success: `Marked ${result}.` };
}
