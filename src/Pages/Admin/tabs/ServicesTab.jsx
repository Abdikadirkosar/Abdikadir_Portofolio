import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { safeQuery } from "../../../lib/supabase";
import { toast } from "react-toastify";

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "Web"
  });

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await safeQuery(sb => sb.from("db_services").select("*").order("created_at", { ascending: false }));
    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleEditClick = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon || "Web"
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      icon: "Web"
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    const { error } = await safeQuery(sb => sb.from("db_services").delete().eq("id", id));
    if (!error) {
      toast.success("Service deleted");
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await safeQuery(sb => sb.from("db_services").update(form).eq("id", editingId));
      if (!error) {
        toast.success("Service updated");
        fetchServices();
        setIsModalOpen(false);
      }
    } else {
      const { error } = await safeQuery(sb => sb.from("db_services").insert([form]));
      if (!error) {
        toast.success("Service added");
        fetchServices();
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Services Offered</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage services you offer to clients (AI solutions, development, UI/UX).</p>
        </div>
        <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#4FFFB0]/20 border-t-[#4FFFB0] rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-xs font-mono">No services published.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between gap-4">
              <div>
                <p className="text-white text-xs font-bold">{s.title}</p>
                <p className="text-white/40 text-xs mt-2 leading-relaxed">{s.description}</p>
              </div>
              <div className="flex justify-between items-center border-t border-white/[0.06] pt-3">
                <span className="text-[10px] text-white/20 font-mono">Type: {s.icon}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(s)} className="text-white/40 hover:text-white p-1 cursor-pointer"><Edit2 size={12} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-400/50 hover:text-red-400 p-1 cursor-pointer"><Trash2 size={12} /></button>
                </div>
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
              <h3 className="text-white font-bold text-sm mb-4">{editingId ? "Edit Service" : "Add Service"}</h3>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Service Title</label>
                  <input type="text" name="title" value={form.title} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Icon Type</label>
                  <select name="icon" value={form.icon} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30">
                    <option value="Web">Web Dev</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="AI">AI Solutions</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="API">API Development</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/40">Description</label>
                  <textarea name="description" rows="3" value={form.description} onChange={handleInputChange} required className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg text-white text-xs p-2.5 outline-none focus:border-[#4FFFB0]/30 resize-none" />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[#4FFFB0]/10 border border-[#4FFFB0]/25 text-[#4FFFB0] hover:bg-[#4FFFB0]/20 transition-all cursor-pointer">
                  <Save size={12} className="inline mr-1" /> Save Service
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesTab;
