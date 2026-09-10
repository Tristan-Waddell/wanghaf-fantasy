"use client";

import { useActionState } from "react";
import {
  savePickResult,
  type PickResultFormState,
} from "@/app/actions/results";
import type { PickResult } from "@/lib/results";

const initialState: PickResultFormState = {};

export function PickResultForm({
  userId,
  weekId,
  result,
}: {
  userId: string;
  weekId: number;
  result: PickResult | null;
}) {
  const [state, formAction, pending] = useActionState(savePickResult, initialState);

  return (
    <form className="result-form" action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="weekId" value={weekId} />
      <p className="result-question">Grade this player</p>
      <div className="result-actions">
        {(["hit", "push", "miss"] as const).map((option) => (
          <button
            className={`result-button ${option} ${result === option ? "selected" : ""}`}
            disabled={pending}
            key={option}
            name="result"
            type="submit"
            value={option}
          >
            {option}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {state.error && <p className="form-message error">{state.error}</p>}
        {state.success && <p className="form-message success">{state.success}</p>}
      </div>
    </form>
  );
}
