import { createClient } from "@supabase/supabase-js";

// ── Supabase Configuration ────────────────────────────────────────────────────
// Add your Supabase URL and Anon Key to a .env file:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
//
// If env vars are missing, we fall back to a no-op mock so the app still runs.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = isConfigured;

// ── Helper: safe query wrapper ────────────────────────────────────────────────
// Returns { data, error } — if Supabase isn't configured, returns mock empty
export async function safeQuery(fn) {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  try {
    return await fn(supabase);
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

// ── SQL to create tables (run once in Supabase SQL editor) ───────────────────
/*
-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  page        TEXT NOT NULL,
  device      TEXT DEFAULT 'desktop',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Project likes table
CREATE TABLE IF NOT EXISTS project_likes (
  id          BIGSERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security + allow anonymous inserts for page_views & project_likes
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon insert messages"   ON messages        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert views"      ON page_views      FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert likes"      ON project_likes   FOR INSERT TO anon WITH CHECK (true);

-- Admin (authenticated) can read everything
CREATE POLICY "auth read messages"     ON messages        FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read views"        ON page_views      FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read likes"        ON project_likes   FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth update messages"   ON messages        FOR UPDATE TO authenticated USING (true);
*/

// Helper: Convert File to Base64 Data URL
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}

// ── File Upload & Deletion Helpers (Supabase Storage + Base64 Fallback) ──
export async function uploadFile(file, folder = "media") {
  if (!file) return "";

  // Attempt Supabase Storage Upload
  if (supabase) {
    const fileExt = file.name.split('.').pop();
    const cleanName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;
    
    const buckets = ['portfolio-media', 'portfolio', 'media', 'images', 'public'];

    // Try auto-creating 'portfolio-media' bucket if missing
    try {
      await supabase.storage.createBucket('portfolio-media', { public: true });
    } catch (e) {
      // Ignore error
    }

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
          return publicUrl;
        }
      } catch (e) {
        // Fallthrough to next bucket
      }
    }
  }

  // ⚡ Seamless Base64 Fallback:
  // If Supabase Storage bucket is missing or restricted on Supabase Cloud,
  // encode the image into Base64 Data URL so the user's upload NEVER fails!
  try {
    const base64Url = await fileToBase64(file);
    return base64Url;
  } catch (err) {
    throw new Error("Imeda/sawirka lama habayn karo. Fadlan dub mar kale try-garee.");
  }
}

export async function deleteFileByUrl(url) {
  if (!supabase) return { error: new Error("Supabase not configured") };
  try {
    const bucketToken = "/portfolio-media/";
    const idx = url.indexOf(bucketToken);
    if (idx === -1) return { error: new Error("Invalid storage URL") };
    
    const filePath = decodeURIComponent(url.substring(idx + bucketToken.length));
    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .remove([filePath]);
      
    return { data, error };
  } catch (err) {
    console.error("Delete media error:", err);
    return { error: err };
  }
}

// ── Analytics Page View Tracker ───────────────────────────────────────────────
export async function trackPageView(pageName) {
  if (!supabase) return;
  try {
    // 1. Detect Device Type
    const ua = navigator.userAgent;
    let device = "desktop";
    if (/tablet|ipad|playbook|silk/i.test(ua)) device = "tablet";
    else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) device = "mobile";

    // 2. Detect Browser
    let browser = "Other";
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "IE";
    else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    // 3. Detect Referrer
    let referrer = "Direct";
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        referrer = refUrl.hostname;
      } catch (e) {
        referrer = document.referrer;
      }
    }

    // 4. Geolocation (cache in sessionStorage, using CORS-free API)
    let country = sessionStorage.getItem("visitor_country");
    if (!country) {
      try {
        const res = await fetch("https://ipwho.is/", { mode: "cors" });
        if (res.ok) {
          const info = await res.json();
          country = info.country || "Global";
          sessionStorage.setItem("visitor_country", country);
        }
      } catch (err) {
        country = "Global";
      }
    }

    // 5. Insert row into page_views (silent error handling so 403 never pollutes console)
    await supabase.from("page_views").insert([
      {
        page: pageName.toLowerCase(),
        device,
        browser,
        country: country || "Global",
        referrer
      }
    ]).then(() => {}).catch(() => {});
  } catch (err) {
    // Silent catch
  }
}

