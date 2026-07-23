import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Save, Download, FileCode } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const SeoTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seo, setSeo] = useState({
    meta_title: "",
    meta_desc: "",
    keywords: "",
    og_image: ""
  });

  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      const { data } = await safeQuery(sb => sb.from("db_seo").select("*").eq("id", 1).single());
      if (data) {
        setSeo(data);
      }
      setLoading(false);
    };
    fetchSeo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await safeQuery(sb => sb.from("db_seo").update(seo).eq("id", 1));
    setSaving(false);
    if (!error) {
      toast.success("SEO settings saved successfully!");
    } else {
      toast.error("Failed to save SEO settings");
    }
  };

  const generateSitemap = async () => {
    const baseUrl = window.location.origin.replace("/admin", "");
    const staticPages = ["/", "/about", "/skills", "/projects", "/experience", "/contact", "/blog"];

    // Fetch dynamic blog slugs from DB
    let blogUrls = [];
    try {
      const { data } = await safeQuery(sb => sb.from("db_blogs").select("id, created_at").eq("published", true));
      if (data) blogUrls = data.map(b => ({ loc: `${baseUrl}/blog/${b.id}`, lastmod: b.created_at?.split("T")[0] }));
    } catch {}

    const now = new Date().toISOString().split("T")[0];
    const staticEntries = staticPages.map(p => `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.8"}</priority>\n  </url>`).join("\n");
    const dynamicEntries = blogUrls.map(b => `  <url>\n    <loc>${b.loc}</loc>\n    <lastmod>${b.lastmod || now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticEntries}\n${dynamicEntries}\n</urlset>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("sitemap.xml downloaded! Place it in your /public folder.");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">SEO & Meta Settings</h1>
          <p className="text-white/40 text-xs mt-0.5">Optimize search rankings and social media link previews.</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-xl">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Meta Title</label>
            <input 
              type="text" 
              name="meta_title"
              value={seo.meta_title || ""}
              onChange={handleChange}
              required
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Meta Description</label>
            <textarea 
              name="meta_desc"
              rows="3"
              value={seo.meta_desc || ""}
              onChange={handleChange}
              required
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Keywords (comma separated)</label>
            <input 
              type="text" 
              name="keywords"
              value={seo.keywords || ""}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">OpenGraph Preview Image URL</label>
            <input 
              type="text" 
              name="og_image"
              value={seo.og_image || ""}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 w-max px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 transition-all cursor-pointer mt-2"
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>

        </form>
      </div>

      {/* Sitemap Generator */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileCode size={14} className="text-[#4FFFB0]" />
              <h2 className="text-white font-semibold text-sm">Sitemap Generator</h2>
            </div>
            <p className="text-white/40 text-xs max-w-sm">
              Auto-generates <code className="text-[#4FFFB0] text-[10px]">sitemap.xml</code> with all static pages + published blog posts.
              Download and place it in your <code className="text-[#4FFFB0] text-[10px]">/public</code> folder.
            </p>
          </div>
          <button
            type="button"
            onClick={generateSitemap}
            className="flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer"
          >
            <Download size={13} /> Generate &amp; Download
          </button>
        </div>
      </div>

    </div>
  );
};

export default SeoTab;
