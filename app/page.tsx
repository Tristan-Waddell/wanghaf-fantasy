import Link from "next/link";
import { PickForm } from "@/components/pick-form";
import { WeekNav } from "@/components/week-nav";
import { getCurrentUser } from "@/lib/auth";
import { formatLeagueDate, getWeekStatus } from "@/lib/dates";
import {
  chooseWeek,
  getPicksForWeek,
  getPickTestWeek,
  getWeeks,
} from "@/lib/league";
import {
  calculateParlay,
  formatAmericanOdds,
  formatMoney,
  PARLAY_STAKE,
} from "@/lib/odds";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const [weeks, user, params] = await Promise.all([
    getWeeks(),
    getCurrentUser(),
    searchParams,
  ]);
  const week = chooseWeek(weeks, params.week);

  if (!week) {
    return (
      <main className="page-shell empty-state">
        <h1>No league weeks are configured.</h1>
        <p>Run the database setup command to seed the 2026 season.</p>
      </main>
    );
  }

  const picks = await getPicksForWeek(week.id);
  const isTestingWeek = getPickTestWeek() === week.weekNumber;
  const status = isTestingWeek ? "open" : getWeekStatus(week.startsAt, week.locksAt);
  const userPick = picks.find((pick) => pick.userId === user?.id);
  const parlay = calculateParlay(picks.map((pick) => pick.americanOdds));

  return (
    <main>
      <div className="page-shell main-content">
        <WeekNav weeks={weeks} selected={week.weekNumber} />

        <section className="week-overview" aria-labelledby="week-heading">
          <div className="overview-copy">
            <div className="title-row">
              <h2 id="week-heading">Week {week.weekNumber}</h2>
              <span className={`status-badge ${status}`}>{status}</span>
            </div>
            <p>
              {isTestingWeek
                ? "Testing mode is on. Picks are temporarily unlocked for this week."
                : status === "upcoming"
                ? `Picks open ${formatLeagueDate(week.startsAt)}.`
                : status === "open"
                  ? `Submit or edit until ${formatLeagueDate(week.locksAt)}.`
                  : `Picks locked ${formatLeagueDate(week.locksAt)}.`}
            </p>
          </div>

          <div className="parlay-card">
            <div>
              <p className="card-label">League parlay · {picks.length} {picks.length === 1 ? "leg" : "legs"}</p>
              {picks.length > 0 ? (
                <>
                  <p className="parlay-value">{formatMoney(PARLAY_STAKE)} <span>to win</span> {formatMoney(parlay.profit)}</p>
                  <p className="return-copy">Total return {formatMoney(parlay.totalReturn)}</p>
                </>
              ) : (
                <p className="parlay-empty">Waiting for the first pick</p>
              )}
            </div>
            <span className="parlay-icon" aria-hidden="true">×</span>
          </div>
        </section>

        <section className="betslip-section" aria-labelledby="betslip-heading">
          <div className="section-heading">
            <div>
              <h2 id="betslip-heading">Week {week.weekNumber} picks</h2>
            </div>
            <span className="pick-count">{picks.length} submitted</span>
          </div>

          {picks.length > 0 ? (
            <div className="pick-grid">
              {picks.map((pick, index) => (
                <article className="pick-card" key={pick.id}>
                  <div className="pick-card-top">
                    <span className="avatar">{pick.displayName.charAt(0).toUpperCase()}</span>
                    <div>
                      <h3>{pick.displayName}</h3>
                      <p>Parlay leg {index + 1}</p>
                    </div>
                    <strong className="odds-chip">{formatAmericanOdds(pick.americanOdds)}</strong>
                  </div>
                  <p className="bet-copy">{pick.betText}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-betslip">
              <h3>No picks yet</h3>
              <p>Be the first member to put Week {week.weekNumber} on the board.</p>
            </div>
          )}
        </section>

        <section className="entry-card" aria-labelledby="entry-heading">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Your selection</p>
              <h2 id="entry-heading">{userPick ? "Edit your pick" : "Add your pick"}</h2>
            </div>
            {userPick && <span className="submitted-mark">Submitted</span>}
          </div>

          {!user ? (
            <div className="entry-prompt">
              <p>League members need to sign in before adding a pick.</p>
              <div className="button-row">
                <Link className="primary-button link-button" href="/login">Sign in</Link>
              </div>
            </div>
          ) : status === "open" ? (
            <PickForm
              key={`${week.id}-${userPick?.updatedAt.toISOString() ?? "new"}`}
              weekId={week.id}
              weekNumber={week.weekNumber}
              pick={userPick}
            />
          ) : (
            <div className="entry-prompt">
              <p>
                {status === "upcoming"
                  ? "This week is not open for picks yet."
                  : "The edit window has closed for this week."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
