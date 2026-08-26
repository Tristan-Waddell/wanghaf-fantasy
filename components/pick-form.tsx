"use client";

import { useActionState } from "react";
import { savePick, type PickFormState } from "@/app/actions/picks";
import type { LeaguePick } from "@/lib/league";
import { formatAmericanOdds } from "@/lib/odds";

const initialState: PickFormState = {};

export function PickForm({
  weekId,
  weekNumber,
  pick,
}: {
  weekId: number;
  weekNumber: number;
  pick?: LeaguePick;
}) {
  const [state, formAction, pending] = useActionState(savePick, initialState);

  return (
    <form className="pick-form" action={formAction}>
      <input type="hidden" name="weekId" value={weekId} />
      <div className="field-grid">
        <label className="bet-field">
          Your Week {weekNumber} bet
          <input
            name="betText"
            type="text"
            minLength={3}
            maxLength={240}
            defaultValue={pick?.betText ?? ""}
            placeholder="Geno Smith over 250.5 Passing Yards"
            required
          />
        </label>
        <label className="odds-field">
          American odds
          <input
            name="americanOdds"
            type="text"
            inputMode="numeric"
            defaultValue={pick ? formatAmericanOdds(pick.americanOdds) : ""}
            placeholder="-110"
            required
          />
        </label>
      </div>

      <div className="form-footer">
        <div aria-live="polite">
          {state.error && <p className="form-message error">{state.error}</p>}
          {state.success && <p className="form-message success">{state.success}</p>}
        </div>
        <button className="primary-button" disabled={pending} type="submit">
          {pending ? "Saving…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
