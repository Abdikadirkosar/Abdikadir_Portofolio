-- ============================================================
-- ABDIKADIR PORTFOLIO — EXPANDED SUPABASE DATABASE SETUP
-- Run this in your Supabase SQL Editor to support all Dashboard Modules!
-- ============================================================

-- 1. PROFILE TABLE
CREATE TABLE IF NOT EXISTS profile (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  full_name     TEXT NOT NULL,
  job_title     TEXT,
  bio           TEXT,
  about_me      TEXT,
  location      TEXT,
  email         TEXT,
  phone         TEXT,
  profile_img   TEXT,
  cover_img     TEXT,
  resume_url    TEXT,
  github_link   TEXT,
  linkedin_link TEXT,
  whatsapp_link TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile values if empty
INSERT INTO profile (id, full_name, job_title, bio, location, email, github_link, linkedin_link, whatsapp_link)
VALUES (1, 'Abdikadir Kosar Osman', 'AI Engineer & Full Stack Developer', 'Building intelligent AI applications & high-performance web systems.', 'Hargeisa, Somaliland', 'abdikadirkosara@gmail.com', 'https://github.com/abdikadirkosar', 'https://linkedin.com/in/abdikadirkosar', 'https://wa.me/252634812030')
ON CONFLICT (id) DO NOTHING;

-- 2. PROJECTS TABLE (Expanded)
CREATE TABLE IF NOT EXISTS db_projects (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  tech          TEXT[], -- Array of strings
  image_url     TEXT,
  video_url     TEXT,
  github_link   TEXT,
  live_link     TEXT,
  category      TEXT,
  featured      BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'Completed', -- Completed / In Progress
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS db_skills (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL, -- Languages / Frameworks / Databases / Cloud / AI-ML
  percentage    INTEGER DEFAULT 80,
  icon          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS db_experience (
  id            BIGSERIAL PRIMARY KEY,
  company       TEXT NOT NULL,
  position      TEXT NOT NULL,
  start_date    TEXT,
  end_date      TEXT DEFAULT 'Present',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS db_education (
  id            BIGSERIAL PRIMARY KEY,
  university    TEXT NOT NULL,
  degree        TEXT NOT NULL,
  department    TEXT,
  year          TEXT,
  gpa           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS db_certificates (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  issuer        TEXT NOT NULL,
  issue_date    TEXT,
  credential_url TEXT,
  pdf_url       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BLOGS TABLE
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

-- 8. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS db_testimonials (
  id            BIGSERIAL PRIMARY KEY,
  client_name   TEXT NOT NULL,
  company       TEXT,
  photo_url     TEXT,
  review        TEXT NOT NULL,
  rating        INTEGER DEFAULT 5,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SERVICES TABLE
CREATE TABLE IF NOT EXISTS db_services (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  icon          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SEO SETTINGS TABLE
CREATE TABLE IF NOT EXISTS db_seo (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  meta_title    TEXT,
  meta_desc     TEXT,
  keywords      TEXT,
  og_image      TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO db_seo (id, meta_title, meta_desc, keywords)
VALUES (1, 'Abdikadir Kosar | AI Engineer & Full Stack Developer', 'AI Engineer and Full Stack Developer based in Hargeisa, Somaliland.', 'AI, Full Stack, React, Python, Somaliland')
ON CONFLICT (id) DO NOTHING;

-- 11. APPEARANCE SETTINGS
CREATE TABLE IF NOT EXISTS db_appearance (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  theme         TEXT DEFAULT 'dark',
  accent_color  TEXT DEFAULT '#4FFFB0',
  font_family   TEXT DEFAULT 'Outfit',
  animations    BOOLEAN DEFAULT TRUE,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO db_appearance (id, theme, accent_color, font_family, animations)
VALUES (1, 'dark', '#4FFFB0', 'Outfit', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 12. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PAGE VIEWS TABLE (Enhanced with country, browser, referrer)
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  page        TEXT NOT NULL DEFAULT 'home',
  device      TEXT DEFAULT 'desktop',
  browser     TEXT,
  country     TEXT DEFAULT 'Unknown',
  referrer    TEXT DEFAULT 'Direct',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns just in case the page_views table already exists without them
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Unknown';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT 'Direct';

-- 14. PROJECT LIKES TABLE
CREATE TABLE IF NOT EXISTS project_likes (
  id          BIGSERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE RLS & CREATING PUBLIC POLICIES FOR SECURE ADMIN EDITING
-- ============================================================

ALTER TABLE profile         ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_experience   ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_education    ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_blogs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_seo          ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_appearance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views      ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes   ENABLE ROW LEVEL SECURITY;

-- DROP old policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "allow_read_profile"      ON profile;
DROP POLICY IF EXISTS "allow_read_projects"     ON db_projects;
DROP POLICY IF EXISTS "allow_read_skills"       ON db_skills;
DROP POLICY IF EXISTS "allow_read_experience"   ON db_experience;
DROP POLICY IF EXISTS "allow_read_education"    ON db_education;
DROP POLICY IF EXISTS "allow_read_certificates" ON db_certificates;
DROP POLICY IF EXISTS "allow_read_blogs"        ON db_blogs;
DROP POLICY IF EXISTS "allow_read_testimonials" ON db_testimonials;
DROP POLICY IF EXISTS "allow_read_services"     ON db_services;
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
DROP POLICY IF EXISTS "allow_all_blogs"         ON db_blogs;
DROP POLICY IF EXISTS "allow_all_testimonials"  ON db_testimonials;
DROP POLICY IF EXISTS "allow_all_services"      ON db_services;
DROP POLICY IF EXISTS "allow_all_seo"           ON db_seo;
DROP POLICY IF EXISTS "allow_all_appearance"    ON db_appearance;

-- 1. Read access for everyone (anon)
CREATE POLICY "allow_read_profile"      ON profile         FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_projects"     ON db_projects     FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_skills"       ON db_skills       FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_experience"   ON db_experience   FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_education"    ON db_education    FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_certificates" ON db_certificates FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_blogs"        ON db_blogs        FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_testimonials" ON db_testimonials FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_services"     ON db_services     FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_seo"          ON db_seo          FOR SELECT TO anon USING (true);
CREATE POLICY "allow_read_appearance"   ON db_appearance   FOR SELECT TO anon USING (true);
CREATE POLICY "anon read messages"      ON messages        FOR SELECT TO anon USING (true);
CREATE POLICY "anon read views"         ON page_views      FOR SELECT TO anon USING (true);
CREATE POLICY "anon read likes"         ON project_likes   FOR SELECT TO anon USING (true);

-- 2. Edit access for everyone with Anon key (makes setup seamless for dashboard editing)
CREATE POLICY "allow_all_profile"       ON profile         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_projects"      ON db_projects     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_skills"        ON db_skills       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_experience"    ON db_experience   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_education"     ON db_education    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_certificates"  ON db_certificates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_blogs"         ON db_blogs        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_testimonials"  ON db_testimonials FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_services"      ON db_services     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_seo"           ON db_seo          FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_appearance"    ON db_appearance   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon insert messages"    ON messages        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert views"       ON page_views      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert likes"       ON project_likes   FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon update messages"    ON messages        FOR UPDATE TO anon USING (true);
CREATE POLICY "anon delete messages"    ON messages        FOR DELETE TO anon USING (true);

-- ============================================================
-- STORAGE BUCKETS SETUP
-- ============================================================

-- Create 'portfolio-media' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Drop old storage policies to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete" ON storage.objects;

-- Storage policies
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'portfolio-media');
CREATE POLICY "Allow anon insert" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'portfolio-media');
CREATE POLICY "Allow anon update" ON storage.objects FOR UPDATE TO anon WITH CHECK (bucket_id = 'portfolio-media');
CREATE POLICY "Allow anon delete" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'portfolio-media');
