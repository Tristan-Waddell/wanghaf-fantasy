# WANGHAF Fantasy League MVP requirements

## Product goal

Build a self-hosted, full-stack website where members of the WANGHAF Fantasy League create accounts and submit a single weekly sports-betting pick. Every submitted pick is visible to everyone on the league home screen and contributes to a league-wide parlay.

## League rules

- The MVP covers the 2026 NFL-aligned season, starting with Week 2 on Monday, September 14, 2026. Week 1 is intentionally omitted.
- A league week opens at 12:00 AM Monday and locks at 5:00 PM Thursday in the `America/New_York` timezone. This observes EDT/EST automatically.
- Each user may submit exactly one pick per week.
- A pick contains two text-entry fields:
  - Bet description, for example `Geno Smith over 250.5 Passing Yards`.
  - American odds, for example `-110`.
- Users can add, replace, or edit their pick until the weekly cutoff. Locked picks remain visible but cannot be changed.
- All submitted picks for the selected week appear on the home screen for every visitor/member.
- Users can switch between weekly betslips (Week 2, Week 3, and so on).
- Valid picks are combined into a league-wide parlay. The interface displays the calculated profit for a `$10` stake as `$10 to win X`, along with the total return for clarity.

## Accounts and access

- Signup is open to anyone with the site link; no invitations or administrator approval are required.
- Signup requires a display name, email address, and password.
- Email addresses are unique and passwords are stored only as secure hashes.
- Authenticated sessions are stored in PostgreSQL and sent to the browser in an HTTP-only cookie.
- Visitors can view the weekly betslip. An account is required to submit or edit a pick.

## Visual direction

- Carolina Panthers blue (`#0085CA`) is the primary/action color.
- Dark charcoal (`#2b2c2d`) is the navigation background and secondary color.
- White is used for navigation text other than the blue logo treatment.
- The navigation floats above the page as a rounded charcoal bar.
- The text-only wordmark reads `WANGHAF Fantasy – League Betslip` in a sporty italic face, with every word at the same size, `WANGHAF` in Carolina blue, and the remaining text in white; it does not use a `W` icon.
- The home page begins directly with the weekly betslip controls and does not include a hero section.
- Signed-out navigation shows both `Sign in` and `Sign up` actions.
- The rest of the interface uses a clean, responsive light theme.

## Technical scope

- Next.js App Router, React, and TypeScript.
- PostgreSQL hosted by the project owner.
- SQL migrations and seed data for Weeks 2–18 are included.
- The server is authoritative for cutoff enforcement, odds validation, authentication, and one-pick-per-user constraints.
- Database configuration is supplied through environment variables; credentials are never committed.

## MVP acceptance criteria

1. A new member can sign up, sign in, and sign out.
2. A signed-in member can submit one bet description and valid American odds for an open week.
3. The member can edit that pick until Thursday at 5:00 PM New York time.
4. The server rejects writes after the cutoff even if a client bypasses the interface.
5. The selected week's picks are visible together on the home page.
6. Week navigation updates the displayed betslip and parlay.
7. The parlay recalculates from all submitted picks and displays a `$10` profit and total return.
8. Accounts, sessions, weeks, and picks persist in PostgreSQL.
