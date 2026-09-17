BEGIN;

UPDATE weeks
SET locks_at = (
  ((starts_at AT TIME ZONE 'America/New_York')::date + 3 + TIME '19:00')
  AT TIME ZONE 'America/New_York'
);

COMMIT;
