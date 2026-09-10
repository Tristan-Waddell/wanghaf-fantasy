BEGIN;

CREATE TABLE IF NOT EXISTS weekly_results (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  result VARCHAR(5) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, week_id),
  CONSTRAINT weekly_results_valid_result CHECK (result IN ('hit', 'push', 'miss'))
);

INSERT INTO weekly_results (user_id, week_id, result, recorded_at)
SELECT user_id, week_id, result, COALESCE(result_recorded_at, NOW())
FROM picks
WHERE result IS NOT NULL
ON CONFLICT (user_id, week_id) DO UPDATE
SET result = EXCLUDED.result, recorded_at = EXCLUDED.recorded_at;

COMMIT;
