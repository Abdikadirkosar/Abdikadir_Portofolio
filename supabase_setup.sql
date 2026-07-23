-- ============================================================
-- ABDIKADIR PORTFOLIO — SUPABASE FIX SCRIPT
-- Run this to fix "policy already exists" errors
-- ============================================================

-- TABLES (skip if exist)
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  page        TEXT NOT NULL DEFAULT 'home',
  device      TEXT DEFAULT 'desktop',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_likes (
  id          BIGSERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

-- DROP old policies first (ignore errors if they don't exist)
DROP POLICY IF EXISTS "anon insert messages"  ON messages;
DROP POLICY IF EXISTS "anon insert views"     ON page_views;
DROP POLICY IF EXISTS "anon insert likes"     ON project_likes;
DROP POLICY IF EXISTS "anon read messages"    ON messages;
DROP POLICY IF EXISTS "anon read views"       ON page_views;
DROP POLICY IF EXISTS "anon read likes"       ON project_likes;
DROP POLICY IF EXISTS "anon update messages"  ON messages;
DROP POLICY IF EXISTS "anon delete messages"  ON messages;

-- CREATE policies fresh
CREATE POLICY "anon insert messages"  ON messages        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert views"     ON page_views      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert likes"     ON project_likes   FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read messages"    ON messages        FOR SELECT TO anon USING (true);
CREATE POLICY "anon read views"       ON page_views      FOR SELECT TO anon USING (true);
CREATE POLICY "anon read likes"       ON project_likes   FOR SELECT TO anon USING (true);
CREATE POLICY "anon update messages"  ON messages        FOR UPDATE TO anon USING (true);
CREATE POLICY "anon delete messages"  ON messages        FOR DELETE TO anon USING (true);

-- DONE
SELECT 'Setup complete! Tables and policies ready.' AS status;
