import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const EducationTab = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    university: "",
    degree: "",
    department: "",
    year: "",
    gpa: ""
  });

  const fetchEducation = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_education").select("*").order("created_at", { ascending: false }));
    setEducation(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (edu) => {
    setEditingId(edu.id);
    setForm({
      university: edu.university,
      degree: edu.degree,
      department: edu.department || "",
      year: edu.year || "",
      gpa: edu.gpa || ""
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      university: "",
      degree: "",
      department: "",
      year: "",
      gpa: ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education?")) return;
    const { error } = await safeQuery(sb => sb.from("db_education").delete().eq("id", id));
    if (!error) {
      toast.success("Education deleted");
      setEducation(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_education").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Education updated");
        fetchEducation();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_education").insert([form]));
      if (!error) {
        toast.success("Education added");
        fetchEducation();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Education Management</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage education, universities, and degrees.</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Education
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : education.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No education history found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {education.map(edu => (
            <div key={edu.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex justify-between items-start">
              <div>
                <p className="text-white text-xs font-bold">{edu.degree} in {edu.department}</p>
                <p className="text-[10px] text-[#4FFFB0] font-mono mt-0.5">{edu.university} — {edu.year}</p>
                {edu.gpa && <p className="text-white/35 text-[10px] font-mono mt-1">GPA: {edu.gpa}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(edu)} className="text-white/40 hover:text-white p-1"><Edit2 size={12} /></button>
                <button onClick={() => handleDelete(edu.id)} className="text-red-400/50 hover:text-red-400 p-1"><Trash2 size={12}/></button>
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
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Education" : "Add Education"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">University</label>
                  <input type="text" name="university" value={form.university} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Degree</label>
                    <input type="text" name="degree" placeholder="e.g. Bachelor" value={form.degree} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Department</label>
                    <input type="text" name="department" placeholder="e.g. Computer Science" value={form.department} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Year</label>
                    <input type="text" name="year" placeholder="e.g. 2021 - 2025" value={form.year} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">GPA (Optional)</label>
                    <input type="text" name="gpa" placeholder="e.g. 3.8/4.0" value={form.gpa} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Education
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationTab;
