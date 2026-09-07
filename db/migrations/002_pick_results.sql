BEGIN;

ALTER TABLE picks
  ADD COLUMN IF NOT EXISTS result VARCHAR(5),
  ADD COLUMN IF NOT EXISTS result_recorded_at TIMESTAMPTZ;

ALTER TABLE picks
  DROP CONSTRAINT IF EXISTS picks_valid_result;

ALTER TABLE picks
  ADD CONSTRAINT picks_valid_result
  CHECK (result IS NULL OR result IN ('hit', 'push', 'miss'));

COMMIT;
