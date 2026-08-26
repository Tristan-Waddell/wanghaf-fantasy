export const LEAGUE_TIME_ZONE = "America/New_York";

export type WeekStatus = "upcoming" | "open" | "locked";

export function getWeekStatus(
  startsAt: Date,
  locksAt: Date,
  now = new Date(),
): WeekStatus {
  if (now < startsAt) return "upcoming";
  if (now >= locksAt) return "locked";
  return "open";
}

export function formatLeagueDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: LEAGUE_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

