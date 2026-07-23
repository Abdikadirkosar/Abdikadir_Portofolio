# 🚀 Abdikadir Kosar Osman — AI Engineer & Full Stack Portfolio

An ultra-modern, high-performance developer portfolio built with React 19, Vite, Tailwind CSS, Supabase, Framer Motion, GSAP, and Three.js canvas backgrounds.

![Portfolio Banner](/public/projects-images/Screenshot%202026-05-16%20022624.png)

---

## ✨ Features

- **🎨 Modern Glassmorphic Aesthetic**: Cyberpunk dark mode with dynamic accent customization.
- **⚡ Interactive 3D & Canvas**: Three.js Aurora background, Neural background, and GSAP scroll reveals.
- **📦 Project Lightbox Modal**: Interactive detail view for selected portfolio projects.
- **🛡️ Admin Dashboard**: Full CMS to manage projects, blogs, services, education, experience, certificates, testimonials, and view real-time analytics.
- **🎵 Sound Feedback System**: Optional spatial ambient UI audio cues.
- **🚀 Vercel Ready**: Preconfigured with `vercel.json` SPA rewrite rules.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Framer Motion, GSAP, Three.js / Drei
- **Backend & Database**: Supabase (PostgreSQL, Storage, Realtime Auth)
- **Deployment**: Vercel & GitHub

---

## ⚡ Setup & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abdikadirkosar/Abdikadir_Portofolio-.git
   cd Abdikadir_Portofolio-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 🗄️ Supabase Storage & RLS Setup

If you encounter `Upload failed: new row violates row-level security policy` when uploading images in the Admin dashboard:

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the script provided in [`supabase_fix_and_sync.sql`](./supabase_fix_and_sync.sql).
3. This creates the `portfolio-media` storage bucket and applies public upload and read permissions.

---

## 🌐 Deploying to Vercel

1. Push your changes to **GitHub**:
   ```bash
   git add .
   git commit -m "Deploying portfolio to Vercel"
   git push origin main
   ```
2. Import your GitHub repository in **Vercel**.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**!

