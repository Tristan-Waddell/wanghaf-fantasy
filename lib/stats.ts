import type { PickResult } from "@/lib/results";

export type StatResult = PickResult | null;

export type PlayerStats = {
  displayName: string;
  wins: number;
  losses: number;
  pushes: number;
  gradedPicks: number;
  winRate: number | null;
};

export type LeagueStats = Omit<PlayerStats, "displayName">;

function calculateWinRate(wins: number, losses: number) {
  const decisions = wins + losses;
  return decisions === 0 ? null : Number(((wins / decisions) * 100).toFixed(1));
}

function summarize(displayName: string, results: StatResult[]): PlayerStats {
  const wins = results.filter((result) => result === "hit").length;
  const losses = results.filter((result) => result === "miss").length;
  const pushes = results.filter((result) => result === "push").length;

  return {
    displayName,
    wins,
    losses,
    pushes,
    gradedPicks: wins + losses + pushes,
    winRate: calculateWinRate(wins, losses),
  };
}

export function buildLeagueStats(entries: Array<{ displayName: string; result: StatResult }>) {
  const resultsByPlayer = new Map<string, StatResult[]>();
  for (const entry of entries) {
    const results = resultsByPlayer.get(entry.displayName) ?? [];
    results.push(entry.result);
    resultsByPlayer.set(entry.displayName, results);
  }

  const players = [...resultsByPlayer.entries()]
    .map(([displayName, results]) => summarize(displayName, results))
    .sort((a, b) => {
      const aRate = a.winRate ?? -1;
      const bRate = b.winRate ?? -1;
      return bRate - aRate || b.wins - a.wins || a.losses - b.losses || a.displayName.localeCompare(b.displayName);
    });

  const leagueSummary = summarize("League", entries.map((entry) => entry.result));
  const league = {
    wins: leagueSummary.wins,
    losses: leagueSummary.losses,
    pushes: leagueSummary.pushes,
    gradedPicks: leagueSummary.gradedPicks,
    winRate: leagueSummary.winRate,
  };

  return { players, league };
}
