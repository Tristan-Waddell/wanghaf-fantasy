INSERT INTO weeks (week_number, starts_at, locks_at)
VALUES (
  1,
  (DATE '2026-09-07'::timestamp AT TIME ZONE 'America/New_York'),
  ((DATE '2026-09-09' + TIME '17:00') AT TIME ZONE 'America/New_York')
)
ON CONFLICT (week_number) DO UPDATE SET
  starts_at = EXCLUDED.starts_at,
  locks_at = EXCLUDED.locks_at;

INSERT INTO weeks (week_number, starts_at, locks_at)
SELECT
  week_number,
  (DATE '2026-09-14' + ((week_number - 2) * 7))::timestamp
    AT TIME ZONE 'America/New_York',
  (
    (DATE '2026-09-14' + ((week_number - 2) * 7) + 3)::timestamp
    + TIME '17:00'
  ) AT TIME ZONE 'America/New_York'
FROM generate_series(2, 18) AS week_number
ON CONFLICT (week_number) DO UPDATE SET
  starts_at = EXCLUDED.starts_at,
  locks_at = EXCLUDED.locks_at;
