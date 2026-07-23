-- ============================================================
-- PORTFOLIO DATABASE SEED  — Run this in Supabase SQL Editor
-- Safe to run multiple times (DROP + CREATE + ON CONFLICT).
-- ============================================================

-- ── 1. DROP existing tables so we start clean ───────────────
DROP TABLE IF EXISTS project_likes   CASCADE;
DROP TABLE IF EXISTS page_views      CASCADE;
DROP TABLE IF EXISTS messages        CASCADE;
DROP TABLE IF EXISTS db_appearance   CASCADE;
DROP TABLE IF EXISTS db_seo          CASCADE;
DROP TABLE IF EXISTS db_profile      CASCADE;
DROP TABLE IF EXISTS db_blogs        CASCADE;
DROP TABLE IF EXISTS db_testimonials CASCADE;
DROP TABLE IF EXISTS db_certificates CASCADE;
DROP TABLE IF EXISTS db_education    CASCADE;
DROP TABLE IF EXISTS db_experience   CASCADE;
DROP TABLE IF EXISTS db_projects     CASCADE;

-- ── 2. CREATE TABLES ─────────────────────────────────────────

CREATE TABLE db_projects (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT DEFAULT 'Full Stack',
  tech        TEXT,
  github_link TEXT,
  live_link   TEXT,
  image_url   TEXT,
  featured    BOOLEAN DEFAULT false,
  status      TEXT DEFAULT 'completed',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_experience (
  id          BIGSERIAL PRIMARY KEY,
  company     TEXT NOT NULL,
  position    TEXT NOT NULL,
  start_date  TEXT,
  end_date    TEXT,
  description TEXT,
  accent      TEXT DEFAULT '#4FFFB0',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_education (
  id          BIGSERIAL PRIMARY KEY,
  university  TEXT NOT NULL,
  degree      TEXT,
  department  TEXT,
  year        TEXT,
  gpa         TEXT,
  accentColor TEXT DEFAULT '#4FFFB0',
  icon        TEXT DEFAULT 'GraduationCap',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_certificates (
  id             BIGSERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  issuer         TEXT,
  issue_date     TEXT,
  credential_url TEXT,
  pdf_url        TEXT,
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_testimonials (
  id          BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  company     TEXT,
  review      TEXT,
  rating      INTEGER DEFAULT 5,
  photo_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_blogs (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT DEFAULT 'Tech',
  tags        TEXT,
  content     TEXT,
  cover_image TEXT,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE db_profile (
  id       INTEGER PRIMARY KEY DEFAULT 1,
  name     TEXT DEFAULT 'Abdikadir Kosar',
  title    TEXT DEFAULT 'Full Stack Engineer & AI Specialist',
  bio      TEXT,
  avatar   TEXT,
  email    TEXT,
  phone    TEXT,
  location TEXT,
  github   TEXT,
  linkedin TEXT,
  twitter  TEXT
);

CREATE TABLE db_seo (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  meta_title TEXT,
  meta_desc  TEXT,
  keywords   TEXT
);

CREATE TABLE db_appearance (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  accent_color TEXT DEFAULT '#4FFFB0'
);

CREATE TABLE messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_views (
  id         BIGSERIAL PRIMARY KEY,
  page       TEXT NOT NULL,
  device     TEXT DEFAULT 'desktop',
  browser    TEXT,
  country    TEXT,
  referrer   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_likes (
  id         BIGSERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. ROW LEVEL SECURITY ────────────────────────────────────

ALTER TABLE db_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_experience   ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_education    ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_blogs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_seo          ENABLE ROW LEVEL SECURITY;
ALTER TABLE db_appearance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views      ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes   ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public read projects"     ON db_projects     FOR SELECT TO anon USING (true);
CREATE POLICY "public read experience"   ON db_experience   FOR SELECT TO anon USING (true);
CREATE POLICY "public read education"    ON db_education    FOR SELECT TO anon USING (true);
CREATE POLICY "public read certificates" ON db_certificates FOR SELECT TO anon USING (true);
CREATE POLICY "public read testimonials" ON db_testimonials FOR SELECT TO anon USING (true);
CREATE POLICY "public read blogs"        ON db_blogs        FOR SELECT TO anon USING (true);
CREATE POLICY "public read profile"      ON db_profile      FOR SELECT TO anon USING (true);
CREATE POLICY "public read seo"          ON db_seo          FOR SELECT TO anon USING (true);
CREATE POLICY "public read appearance"   ON db_appearance   FOR SELECT TO anon USING (true);

-- Anonymous inserts
CREATE POLICY "anon insert messages" ON messages      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert views"    ON page_views    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert likes"    ON project_likes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read likes"      ON project_likes FOR SELECT TO anon USING (true);

-- Authenticated full access
CREATE POLICY "auth full projects"     ON db_projects     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full experience"   ON db_experience   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full education"    ON db_education    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full certificates" ON db_certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full testimonials" ON db_testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full blogs"        ON db_blogs        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full profile"      ON db_profile      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full seo"          ON db_seo          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full appearance"   ON db_appearance   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth read messages"     ON messages        FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth update messages"   ON messages        FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth delete messages"   ON messages        FOR DELETE TO authenticated USING (true);
CREATE POLICY "auth read views"        ON page_views      FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read likes"        ON project_likes   FOR SELECT TO authenticated USING (true);

-- ── 4. SEED DATA ─────────────────────────────────────────────

-- Projects
INSERT INTO db_projects (name, description, category, tech, github_link, live_link, image_url, featured) VALUES
('School Management System',
 'A comprehensive administrative system built in C# to manage student enrollments, class scheduling, teacher assignments, grading databases, and academic reporting. Designed for local educational institutes to digitalise their workflows.',
 'Full Stack', 'C#, SQL Server, Windows Forms, .NET Framework',
 'https://github.com/abdikadirkosar', '', '', true),

('Hotel Management System',
 'An enterprise-level reservation and operations suite. Features room availability trackers, reservation scheduling, check-in/check-out billing systems, staff allocation, and detailed financial log reports, built entirely in C#.',
 'Full Stack', 'C#, SQL Server, Windows Forms, .NET Framework',
 'https://github.com/abdikadirkosar', '', '', true),

('Gym Management System',
 'A custom desktop utility for local fitness centers. Manages member registrations, gym membership subscription statuses, payment tracking, trainer schedules, and member check-ins with an intuitive UI.',
 'Full Stack', 'C#, SQL Server, Windows Forms, .NET Framework',
 'https://github.com/abdikadirkosar', '', '', true),

('AI Agent & Chatbot Integrator',
 'A web platform that integrates generative AI models to build custom chatbots. Features context-aware prompt templates, conversational memory, and simple RAG document Q&A to answer user queries dynamically.',
 'AI', 'React.js, Python, LangChain, Generative AI, Supabase',
 'https://github.com/abdikadirkosar', '', '', true);

-- Experience
INSERT INTO db_experience (company, position, start_date, end_date, description, accent) VALUES
('Freelance & Independent Projects',
 'Independent Software Developer',
 '2022', 'Present',
 'Developing custom desktop and web solutions for local businesses. Engineered comprehensive C# management systems (School, Hotel, and Gym systems) using WinForms and SQL Server to automate billing, scheduling, and registries.',
 '#4FFFB0'),

('AI & Automation Projects',
 'Independent AI Integrator',
 '2023', 'Present',
 'Building custom generative AI integrations. Developed LLM-driven agents and chatbots utilizing LangChain and Python, connecting vector storage to web frontends for conversational document search.',
 '#a855f7');

-- Education
INSERT INTO db_education (university, degree, department, year, gpa, accentColor, icon) VALUES
('New Generation University — Gabiley, Somaliland',
 'Bachelor of Science in Computer Science & Information Technology',
 'Department of Computing & Digital Innovation',
 '2023 — Present', 'Grade: A — Active', '#4FFFB0', 'GraduationCap'),

('DeepLearning.AI / Stanford Online',
 'Professional Certificate — Deep Learning Specialization',
 'Neural Networks, CNNs, RNNs, Transformers',
 '2023', 'Top 3% of Cohort', '#a855f7', 'BookOpen');

-- Certificates
INSERT INTO db_certificates (name, issuer, issue_date, credential_url) VALUES
('Deep Learning Specialization (5 Courses)', 'DeepLearning.AI / Coursera', '2023',
 'https://www.coursera.org/specializations/deep-learning'),
('Meta Front-End Developer Professional Certificate', 'Meta (Facebook)', '2023',
 'https://www.coursera.org/professional-certificates/meta-front-end-developer'),
('Full Stack Open — University of Helsinki', 'University of Helsinki', '2023',
 'https://fullstackopen.com/en'),
('LangChain & Vector Databases in Production', 'Activeloop / DeepLearning.AI', '2024',
 'https://learn.activeloop.ai/courses/langchain');

-- Testimonials
INSERT INTO db_testimonials (client_name, company, review, rating) VALUES
('Ahmed Al-Rashid', 'SomTech School Director',
 'Abdikadir delivered a high-quality C# School Management system that streamlined our registrations and grade records. His code is fast, reliable, and very easy for our staff to navigate.', 5),

('Dr. Huda Hassan', 'Local Gym Owner',
 'The Gym Management system Abdikadir built in C# has automated our entire membership and payment tracking process. Highly professional work and excellent support throughout.', 5),

('Mohamed Abdi Warsame', 'Somali Plaza Hotel Manager',
 'Our hotel bookings and billing processes are now fully managed by the C# system Abdikadir developed. Excellent desktop software engineering and very dependable developer.', 5);

-- Blog Posts
INSERT INTO db_blogs (title, category, tags, content, published) VALUES
('Building Custom C# Desktop Applications for Local Businesses',
 'Desktop', 'C#, SQL Server, WinForms',
 'An analysis of developing lightweight, high-performance database management tools for local schools and services using C# Windows Forms and local database connections.',
 true),

('Developing AI-Powered Assistants with LangChain & Python',
 'AI', 'LangChain, Python, LLM',
 'A beginner-friendly guide to building custom chatbots that search documents (RAG) and automate tasks using Python and vector stores.',
 true);

-- Profile (upsert — safe to re-run)
INSERT INTO db_profile (id, name, title, bio, email, location, github, linkedin) VALUES
(1,
 'Abdikadir Kosar',
 'Fullstack AI Developer & Software Engineer',
 'I craft digital systems and full-stack solutions. Senior Computer Science student at New Generation University. Experienced in building C# enterprise management systems, full-stack web applications, and AI integrations.',
 'Abdikadirkosara@gmail.com',
 'Hargeisa, Somaliland',
 'https://github.com/abdikadirkosar',
 'https://linkedin.com/in/abdikadirkosar')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, title = EXCLUDED.title, bio = EXCLUDED.bio,
  email = EXCLUDED.email, location = EXCLUDED.location,
  github = EXCLUDED.github, linkedin = EXCLUDED.linkedin;

-- SEO
INSERT INTO db_seo (id, meta_title, meta_desc, keywords) VALUES
(1,
 'Abdikadir Kosar | Fullstack AI Developer & Software Engineer',
 'Fullstack AI Developer & Software Engineer based in Hargeisa, Somaliland. Experienced in building C# systems, full-stack websites, and custom AI agents.',
 'full stack engineer, AI developer, React developer, C#, SQL Server, Somaliland, portfolio')
ON CONFLICT (id) DO UPDATE SET
  meta_title = EXCLUDED.meta_title, meta_desc = EXCLUDED.meta_desc, keywords = EXCLUDED.keywords;

-- Appearance
INSERT INTO db_appearance (id, accent_color) VALUES (1, '#4FFFB0')
ON CONFLICT (id) DO NOTHING;
