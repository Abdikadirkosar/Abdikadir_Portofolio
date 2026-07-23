import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const ExperienceTab = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "Present",
    description: ""
  });

  const fetchExperience = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_experience").select("*").order("created_at", { ascending: false }));
    setExperience(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      position: exp.position,
      start_date: exp.start_date || "",
      end_date: exp.end_date || "Present",
      description: exp.description || ""
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      company: "",
      position: "",
      start_date: "",
      end_date: "Present",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    const { error } = await safeQuery(sb => sb.from("db_experience").delete().eq("id", id));
    if (!error) {
      toast.success("Experience deleted");
      setExperience(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_experience").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Experience updated");
        fetchExperience();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_experience").insert([form]));
      if (!error) {
        toast.success("Experience added");
        fetchExperience();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Experience Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage work experience history and roles.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : experience.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No experience items found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {experience.map(exp => (
            <div key={exp.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex justify-between items-start">
              <div>
                <p className="text-white text-xs font-bold">{exp.position} at {exp.company}</p>
                <p className="text-[10px] text-[#4FFFB0] font-mono mt-0.5">{exp.start_date} — {exp.end_date}</p>
                <p className="text-white/40 text-xs mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(exp)} className="text-white/40 hover:text-white p-1"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(exp.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Experience" : "Add Experience"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Company</label>
                    <input type="text" name="company" value={form.company} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Position</label>
                    <input type="text" name="position" value={form.position} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Start Date</label>
                    <input type="text" name="start_date" placeholder="e.g. June 2024" value={form.start_date} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">End Date</label>
                    <input type="text" name="end_date" placeholder="e.g. Present" value={form.end_date} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Description</label>
                  <textarea name="description" rows="3" value={form.description} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Experience
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceTab;
