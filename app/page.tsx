import Link from "next/link";
import { ParlayCalculator } from "@/components/parlay-calculator";
import { PickResultForm } from "@/components/pick-result-form";
import { PickForm } from "@/components/pick-form";
import { WeekNav } from "@/components/week-nav";
import { isLeagueAdmin } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { formatLeagueDate, getWeekStatus } from "@/lib/dates";
import {
  chooseWeek,
  getPicksForWeek,
  getPickTestWeek,
  getResultEntriesForWeek,
  getWeeks,
} from "@/lib/league";
import { formatAmericanOdds } from "@/lib/odds";
import { PAYMENT_URL } from "@/lib/payment";
import { getPriorWeekNumber, missedPickNames } from "@/lib/results";

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

  const previousWeek = weeks.find(
    (candidate) => candidate.weekNumber === getPriorWeekNumber(week.weekNumber),
  );
  const [picks, previousResults] = await Promise.all([
    getPicksForWeek(week.id),
    previousWeek ? getResultEntriesForWeek(previousWeek.id) : Promise.resolve([]),
  ]);
  const isTestingWeek = getPickTestWeek() === week.weekNumber;
  const status = isTestingWeek ? "open" : getWeekStatus(week.startsAt, week.locksAt);
  const userPick = picks.find((pick) => pick.userId === user?.id);
  const isAdmin = isLeagueAdmin(user?.email);
  const owingNames = missedPickNames(previousResults);

  return (
    <main>
      <div className="page-shell main-content">
        <WeekNav weeks={weeks} selected={week.weekNumber} />
        <a className="pay-button" href={PAYMENT_URL} rel="noreferrer" target="_blank">
          Pay 980
        </a>

        {owingNames.length > 0 && (
          <aside className="payment-banner" aria-label="Players who owe this week">
            <strong>Payment due this week</strong>
            <span>{owingNames.join(", ")} {owingNames.length === 1 ? "has" : "have"} to pay after last week&apos;s miss.</span>
          </aside>
        )}

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
              <ParlayCalculator odds={picks.map((pick) => pick.americanOdds)} />
            </div>
            <span className="parlay-icon" aria-hidden="true">×</span>
          </div>
        </section>

        {previousWeek && previousResults.length > 0 && (
          <section className="last-week-section" aria-labelledby="last-week-heading">
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow">Settle up</p>
                <h2 id="last-week-heading">Week {previousWeek.weekNumber} results</h2>
              </div>
              <span className="pick-count">{isAdmin ? "Commissioner controls" : "Commissioner grades results"}</span>
            </div>
            <div className="pick-grid">
              {previousResults.map((entry) => (
                <article className="pick-card result-card" key={entry.userId}>
                  <div className="pick-card-top">
                    <span className="avatar">{entry.displayName.charAt(0).toUpperCase()}</span>
                    <div><h3>{entry.displayName}</h3><p>{entry.betText ? "Last week's pick" : "No bet placed"}</p></div>
                    {entry.americanOdds !== null && <strong className="odds-chip">{formatAmericanOdds(entry.americanOdds)}</strong>}
                  </div>
                  <p className="bet-copy">{entry.betText ?? "No bet submitted."}</p>
                  {entry.result && <span className={`result-label ${entry.result}`}>{entry.result}</span>}
                  {isAdmin && <PickResultForm userId={entry.userId} weekId={previousWeek.id} result={entry.result} />}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="betslip-section" aria-labelledby="betslip-heading">
          <div className="section-heading">
            <div><h2 id="betslip-heading">Week {week.weekNumber} picks</h2></div>
            <span className="pick-count">{picks.length} submitted</span>
          </div>

          {picks.length > 0 ? (
            <div className="pick-grid">
              {picks.map((pick, index) => (
                <article className="pick-card" key={pick.id}>
                  <div className="pick-card-top">
                    <span className="avatar">{pick.displayName.charAt(0).toUpperCase()}</span>
                    <div><h3>{pick.displayName}</h3><p>Parlay leg {index + 1}</p></div>
                    <strong className="odds-chip">{formatAmericanOdds(pick.americanOdds)}</strong>
                  </div>
                  <p className="bet-copy">{pick.betText}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-betslip"><h3>No picks yet</h3><p>Be the first member to put Week {week.weekNumber} on the board.</p></div>
          )}
        </section>

        <section className="entry-card" aria-labelledby="entry-heading">
          <div className="section-heading compact-heading">
            <div><p className="eyebrow">Your selection</p><h2 id="entry-heading">{userPick ? "Edit your pick" : "Add your pick"}</h2></div>
            {userPick && <span className="submitted-mark">Submitted</span>}
          </div>

          {!user ? (
            <div className="entry-prompt"><p>League members need to sign in before adding a pick.</p><div className="button-row"><Link className="primary-button link-button" href="/login">Sign in</Link></div></div>
          ) : status === "open" ? (
            <PickForm key={`${week.id}-${userPick?.updatedAt.toISOString() ?? "new"}`} weekId={week.id} weekNumber={week.weekNumber} pick={userPick} />
          ) : (
            <div className="entry-prompt"><p>{status === "upcoming" ? "This week is not open for picks yet." : "The edit window has closed for this week."}</p></div>
          )}
        </section>
      </div>
    </main>
  );
}
