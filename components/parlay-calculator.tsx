"use client";

import { useState } from "react";
import { calculateParlay, formatMoney, PARLAY_STAKE } from "@/lib/odds";

export function ParlayCalculator({ odds }: { odds: number[] }) {
  const [stakeText, setStakeText] = useState(String(PARLAY_STAKE));
  const parsedStake = Number.parseFloat(stakeText);
  const stake = Number.isFinite(parsedStake) && parsedStake > 0 ? parsedStake : 0;
  const parlay = calculateParlay(odds, stake);

  if (odds.length === 0) {
    return <p className="parlay-empty">Waiting for the first pick</p>;
  }

  return (
    <>
      <label className="stake-field">
        Your stake
        <span>
          <span aria-hidden="true">$</span>
          <input
            aria-label="Your parlay stake"
            inputMode="decimal"
            min="0.01"
            onChange={(event) => setStakeText(event.target.value)}
            step="0.01"
            type="number"
            value={stakeText}
          />
        </span>
      </label>
      <p className="parlay-value">{formatMoney(stake)} <span>to win</span> {formatMoney(parlay.profit)}</p>
      <p className="return-copy">Total return {formatMoney(parlay.totalReturn)}</p>
    </>
  );
}
