import { getLeagueStats } from "@/lib/league";

export const dynamic = "force-dynamic";

function formatWinRate(winRate: number | null) {
  return winRate === null ? "—" : `${winRate.toFixed(1)}%`;
}

export default async function StatsPage() {
  const { players, league } = await getLeagueStats();

  return (
    <main className="page-shell stats-page">
      <section className="stats-hero" aria-labelledby="stats-heading">
        <div>
          <p className="eyebrow">Season scoreboard</p>
          <h1 id="stats-heading">League stats</h1>
        </div>
        <div className="league-win-rate" aria-label="League win rate">
          <span>League win rate</span>
          <strong>{formatWinRate(league.winRate)}</strong>
          <small>{league.wins}-{league.losses}{league.pushes > 0 ? `-${league.pushes}` : ""} W-L-P</small>
        </div>
      </section>

      <section className="league-stat-grid" aria-label="League totals">
        <article><span>Wins</span><strong>{league.wins}</strong></article>
        <article><span>Losses</span><strong>{league.losses}</strong></article>
        <article><span>Pushes</span><strong>{league.pushes}</strong></article>
        <article><span>Graded picks</span><strong>{league.gradedPicks}</strong></article>
      </section>

      <section className="leaderboard-section" aria-labelledby="leaderboard-heading">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Ranked best to worst</p>
            <h2 id="leaderboard-heading">Player leaderboard</h2>
          </div>
          <span className="pick-count">{players.length} {players.length === 1 ? "player" : "players"}</span>
        </div>

        {players.length > 0 ? (
          <div className="stats-table-wrap">
            <table className="stats-table">
              <thead>
                <tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Win rate</th><th scope="col">W-L</th><th scope="col">Pushes</th><th scope="col">Graded</th></tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.displayName}>
                    <td className="stats-rank">{index + 1}</td>
                    <th scope="row"><span className="avatar">{player.displayName.charAt(0).toUpperCase()}</span>{player.displayName}</th>
                    <td className="stats-win-rate">{formatWinRate(player.winRate)}</td>
                    <td><strong>{player.wins}-{player.losses}</strong></td>
                    <td>{player.pushes}</td>
                    <td>{player.gradedPicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-betslip"><h3>No players yet</h3><p>Stats will land here once league members join.</p></div>
        )}
      </section>
    </main>
  );
}
