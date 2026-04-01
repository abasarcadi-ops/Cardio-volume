-- CardioTrack Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- If you already ran a previous version, run the migration block at the bottom instead.

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE workout_sessions (
  id              TEXT PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL,
  activity        TEXT NOT NULL,
  duration        INTEGER NOT NULL,
  distance        REAL,
  calories        INTEGER,
  avg_heart_rate  INTEGER,
  max_heart_rate  INTEGER,
  perceived_effort INTEGER NOT NULL DEFAULT 3,
  notes           TEXT,
  custom_name     TEXT,
  status          TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('planned', 'completed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_plans (
  id              TEXT PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  duration_weeks  INTEGER NOT NULL,
  goal            TEXT NOT NULL,
  sessions        JSONB NOT NULL DEFAULT '[]',
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT FALSE,
  start_date      DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name                  TEXT    NOT NULL DEFAULT 'Athlete',
  weekly_volume_goal    INTEGER NOT NULL DEFAULT 300,
  preferred_activities  TEXT[]  NOT NULL DEFAULT '{"running","cycling"}',
  fitness_level         TEXT    NOT NULL DEFAULT 'intermediate',
  goal                  TEXT    NOT NULL DEFAULT 'General fitness and endurance',
  age                   INTEGER,
  weight_kg             REAL,
  height_cm             REAL,
  race_type             TEXT,
  race_date             DATE,
  injuries              TEXT,
  onboarding_complete   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sessions"
  ON workout_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_plans"
  ON training_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Migration (only if you already ran a previous version) ───────────────────
-- Run these ALTER TABLE statements if your tables already exist:
--
-- ALTER TABLE workout_sessions
--   ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed'
--     CHECK (status IN ('planned', 'completed'));
--
-- ALTER TABLE user_settings
--   ADD COLUMN IF NOT EXISTS age INTEGER,
--   ADD COLUMN IF NOT EXISTS weight_kg REAL,
--   ADD COLUMN IF NOT EXISTS height_cm REAL,
--   ADD COLUMN IF NOT EXISTS race_type TEXT,
--   ADD COLUMN IF NOT EXISTS race_date DATE,
--   ADD COLUMN IF NOT EXISTS injuries TEXT,
--   ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE;
