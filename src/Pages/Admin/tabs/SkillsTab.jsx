import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Languages",
    percentage: 80,
    icon: ""
  });

  const fetchSkills = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_skills").select("*").order("created_at", { ascending: false }));
    setSkills(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage,
      icon: skill.icon || ""
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      name: "",
      category: "Languages",
      percentage: 80,
      icon: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    const { error } = await safeQuery(sb => sb.from("db_skills").delete().eq("id", id));
    if (!error) {
      toast.success("Skill deleted");
      setSkills(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_skills").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Skill updated");
        fetchSkills();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_skills").insert([form]));
      if (!error) {
        toast.success("Skill added");
        fetchSkills();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Skills Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage languages, frameworks, cloud, and percentages.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-bold">{skill.name}</p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">{skill.category} — {skill.percentage}%</p>
                <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-[#4FFFB0]" style={{ width: `${skill.percentage}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(skill)} className="text-white/40 hover:text-white p-1"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(skill.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={12}/></button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-[#0a0a0f] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Skill" : "Add Skill"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Skill Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Category</label>
                  <select name="category" value={form.category} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30">
                    <option value="Languages">Languages</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Databases">Databases</option>
                    <option value="Cloud">Cloud</option>
                    <option value="DevOps">DevOps</option>
                    <option value="AI-ML">AI / ML</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Skill Icon (Lucide name, URL, or Emoji)</label>
                  <input 
                    type="text" 
                    name="icon" 
                    value={form.icon} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Code2, Brain, Database"
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Skill Percentage ({form.percentage}%)</label>
                  <input type="range" name="percentage" min="10" max="100" value={form.percentage} onChange={handleInputChange} className="w-full" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Skill
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsTab;
