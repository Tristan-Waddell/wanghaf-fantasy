const LEAGUE_ADMIN_EMAIL = "tristancwaddell@gmail.com";

export function isLeagueAdmin(email: string | null | undefined) {
  return email?.trim().toLowerCase() === LEAGUE_ADMIN_EMAIL;
}
