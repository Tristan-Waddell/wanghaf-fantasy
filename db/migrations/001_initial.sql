BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name VARCHAR(40) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_display_name_not_blank CHECK (length(trim(display_name)) >= 2)
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON users (lower(email));

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS weeks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  week_number SMALLINT NOT NULL UNIQUE,
  starts_at TIMESTAMPTZ NOT NULL,
  locks_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT weeks_valid_number CHECK (week_number BETWEEN 1 AND 30),
  CONSTRAINT weeks_valid_window CHECK (locks_at > starts_at)
);

CREATE TABLE IF NOT EXISTS picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_id INTEGER NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  bet_text VARCHAR(240) NOT NULL,
  american_odds INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT picks_bet_not_blank CHECK (length(trim(bet_text)) >= 3),
  CONSTRAINT picks_valid_odds CHECK (
    american_odds BETWEEN -100000 AND -101
    OR american_odds BETWEEN 100 AND 100000
  ),
  CONSTRAINT picks_one_per_user_week UNIQUE (user_id, week_id)
);

CREATE INDEX IF NOT EXISTS picks_week_id_idx ON picks(week_id);

COMMIT;

