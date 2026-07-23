-- ============================================================
-- PORTFOLIO SUPABASE — COMPLETE FIX & SYNC SCRIPT
-- Run this in your Supabase SQL Editor to fix all issues!
-- ============================================================

-- ── 1. ENSURE ALL TABLES EXIST ───────────────────────────────

CREATE TABLE IF NOT EXISTS profile (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  full_name     TEXT NOT NULL DEFAULT 'Abdikadir Kosar Osman',
  job_title     TEXT DEFAULT 'AI Engineer & Full Stack Developer',
  bio           TEXT,
  about_me      TEXT,
  location      TEXT DEFAULT 'Hargeisa, Somaliland',
  email         TEXT DEFAULT 'abdikadirkosara@gmail.com',
  phone         TEXT,
  profile_img   TEXT,
  cover_img     TEXT,
  resume_url    TEXT,
  github_link   TEXT DEFAULT 'https://github.com/abdikadirkosar',
  linkedin_link TEXT DEFAULT 'https://linkedin.com/in/abdikadirkosar',
  whatsapp_link TEXT DEFAULT 'https://wa.me/252634812030',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_projects (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  tech          TEXT[],
  image_url     TEXT,
  video_url     TEXT,
  github_link   TEXT,
  live_link     TEXT,
  category      TEXT DEFAULT 'Full Stack',
  featured      BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'Completed',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_skills (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  percentage    INTEGER DEFAULT 80,
  icon          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_experience (
  id            BIGSERIAL PRIMARY KEY,
  company       TEXT NOT NULL,
  position      TEXT NOT NULL,
  start_date    TEXT,
  end_date      TEXT DEFAULT 'Present',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_education (
  id            BIGSERIAL PRIMARY KEY,
  university    TEXT NOT NULL,
  degree        TEXT NOT NULL,
  department    TEXT,
  year          TEXT,
  gpa           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_certificates (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     TEXT,
  credential_url TEXT,
  pdf_url        TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_services (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT DEFAULT 'Layers',
  tag           TEXT,
  accentColor   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing 'tag' column to db_services if it doesn't exist yet
ALTER TABLE db_services ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE db_services ADD COLUMN IF NOT EXISTS "accentColor" TEXT;

-- Add missing 'image_url' to db_certificates if not exist
ALTER TABLE db_certificates ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS db_blogs (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  content       TEXT,
  category      TEXT,
  tags          TEXT[],
  cover_image   TEXT,
  seo_title     TEXT,
  seo_desc      TEXT,
  published     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_testimonials (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  role          TEXT,
  company       TEXT,
  text          TEXT,
  rating        INTEGER DEFAULT 5,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_seo (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  site_title    TEXT,
  meta_desc     TEXT,
  og_image      TEXT,
  keywords      TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS db_appearance (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  primary_color TEXT DEFAULT '#4FFFB0',
  bg_color      TEXT DEFAULT '#0A0A0A',
  font_heading  TEXT DEFAULT 'Bricolage Grotesque',
  font_body     TEXT DEFAULT 'Inter',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

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
  page        TEXT NOT NULL,
  device      TEXT DEFAULT 'desktop',
  browser     TEXT,
  country     TEXT,
  referrer    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to page_views if not present
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer TEXT;

CREATE TABLE IF NOT EXISTS project_likes (
  id          BIGSERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. INSERT DEFAULT PROFILE ───────────────────────────────
INSERT INTO profile (id, full_name, job_title, bio, about_me, location, email, github_link, linkedin_link, whatsapp_link)
VALUES (1, 'Abdikadir Kosar Osman', 'AI Engineer & Full Stack Developer',
  'Building intelligent AI applications & high-performance web systems.',
  'I am an ambitious AI Engineer and Full Stack Developer based in Hargeisa, Somaliland, with a passion for building intelligent applications and high-performance web systems.',
  'Hargeisa, Somaliland', 'abdikadirkosara@gmail.com',
  'https://github.com/abdikadirkosar', 'https://linkedin.com/in/abdikadirkosar',
  'https://wa.me/252634812030')
ON CONFLICT (id) DO NOTHING;

-- ── 3. ENABLE ROW LEVEL SECURITY ON ALL TABLES ──────────────

ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_experience    ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_education     ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_blogs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_seo           ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_appearance    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes    ENABLE ROW LEVEL SECURITY;

-- ── 4. DROP ALL OLD POLICIES (clean slate) ─────────────────

DROP POLICY IF EXISTS "allow_read_profile"      ON profile;
DROP POLICY IF EXISTS "allow_read_projects"     ON db_projects;
DROP POLICY IF EXISTS "allow_read_skills"       ON db_skills;
DROP POLICY IF EXISTS "allow_read_experience"   ON db_experience;
DROP POLICY IF EXISTS "allow_read_education"    ON db_education;
DROP POLICY IF EXISTS "allow_read_certificates" ON db_certificates;
DROP POLICY IF EXISTS "allow_read_services"     ON db_services;
DROP POLICY IF EXISTS "allow_read_blogs"        ON db_blogs;
DROP POLICY IF EXISTS "allow_read_testimonials" ON db_testimonials;
DROP POLICY IF EXISTS "allow_read_seo"          ON db_seo;
DROP POLICY IF EXISTS "allow_read_appearance"   ON db_appearance;
DROP POLICY IF EXISTS "anon read messages"      ON messages;
DROP POLICY IF EXISTS "anon read views"         ON page_views;
DROP POLICY IF EXISTS "anon read likes"         ON project_likes;
DROP POLICY IF EXISTS "anon insert messages"    ON messages;
DROP POLICY IF EXISTS "anon insert views"       ON page_views;
DROP POLICY IF EXISTS "anon insert likes"       ON project_likes;
DROP POLICY IF EXISTS "anon update messages"    ON messages;
DROP POLICY IF EXISTS "anon delete messages"    ON messages;
DROP POLICY IF EXISTS "allow_all_profile"       ON profile;
DROP POLICY IF EXISTS "allow_all_projects"      ON db_projects;
DROP POLICY IF EXISTS "allow_all_skills"        ON db_skills;
DROP POLICY IF EXISTS "allow_all_experience"    ON db_experience;
DROP POLICY IF EXISTS "allow_all_education"     ON db_education;
DROP POLICY IF EXISTS "allow_all_certificates"  ON db_certificates;
DROP POLICY IF EXISTS "allow_all_services"      ON db_services;
DROP POLICY IF EXISTS "allow_all_blogs"         ON db_blogs;
DROP POLICY IF EXISTS "allow_all_testimonials"  ON db_testimonials;
DROP POLICY IF EXISTS "allow_all_seo"           ON db_seo;
DROP POLICY IF EXISTS "allow_all_appearance"    ON db_appearance;

-- ── 5. CREATE FRESH OPEN POLICIES (anon can read + write all) ──

CREATE POLICY "allow_all_profile"       ON profile         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_projects"      ON db_projects     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_skills"        ON db_skills       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_experience"    ON db_experience   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_education"     ON db_education    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_certificates"  ON db_certificates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_services"      ON db_services     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_blogs"         ON db_blogs        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_testimonials"  ON db_testimonials FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_seo"           ON db_seo          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_appearance"    ON db_appearance   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon insert messages"    ON messages        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read messages"      ON messages        FOR SELECT TO anon USING (true);
CREATE POLICY "anon update messages"    ON messages        FOR UPDATE TO anon USING (true);
CREATE POLICY "anon delete messages"    ON messages        FOR DELETE TO anon USING (true);
CREATE POLICY "anon insert views"       ON page_views      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read views"         ON page_views      FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert likes"       ON project_likes   FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read likes"         ON project_likes   FOR SELECT TO anon USING (true);

-- ── 6. STORAGE BUCKET SETUP ──────────────────────────────────

-- Create storage buckets if missing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-media', 'portfolio-media', TRUE, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('portfolio', 'portfolio', TRUE, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- NOTE FOR STORAGE POLICIES:
-- If Supabase SQL Editor returns "ERROR: 42501: must be owner of table objects", 
-- please set Storage Policies via Supabase Dashboard UI:
-- 1. Go to Supabase Dashboard -> Storage -> Policies
-- 2. Find 'portfolio-media' bucket
-- 3. Click 'New Policy' -> Select 'For full customization'
-- 4. Set Policy Name: 'Allow all storage access'
-- 5. Allowed Operations: SELECT, INSERT, UPDATE, DELETE
-- 6. Target roles: public, anon, authenticated
-- 7. Click 'Save policy'!

