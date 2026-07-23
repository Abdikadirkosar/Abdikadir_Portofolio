import { useEffect, useState } from "react";
import { Save, Palette } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const colors = [
  { hex: "#4FFFB0", name: "Neon Green (Signature)" },
  { hex: "#3b82f6", name: "Cyber Blue" },
  { hex: "#a855f7", name: "Neon Purple" },
  { hex: "#f97316", name: "Radiant Orange" },
  { hex: "#ec4899", name: "Hot Pink" }
];

const AppearanceTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appearance, setAppearance] = useState({
    theme: "dark",
    accent_color: "#4FFFB0",
    font_family: "Outfit",
    animations: true
  });

  useEffect(() => {
    const fetchAppearance = async () => {
      setLoading(true);
      const { data } = await safeQuery(sb => sb.from("db_appearance").select("*").eq("id", 1).single());
      if (data) {
        setAppearance(data);
      }
      setLoading(false);
    };
    fetchAppearance();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearance(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const selectColor = (hex) => {
    setAppearance(prev => ({ ...prev, accent_color: hex }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await safeQuery(sb => sb.from("db_appearance").update(appearance).eq("id", 1));
    setSaving(false);
    if (!error) {
      toast.success("Appearance settings applied! Refresh the portfolio to see changes.");
    } else {
      toast.error("Failed to save settings");
    }
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
          <h1 className="text-xl font-bold text-white">Appearance & Branding</h1>
          <p className="text-white/40 text-xs mt-0.5">Customize global styles, accent colors, typography, and motion options.</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-xl">
          
          {/* Theme */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Base Theme Mode</label>
            <select 
              name="theme" 
              value={appearance.theme} 
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
            >
              <option value="dark">Vibrant Cyber Dark (Default)</option>
              <option value="light">Premium Modern Light</option>
            </select>
          </div>

          {/* Accent Color */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Branding Accent Color</label>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => selectColor(c.hex)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    appearance.accent_color === c.hex 
                      ? "border-white scale-105" 
                      : "border-white/10 hover:border-white/30"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {appearance.accent_color === c.hex && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/30 font-mono mt-0.5">Active accent: {appearance.accent_color}</p>
          </div>

          {/* Typography */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Primary Font Family</label>
            <select 
              name="font_family" 
              value={appearance.font_family} 
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30"
            >
              <option value="Outfit">Outfit (Signature Variable)</option>
              <option value="Geist">Geist Mono / Sans</option>
              <option value="Inter">Inter Standard</option>
            </select>
          </div>

          {/* Motion toggle */}
          <div className="flex items-center gap-2 border-t border-white/[0.06] pt-4 mt-2">
            <input 
              type="checkbox" 
              name="animations" 
              id="animations" 
              checked={appearance.animations} 
              onChange={handleChange} 
              className="cursor-pointer"
            />
            <label htmlFor="animations" className="text-xs text-white/50 select-none cursor-pointer">
              Enable high-end Framer Motion & GSAP animations
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 w-max px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 hover:border-[#4FFFB0]/40 transition-all cursor-pointer mt-2"
          >
            <Save size={13} />
            {saving ? "Applying..." : "Apply Settings"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default AppearanceTab;
