-- Post-MVP Supabase schema seed reference
-- Run via supabase db push or migration scripts

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('team', 'player', 'coach', 'country', 'tournament')),
  i18n_key TEXT NOT NULL,
  icon TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  correct_order JSONB NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0'
);

CREATE TABLE IF NOT EXISTS category_items (
  id TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  stat_value NUMERIC NOT NULL,
  metadata JSONB,
  PRIMARY KEY (category_id, id)
);

CREATE TABLE IF NOT EXISTS category_translations (
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (category_id, locale)
);

CREATE TABLE IF NOT EXISTS item_translations (
  item_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (category_id, item_id, locale)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS daily_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  category_id TEXT REFERENCES categories(id),
  score INTEGER NOT NULL,
  item_scores JSONB NOT NULL,
  is_first_attempt BOOLEAN DEFAULT TRUE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, challenge_date, is_first_attempt)
);

CREATE INDEX idx_daily_attempts_leaderboard
  ON daily_attempts (challenge_date, score DESC, submitted_at ASC)
  WHERE is_first_attempt = TRUE;
