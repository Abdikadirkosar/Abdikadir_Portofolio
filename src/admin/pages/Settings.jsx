import { useEffect, useState } from "react";
import { safeQuery, uploadFile } from "../../lib/supabase";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Field, Input, Textarea, SubmitBtn, PageLoader } from "../components/AdminUI";
import { User, Search, Palette, Save, Upload, Loader2 } from "lucide-react";

const ACCENT_PRESETS = [
  "#4FFFB0", "#a855f7", "#38bdf8", "#fb923c", "#f472b6",
  "#fbbf24", "#ef4444", "#06b6d4", "#84cc16", "#e879f9",
];

const SectionCard = ({ icon: Icon, title, accent = "#4FFFB0", children }) => (
  <div className="relative rounded-2xl border border-white/[0.06] bg-[#0d0d14]/70 overflow-hidden p-6">
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}50, transparent)` }} />
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <h2 className="text-white font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const [profile, setProfile] = useState({ name: "", title: "", bio: "", avatar: "", email: "", phone: "", location: "", github: "", linkedin: "", twitter: "" });
  const [seo, setSeo] = useState({ meta_title: "", meta_desc: "", keywords: "" });
  const [appearance, setAppearance] = useState({ accent_color: "#4FFFB0" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({ profile: false, seo: false, appearance: false });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadFile(file, "profile");
      setProfile(p => ({ ...p, avatar: publicUrl }));
      toast.success("Profile photo uploaded!");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [prof, seoData, app] = await Promise.all([
        safeQuery(sb => sb.from("db_profile").select("*").eq("id", 1).single()),
        safeQuery(sb => sb.from("db_seo").select("*").eq("id", 1).single()),
        safeQuery(sb => sb.from("db_appearance").select("*").eq("id", 1).single()),
      ]);
      if (prof.data) setProfile(p => ({ ...p, ...prof.data }));
      if (seoData.data) setSeo(s => ({ ...s, ...seoData.data }));
      if (app.data) setAppearance(a => ({ ...a, ...app.data }));
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(s => ({ ...s, profile: true }));
    const { error } = await safeQuery(sb =>
      sb.from("db_profile").upsert([{ id: 1, ...profile }])
    );
    setSaving(s => ({ ...s, profile: false }));
    if (error) { toast.error("Profile save failed: " + error.message); return; }
    toast.success("Profile saved!");
  };

  const saveSeo = async (e) => {
    e.preventDefault();
    setSaving(s => ({ ...s, seo: true }));
    const { error } = await safeQuery(sb =>
      sb.from("db_seo").upsert([{ id: 1, ...seo }])
    );
    setSaving(s => ({ ...s, seo: false }));
    if (error) { toast.error("SEO save failed"); return; }
    // Apply immediately
    if (seo.meta_title) document.title = seo.meta_title;
    toast.success("SEO settings saved!");
  };

  const saveAppearance = async (e) => {
    e.preventDefault();
    setSaving(s => ({ ...s, appearance: true }));
    const { error } = await safeQuery(sb =>
      sb.from("db_appearance").upsert([{ id: 1, ...appearance }])
    );
    setSaving(s => ({ ...s, appearance: false }));
    if (error) { toast.error("Appearance save failed"); return; }
    // Apply immediately
    document.documentElement.style.setProperty("--accent", appearance.accent_color);
    toast.success("Appearance updated!");
  };

  const sp = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const ss = (k, v) => setSeo(p => ({ ...p, [k]: v }));
  const sa = (k, v) => setAppearance(p => ({ ...p, [k]: v }));

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/30 text-sm mt-1">Manage your profile, SEO, and appearance</p>
      </div>

      {/* Profile */}
      <SectionCard icon={User} title="Profile" accent="#4FFFB0">
        <form onSubmit={saveProfile} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <Input value={profile.name || ""} onChange={e => sp("name", e.target.value)} placeholder="Abdikadir Mohamed" />
            </Field>
            <Field label="Job Title / Tagline">
              <Input value={profile.title || ""} onChange={e => sp("title", e.target.value)} placeholder="Full Stack Engineer & AI Specialist" />
            </Field>
          </div>
          <Field label="Short Bio">
            <Textarea rows={3} value={profile.bio || ""} onChange={e => sp("bio", e.target.value)} placeholder="I build intelligent systems..." />
          </Field>
          <Field label="Avatar / Profile Photo">
            <div className="flex gap-3 items-center">
              <Input value={profile.avatar || ""} onChange={e => sp("avatar", e.target.value)} placeholder="https://... or upload one" className="flex-1" />
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#4FFFB0]/20 bg-white/[0.02] hover:bg-[#4FFFB0]/5 text-white/50 hover:text-[#4FFFB0] text-xs font-mono transition-all cursor-pointer flex-shrink-0">
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Uploading..." : "Upload File"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Email">
              <Input type="email" value={profile.email || ""} onChange={e => sp("email", e.target.value)} placeholder="you@email.com" />
            </Field>
            <Field label="Phone">
              <Input value={profile.phone || ""} onChange={e => sp("phone", e.target.value)} placeholder="+1 234 567 8900" />
            </Field>
            <Field label="Location">
              <Input value={profile.location || ""} onChange={e => sp("location", e.target.value)} placeholder="Helsinki, Finland" />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="GitHub URL">
              <Input value={profile.github || ""} onChange={e => sp("github", e.target.value)} placeholder="https://github.com/..." />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={profile.linkedin || ""} onChange={e => sp("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="Twitter / X URL">
              <Input value={profile.twitter || ""} onChange={e => sp("twitter", e.target.value)} placeholder="https://twitter.com/..." />
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-white/[0.05]">
            <SubmitBtn loading={saving.profile}><><Save size={13} /> Save Profile</></SubmitBtn>
          </div>
        </form>
      </SectionCard>

      {/* SEO */}
      <SectionCard icon={Search} title="SEO & Meta" accent="#38bdf8">
        <form onSubmit={saveSeo} className="flex flex-col gap-4">
          <Field label="Page Title (browser tab)">
            <Input value={seo.meta_title || ""} onChange={e => ss("meta_title", e.target.value)} placeholder="Abdikadir Mohamed — Full Stack Engineer" />
          </Field>
          <Field label="Meta Description (Google snippet)">
            <Textarea rows={2} value={seo.meta_desc || ""} onChange={e => ss("meta_desc", e.target.value)} placeholder="I craft intelligent web systems..." />
          </Field>
          <Field label="Keywords (comma-separated)">
            <Input value={seo.keywords || ""} onChange={e => ss("keywords", e.target.value)} placeholder="full stack, AI engineer, React, Python" />
          </Field>
          <div className="flex justify-end pt-2 border-t border-white/[0.05]">
            <SubmitBtn loading={saving.seo}><><Save size={13} /> Save SEO</></SubmitBtn>
          </div>
        </form>
      </SectionCard>

      {/* Appearance */}
      <SectionCard icon={Palette} title="Appearance" accent="#a855f7">
        <form onSubmit={saveAppearance} className="flex flex-col gap-5">
          <Field label="Accent Color">
            <div className="flex flex-wrap gap-2.5 mb-3">
              {ACCENT_PRESETS.map(c => (
                <motion.button
                  key={c} type="button" onClick={() => sa("accent_color", c)}
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full border-2 transition-all duration-200 shadow-lg"
                  style={{
                    background: c,
                    borderColor: appearance.accent_color === c ? "white" : "transparent",
                    boxShadow: appearance.accent_color === c ? `0 0 12px ${c}60` : "none"
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.accent_color || "#4FFFB0"}
                onChange={e => sa("accent_color", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer bg-transparent"
              />
              <Input
                value={appearance.accent_color || ""}
                onChange={e => sa("accent_color", e.target.value)}
                placeholder="#4FFFB0"
                className="w-40 font-mono text-sm"
              />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ background: appearance.accent_color || "#4FFFB0", boxShadow: `0 0 10px ${appearance.accent_color}60` }} />
                <span className="text-white/30 text-xs font-mono">Preview</span>
              </div>
            </div>
          </Field>
          <div className="flex justify-end pt-2 border-t border-white/[0.05]">
            <SubmitBtn loading={saving.appearance}><><Save size={13} /> Apply Theme</></SubmitBtn>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default Settings;
