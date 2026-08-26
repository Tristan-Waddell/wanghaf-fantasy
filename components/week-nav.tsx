import Link from "next/link";
import type { LeagueWeek } from "@/lib/league";

export function WeekNav({ weeks, selected }: { weeks: LeagueWeek[]; selected: number }) {
  return (
    <nav className="week-nav" aria-label="League weeks">
      {weeks.map((week) => (
        <Link
          className={week.weekNumber === selected ? "week-link active" : "week-link"}
          href={`/?week=${week.weekNumber}`}
          key={week.id}
          aria-current={week.weekNumber === selected ? "page" : undefined}
        >
          Week {week.weekNumber}
        </Link>
      ))}
    </nav>
  );
}

