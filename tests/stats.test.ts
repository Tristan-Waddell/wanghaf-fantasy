import assert from "node:assert/strict";
import test from "node:test";
import { buildLeagueStats } from "../lib/stats.ts";

test("builds player records and ranks them by win rate", () => {
  const stats = buildLeagueStats([
    { displayName: "Taco", result: "hit" },
    { displayName: "Taco", result: "hit" },
    { displayName: "Taco", result: "miss" },
    { displayName: "Jordan", result: "hit" },
    { displayName: "Jordan", result: "push" },
    { displayName: "Tristan", result: "miss" },
    { displayName: "Jules", result: null },
  ]);

  assert.deepEqual(stats.players, [
    { displayName: "Jordan", wins: 1, losses: 0, pushes: 1, gradedPicks: 2, winRate: 100 },
    { displayName: "Taco", wins: 2, losses: 1, pushes: 0, gradedPicks: 3, winRate: 66.7 },
    { displayName: "Tristan", wins: 0, losses: 1, pushes: 0, gradedPicks: 1, winRate: 0 },
    { displayName: "Jules", wins: 0, losses: 0, pushes: 0, gradedPicks: 0, winRate: null },
  ]);
});

test("totals the whole league without treating pushes as wins or losses", () => {
  const stats = buildLeagueStats([
    { displayName: "Taco", result: "hit" },
    { displayName: "Jordan", result: "push" },
    { displayName: "Tristan", result: "miss" },
  ]);

  assert.deepEqual(stats.league, {
    wins: 1,
    losses: 1,
    pushes: 1,
    gradedPicks: 3,
    winRate: 50,
  });
});
